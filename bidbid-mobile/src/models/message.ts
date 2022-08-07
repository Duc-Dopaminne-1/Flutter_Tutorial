import { BaseModel } from './index';

export interface MessageChat extends BaseModel {
  _id: string;
  text: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
}
