import { BaseModel } from './index';

export interface FindProfiles extends BaseModel {
  id: number;
  type: string;
  name: string;
}

export const TypeFindProfiles = {
  FOLLOWED: 'followed',
  UN_FOLLOWED: 'unfollowed',
};
