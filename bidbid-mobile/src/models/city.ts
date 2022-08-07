import { BaseModel } from './index';
export interface City extends BaseModel {
  name: string;
  address: string;
  lng: number;
  lat: number;
  isFromFilter?: boolean;
}
