import {SearchProjectInfoDto} from '../../api/graphql/generated/graphql';
import {getProjectStatusStyle, PROJECT_STATUS_ID} from '../../assets/constants';
import {extractAddressData} from '../../utils/DataProcessUtil';

export const defaultProjectSearch = {
  item: {
    isFollowed: false,
    totalFollower: 0,
    projectId: 1,
    totalShare: 0,
    projectName: 'Khu đô thị EMPIRE CITY Thủ Thiêm',
    projectCode: 'MDA00072',
    minPrice: '1 tỷ 2',
    commissionRates: '3%',
    projectStatusName: 'Đang mở bán',
    followerCount: 12,
    bannerImage:
      'https://sandbox-citus.topenland.com/gateway/downloader/sale/H%C3%ACnh%20%E1%BA%A3nh%20%C4%91%E1%BA%A1i%20di%E1%BB%87n-30218aa6-943b-497b-a8cf-34b6bc74ac25.jpg',
    investorOwnerName: 'Công ty Đế Vương ',
    projectAddress: '117 Lê Thị Hồng Phường 17 Quận Gò Vấp HCM',
    height: 333.875,
    unitOfMeasureProject: {
      unitOfMeasureName: 'tỷ',
      unitOfMeasureCode: 'billion',
      multiplyWithBaseUnit: 1000000000,
      isRound: true,
    },
    projectStatusDescription: 'Đang mở bán',
  },
  itemType: 'full',
  isFollowCountVisible: false,
  style: {height: 333.875, marginTop: 0, alignSelf: 'stretch', flex: 0, transform: [{scaleY: 1}]},
};

export type SearchProjectProps = typeof defaultProjectSearch;

export const getColorProjectStatus = stausId => {
  const statusName = PROJECT_STATUS_ID[stausId];
  return getProjectStatusStyle(statusName);
};

export const mapSearchItemUi = (data: SearchProjectInfoDto, formatPrice) => {
  const output: SearchProjectProps = {
    projectId: data.projectId,
    bannerImage: data.featurePhotos,
    isFollowed: data.isFollowed,
    followerCount: data.totalFollower,
    startYear: data?.startYear,
    totalArea: data?.totalArea,
    overallDescription: data?.overallDescription,
    investorOwnerLogo: data?.investorOwnerLogo,
    projectStatusId: data.projectStatusId,
    backgroundStatus: getColorProjectStatus(data?.projectStatusId),
    projectStatusName: data.projectStatusDescription || data.projectStatusName,
    investorOwnerName: data.investorOwnerName,
    projectName: data.projectName,
    projectAddress: extractAddressData(data.projectAddress),
    commissionRates: data.commissionRates,
    minPrice:
      data.minPrice === 0 ? 0 : formatPrice(data.minPrice, '2e1b0f25-2772-4d71-aca1-9bd0c8fb9a74'),
    propertyTypeId: data?.propertyTypeId,
  };
  return output;
};
