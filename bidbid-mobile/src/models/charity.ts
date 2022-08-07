import { BaseModel } from './base-model';

export interface Charity extends BaseModel {
  name: string;
  logoId: number;
}
