import {InvestorAddressInfoDto} from '../../../api/graphql/generated/graphql';

export type InvestorDetailTypes = {
  introduction: {
    logo: String,
    name: String,
    address: InvestorAddressInfoDto,
    website: String,
    phone: String,
    dateOfEstablishment: String,
    charterCapital: String,
    areas: String,
    introduce: String,
  },
  activityImages: String,
};
