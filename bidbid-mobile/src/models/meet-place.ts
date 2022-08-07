import { BaseModel } from './base-model';

export interface MeetPlace extends BaseModel {
  name?: string;
  address?: string;
  lng?: string;
  lat?: string;
  creatorId?: number;
  placeId?: string;
}
