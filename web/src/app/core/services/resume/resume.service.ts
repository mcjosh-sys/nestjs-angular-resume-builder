import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, effect, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ApiResponse } from '@shared/models';
import { toast } from 'ngx-sonner';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  filter,
  finalize,
  map,
  Subject,
  take,
  tap,
  throwError,
} from 'rxjs';
import { ResumeApi } from 'src/app/api';
import { SearchParamsService } from 'src/app/core/services/search-params/search-params.service';
import { combineContexts, withTransform } from 'src/app/core/utils/context-helpers';
import { parseIsoString, toFormData } from 'src/app/core/utils/form-data-helpers';
import { filterEmptyStrings } from 'src/app/core/utils/object-helpers';
import { ResumeSaveFailedComponent } from '../../../features/editor/components/toasts/resume-save-failed.component';
import { ResumeData, ResumeServerData } from '../../../features/editor/models/resume.model';
import { invalidateCache, withCache } from '../../interceptors/http-cache';

export function resumeJsonReplacer(_key: unknown, value: unknown) {
  if (value instanceof File) {
    return {
      name: value.name,
      type: value.type,
      size: value.size,
      lastModified: value.lastModified,
    };
  }

  if (Array.isArray(value) && value.length === 0) {
    return undefined;
  }

  return value;
}

@Injectable()
export class ResumeService {
  private readonly _resumeData = signal<ResumeData>({});
  private readonly _lastSavedData = signal<ResumeData>({});
  private readonly _isSaving = signal(false);
  private readonly _isFetchingResume = signal(false);
  private readonly _isError = signal(false);
  private readonly _resumeId = signal<string | undefined>(undefined);
  private readonly _onFetchedResume = new Subject<void>();
  private readonly _loadedResume$ = new BehaviorSubject<ResumeServerData | null>(null);

  readonly resumeData = this._resumeData.asReadonly();
  readonly hasUnsavedChanges = computed(() => {
    return (
      JSON.stringify(filterEmptyStrings(this._resumeData()), resumeJsonReplacer) !==
      JSON.stringify(filterEmptyStrings(this._lastSavedData()), resumeJsonReplacer)
    );
  });
  readonly isSaving = this._isSaving.asReadonly();
  readonly isFetchingResume = this._isFetchingResume.asReadonly();
  readonly resumeId = this._resumeId.asReadonly();
  readonly isError = this._isError.asReadonly();
  readonly onFetchedResume = this._onFetchedResume.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly params: SearchParamsService<{ resumeId: string }>,
  ) {
    const debouncedResumeData$ = toObservable(this._resumeData).pipe(debounceTime(1500));
    debouncedResumeData$.subscribe((resumeData) => {
      this._isError.set(false);
      if (this.hasUnsavedChanges() && !this._isSaving()) {
        this.saveResume().subscribe();
      }
    });

    effect(() => {
      const resumeId = this._resumeId();
      const paramsResumeId = this.params.get('resumeId');
      if (resumeId && paramsResumeId !== resumeId) {
        this.params.set('resumeId', resumeId);
      }
    });
  }

  get transform() {
    return withTransform<ApiResponse<ResumeData>>({
      transformFn: parseIsoString,
      fieldName: 'data',
    });
  }

  setResumeData(data: ResumeData) {
    this._resumeData.update((prev) => filterEmptyStrings({ ...prev, ...data }));
  }

  loadResume(resume: ResumeServerData) {
    this._loadedResume$.next(resume);
  }

  getResume$(resumeId: string) {
    this._isFetchingResume.set(true);
    this._isError.set(false);
    const request$ = this.http
      .get<ApiResponse<ResumeServerData>>(ResumeApi.get(resumeId), {
        context: this.transform,
      })
      .pipe(map((res) => res.data));

    const observable$ = this._loadedResume$.value
      ? this._loadedResume$.asObservable().pipe(
          filter((data): data is ResumeServerData => data !== null),
          take(1),
        )
      : request$;
    return observable$.pipe(
      tap((data) => {
        this._resumeData.set(data);
        this._lastSavedData.set(data);
        this._resumeId.set(data.id);
        this._isError.set(false);
        this._onFetchedResume.next();
        this._loadedResume$.next(null);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.params.remove('resumeId');
          this._resumeId.set(undefined);
          return throwError(() => error);
        }
        this._isError.set(true);
        console.error(error);
        toast.error('Could not fetch resume. Please try again.');
        return throwError(() => error);
      }),
      finalize(() => {
        this._isFetchingResume.set(false);
      }),
    );
  }

  getResumes$() {
    this._isFetchingResume.set(true);
    this._isError.set(false);

    return this.http
      .get<
        ApiResponse<ResumeServerData[]>
      >(ResumeApi.getAll(), { context: combineContexts(this.transform, withCache({ groupKey: 'resumes' })) })
      .pipe(
        map((res) => {
          this._isFetchingResume.set(false);
          this._isError.set(false);
          return res.data;
        }),
      );
  }

  fetchTotalCount() {
    return this.http
      .get<ApiResponse<{ count: number }>>(ResumeApi.getCount(), { context: this.transform })
      .pipe(map((res) => res.data));
  }

  saveResume() {
    this._isSaving.set(true);
    this._isError.set(false);

    const newData = structuredClone(this._resumeData());
    const toSaveResume = {
      ...newData,
      ...(JSON.stringify(this._lastSavedData().photo, resumeJsonReplacer) ===
        JSON.stringify(newData.photo, resumeJsonReplacer) && { photo: undefined }),
      ...(newData.photo === null && { photo: 'null' }),
      id: this._resumeId(),
    };

    return this.http
      .put<ApiResponse<ResumeData>>(
        ResumeApi.save(),
        toFormData(filterEmptyStrings(toSaveResume)),
        {
          context: combineContexts(
            this.transform,
            invalidateCache({ invalidateGroupKey: 'resumes' }),
          ),
        },
      )
      .pipe(
        tap((res) => {
          this._lastSavedData.set(newData);
          this._resumeId.set(res.data.id);
          this._isError.set(false);
        }),
        catchError((error) => {
          this._isError.set(true);
          console.error(error);
          toast.error(ResumeSaveFailedComponent);
          return throwError(() => error);
        }),
        finalize(() => {
          this._isSaving.set(false);
        }),
      );
  }

  deleteResume$(resumeId: string) {
    return this.http
      .delete(ResumeApi.delete(resumeId), {
        context: invalidateCache({ invalidateGroupKey: 'resumes' }),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this._isError.set(true);
          console.error(error);
          toast.error('Something went wrong. Please try again.');
          return throwError(() => error);
        }),
      );
  }

  download() {
    this.http.post('/api/pdf/resume', {}, { responseType: 'blob' }).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  reset(): void {
    this._resumeData.set({});
    this._lastSavedData.set({});
    this._isSaving.set(false);
    this._loadedResume$.next(null);
    this._resumeId.set(undefined);
  }
}
