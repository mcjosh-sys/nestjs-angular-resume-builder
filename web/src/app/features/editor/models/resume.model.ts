import { Prettify } from '@shared/models/utility.model';
import { EducationValue } from '../forms/education.form';
import { GeneralInfoValue } from '../forms/general-info.form';
import { PersonalInfoValue } from '../forms/personal-info.form';
import { WorkExperienceValue } from '../forms/work-experience.form';

export type ResumeData = Prettify<
  Partial<GeneralInfoValue> &
    Omit<Partial<PersonalInfoValue>, 'photo'> & {
      workExperiences?: Prettify<Partial<WorkExperienceValue>>[];
      educations?: Prettify<Partial<EducationValue>>[];
      skills?: string[];
      summary?: string;
    } & {
      id?: string;
      photo?: File | string | null;
      colorHex?: string;
      borderStyle?: string;
    }
>;

export type ResumeServerData = Prettify<
  { id: string } & Omit<ResumeData, 'id'> & { createdAt: Date; updatedAt: Date }
>;
