import { environment } from 'src/environments/environment';
import { createApiUrlGenerator } from '../core/utils/api-helpers';

export class ResumeAiApi {
  private static baseUrl = `${environment.apiBaseUrl}/resume/ai`;
  private static api = createApiUrlGenerator(ResumeAiApi.baseUrl);

  private constructor() {}

  static generateSummary() {
    return ResumeAiApi.api.generateUrl('generate-summary');
  }

  static generateWorkExperience() {
    return ResumeAiApi.api.generateUrl('generate-work-experience');
  }
}
