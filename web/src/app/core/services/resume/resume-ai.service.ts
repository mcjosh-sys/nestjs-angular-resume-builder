import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@shared/models';
import { toast } from 'ngx-sonner';
import { catchError, map, throwError } from 'rxjs';
import { ResumeAiApi } from 'src/app/api/resume-ai.api';
import { withTransform } from 'src/app/core/utils/context-helpers';
import { parseIsoString } from 'src/app/core/utils/form-data-helpers';
import { WorkExperienceValue } from '../../../features/editor/forms/work-experience.form';
import { ResumeData } from '../../../features/editor/models';

@Injectable({
  providedIn: 'root',
})
export class ResumeAiService {
  constructor(private readonly http: HttpClient) {}

  get transform() {
    return withTransform<ApiResponse<ResumeData>>({
      transformFn: parseIsoString,
      fieldName: 'data',
    });
  }

  generateSummary(resumeData: ResumeData) {
    const { jobTitle, workExperiences, skills } = resumeData;
    return this.http
      .post<
        ApiResponse<{ text: string }>
      >(ResumeAiApi.generateSummary(), { jobTitle, workExperiences, skills })
      .pipe(
        map((res) => res.data?.text),
        catchError((error) => {
          toast.error('Something went wrong. Please try again.');
          return throwError(() => error);
        }),
      );
  }

  generateWorkExperience(description: string) {
    return this.http
      .post<ApiResponse<Partial<WorkExperienceValue>>>(
        ResumeAiApi.generateWorkExperience(),
        { description },
        {
          context: this.transform,
        },
      )
      .pipe(
        map((res) => res.data),
        catchError((error) => {
          toast.error('Something went wrong. Please try again.');
          return throwError(() => error);
        }),
      );
  }
}
