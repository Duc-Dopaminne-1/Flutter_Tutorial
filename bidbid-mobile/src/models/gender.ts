import { BaseModel } from './index';

export interface Gender extends BaseModel {
  code?: number;
  order?: number;
  esName?: string;
  name?: string;
  slug?: string;
}

export enum GENDER_TYPE {
  MALE = 1,
  FEMALE = 2,
  OTHER = 3,
}
