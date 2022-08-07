import { BaseModel } from './base-model';

export interface AuctionStatusModel extends BaseModel {
  name: string;
  order: number;
}
