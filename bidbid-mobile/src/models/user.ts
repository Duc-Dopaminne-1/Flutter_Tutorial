import { Gender, PHOTO, SEXUAL_ORIENTATION_MODEL, SCHOOL_MODEL, LANGUAGE_MODEL, INTERESTS_MODEL, City } from '@/models';
import { BaseModel, Auction } from './index';
export interface User extends BaseModel {
  avatarId: number;
  phoneNumber: string;
  email: string;
  token?: null;
  status: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  appLanguage: string;
  authProviders: any;
  isShowSexual: boolean;
  description?: string;
  jobTitle: string;
  company: string;
  auctionOnly: boolean;
  showDistanceIn: string;
  maxDistance: number;
  ageRangeMin: number;
  ageRangeMax: number;
  showMe: null;
  isShowGender: boolean;
  blockedAt: null;
  id: string;
  city: City;
  cityId: number;
  interests: INTERESTS_MODEL[];
  school?: SCHOOL_MODEL;
  schoolId: number;
  languages: LANGUAGE_MODEL[];
  languageId: number;
  sexualOrientations: SEXUAL_ORIENTATION_MODEL[];
  gender: Gender;
  genderId: number;
  hideAge: boolean;
  avatar: PHOTO;
  photos: PHOTO[];

  auctions: Auction[];
  discoveryLanguages: any[];
}

export interface CAREER_STRENGTHS {
  id: number;
  name: string;
  deletedAt?: string;
  createdAt?: string;
  updateAt?: string;
}

export interface CATEGORIES {
  id: number;
  name: string;
  deletedAt?: string;
  createdAt?: string;
  updateAt?: string;
}
