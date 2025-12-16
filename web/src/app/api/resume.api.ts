import { environment } from 'src/environments/environment';
import { createApiUrlGenerator } from '../core/utils/api-helpers';

export class ResumeApi {
  private static baseUrl = `${environment.apiBaseUrl}/resumes`;
  private static api = createApiUrlGenerator(ResumeApi.baseUrl);

  private constructor() {}

  static getAll() {
    return ResumeApi.api.generateUrl('');
  }

  static get(id: string) {
    return ResumeApi.api.generateUrl([id]);
  }

  static getCount() {
    return ResumeApi.api.generateUrl('count');
  }

  static save() {
    return ResumeApi.api.generateUrl('');
  }

  static delete(id: string) {
    return ResumeApi.api.generateUrl([id]);
  }
}
