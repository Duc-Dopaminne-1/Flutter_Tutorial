import isEmpty from 'lodash/isEmpty';

import {
  PostContractStatus,
  SearchPropertyPostForRentInfoDto,
  SearchPropertyPostInfoDto,
  TopenerOfMonthDto,
} from '../../../api/graphql/generated/graphql';
import {
  APPROVAL_STATUS_ID,
  CommissionCurrencyUnit,
  getDirectionList,
} from '../../../assets/constants';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {extractAddressData} from '../../../utils/DataProcessUtil';
import {dateToString} from '../../../utils/TimerCommon';
import PropertyPostUtils from '../../ManagePost/PropertyPostUtils';

export const defaultProperty = {
  isShowFollowButton: true,
  showBrokenInfo: false,
  isShowFollower: true,
  propertyInfo: {
    propertyPostId: 'propertyPostId',
    title: 'Bán căn hộ 2PN Chung cư Âu Cơ Tower',
    address: '01 Âu Cơ, Tân Thành, Tân Phú, Hồ Chí Minh.',
    images:
      'https://sandbox-new.topenland.com/gateway/downloader/sale/262391-pic0_new-c27e5294-f64b-4503-87c8-a8dba4ff1e72.jpg',
    isFollowed: false,
    propertyCode: '',
    numberOfBathrooms: 2,
    numberOfBedrooms: 2,
    direction: 'Tây bắc',
    buildingArea: 74.2,
    brokenName: 'Nguyễn Hưng Thịnh',
    brokenRating: 4,
    groupNameDescription: 'Rồng vàng',
    brokenPhone: '0928472261',
    brokenEmail: 'nguyenhungthinh16@gmail.com',
    brokenAvatar:
      'https://sandbox-new.topenland.com/gateway/downloader/sale/262391-pic0_new-c27e5294-f64b-4503-87c8-a8dba4ff1e72.jpg',
    commission: '1-2%',
    price: '1 tỷ 3',
  },
  style: [
    {marginBottom: 20, borderRadius: 5, backgroundColor: '#FFFFFF', flexWrap: 'nowrap'},
    {marginEnd: 16},
  ],
  isSmallStyle: true,
  propertyTypeName: 'apartment',
  buyRequestMode: false,
  rentCommission: 1,
  rentPrice: 1000000,
  isRented: false,
};

export type PropertyItemType = typeof defaultProperty;

const defaultTopener = {
  key: '1',
  agentId: 'agentId',
  rank: IMAGES.IC_TOPENER_RANK1,
  avatar: '',
  fullName: '',
  rating: '',
  groupNameDescription: '',
  rankType: 'rank1',
  groupName: 'Hưng Thịnh Corp',
  sellingTotal: 100,
  phone: '',
  email: '',
  properties: [defaultProperty],
};
type Topener = typeof defaultTopener;
export const defaultAgentProps = {
  topeners: [defaultTopener],
};

export type AgentProps = typeof defaultAgentProps;

export const mapAgentPropsUi = (data: TopenerOfMonthDto, formatPrice, index = 0) => {
  const getRankIcon = () => {
    if (index === 0) {
      return IMAGES.IC_TOPENER_RANK1;
    } else if (index === 1) {
      return IMAGES.IC_TOPENER_RANK2;
    } else {
      return IMAGES.IC_TOPENER_RANK3;
    }
  };
  const topener: Topener = {
    key: data.rankingName,
    agentId: data.agentId,
    rank: getRankIcon(),
    avatar: data.profilePhoto,
    rankType: data.rankingName,
    fullName: data.fullName,
    rating: data.rating,
    groupNameDescription: data.groupNameDescription,
    email: data.email,
    groupName: data.groupName,
    sellingTotal: data.sellingTotal,
    phone: data.phoneNumber,
    properties: data.propertyPostInfoDtos.map(property => {
      return mapProperty(property, formatPrice);
    }),
  };
  return topener;
};

export const formatDirection = direction => {
  return getDirectionList()?.find(item => {
    return item?.id?.toLowerCase() === direction?.toLowerCase();
  })?.name;
};

const parseImageJson = array => {
  let images = [];
  if (Array.isArray(array)) {
    images = array;
  } else {
    images = JSON.parse(array) ?? [];
  }
  return images;
};

const parseImageUrl = json => {
  const images = parseImageJson(json);
  if (images && images.length > 0) {
    const thumbnailImage = images.filter(e => e?.avatar || e?.checked);
    if (thumbnailImage.length === 0 || images.length === 1) {
      return images[0].url ?? images[0].uri ?? null;
    }
    return thumbnailImage[0]?.url ?? thumbnailImage[0]?.uri ?? null;
  }
  return null;
};

/**
 * Map property data response to UI object
 * @param {*} value Property post data
 * @param {*} formatPrice function format price int to string format
 * @param {*} hiddenHomeNumber (true/false) hidden/show home number of property
 * @returns mapping data object property post
 */
export function mapProperty(
  value: SearchPropertyPostInfoDto,
  formatPrice,
  hiddenHomeNumber = true,
) {
  const commission = PropertyPostUtils.parseCommission(
    value?.commission,
    value?.saleCommissionCurrencyUnitId,
    CommissionCurrencyUnit.PERCENTAGE,
  );

  const property: PropertyItem = {
    propertyPostId: value.propertyPostId,
    propertyTypeId: value?.propertyTypeId,
    images: parseImageUrl(value.images),
    isFollowed: value.isFollowed,
    isAgent: value?.sellerInfo?.isAgent,
    address: extractAddressData(value.propertyAddress, hiddenHomeNumber),
    title: value.postTitle,
    numberOfBedrooms: value.numberOfBedrooms,
    numberOfBathrooms: value.numberOfBathrooms,
    buildingArea: value.buildingArea ?? value.capetAreas,
    direction: formatDirection(value.direction),
    price: formatPrice(
      value.price,
      value?.unitOfMeasureId ?? value?.unitOfMeasure?.unitOfMeasureId,
    ),
    propertyCode: value?.propertyCode,
    commission,
    brokenAvatar: value.sellerInfo?.avatar,
    brokenName: value.sellerInfo?.fullName,
    brokenRank: value.sellerInfo?.agentRankingName,
    brokenRating: value.sellerInfo?.agentRating,
    brokenPhone: value.sellerInfo?.phoneNumber,
    brokenEmail: value.sellerInfo?.email,
    forRent: value.forRent ?? false,
    forSale: value.forSale ?? false,
    isSold: value.isSold ?? false,
    latitude: value.latitude,
    longitude: value.longitude,
    isRented: value?.isRented,
  };
  return property;
}

/**
 * Map rent property info to UI data
 * @param {*} value PropertyPost data
 * @param {*} formatPrice @function formatPrice format price function
 * @param {*} isForRent For rent property post
 * @returns mapping UI object rent property post
 * @see mapProperty
 */
export function mapPropertyForRent(value, formatPrice, isForRent = false) {
  const propertyPostForRent = isForRent ? value : value?.propertyPostForRentDto;
  if (!propertyPostForRent) {
    return null;
  }
  return {
    rentPrice: formatPrice(propertyPostForRent?.rentPrice),
    isRented: propertyPostForRent?.isRented,
    rentCommission: PropertyPostUtils.parseCommission(
      propertyPostForRent?.rentCommission,
      propertyPostForRent?.rentCommissionCurrencyUnitId,
    ),
    rentCommissionCurrencyUnitId: propertyPostForRent?.rentCommissionCurrencyUnitId,
    rentPeriod: propertyPostForRent?.rentPeriod,
  };
}

/**
 * Parse contract status key to string
 * @param {*} contractStatus Contract status value key
 * @returns translation string contract status
 */
export function mapPropertyContractStatus(contractStatus) {
  if (isEmpty(contractStatus)) return '';
  switch (contractStatus) {
    case PostContractStatus.Unsent:
      return translate('propertyPost.contractStatus.unsent');
    case PostContractStatus.Waittosign:
      return translate('propertyPost.contractStatus.waitToSign');
    case PostContractStatus.Waitforpay:
      return translate('propertyPost.contractStatus.waitForPay');
    case PostContractStatus.Haspaid:
      return translate('propertyPost.contractStatus.hasPaid');
    case PostContractStatus.Refuse:
      return translate('propertyPost.contractStatus.refuse');
    default:
      return '';
  }
}

export function mapSearchRentalProperty(value: SearchPropertyPostForRentInfoDto, formatPrice) {
  const propertyDetails: SearchPropertyPostInfoDto = {
    ...value?.searchPropertyPostInfoDto,
  };
  const rentCommission = PropertyPostUtils.parseCommission(
    value?.rentCommission,
    value?.rentCommissionCurrencyUnitId,
  );
  const commission = PropertyPostUtils.parseCommission(
    propertyDetails?.commission,
    propertyDetails?.saleCommissionCurrencyUnitId,
    CommissionCurrencyUnit.PERCENTAGE,
  );
  const property: PropertyItem = {
    propertyPostId: propertyDetails.propertyPostId,
    images: parseImageUrl(propertyDetails.images),
    isFollowed: propertyDetails.isFollowed,
    isAgent: propertyDetails?.sellerInfo?.isAgent,
    address: extractAddressData(propertyDetails.propertyAddress, true),
    title: propertyDetails.postTitle,
    numberOfBedrooms: propertyDetails.numberOfBedrooms,
    numberOfBathrooms: propertyDetails.numberOfBathrooms,
    buildingArea: propertyDetails.buildingArea ?? propertyDetails.capetAreas,
    direction: formatDirection(propertyDetails.direction),
    price: formatPrice(
      propertyDetails.price,
      propertyDetails?.unitOfMeasureId ?? propertyDetails?.unitOfMeasure?.unitOfMeasureId,
    ),
    commission,
    brokenAvatar: propertyDetails.sellerInfo?.avatar,
    brokenName: propertyDetails.sellerInfo?.fullName,
    brokenRank: propertyDetails.sellerInfo?.agentRankingName,
    brokenRating: propertyDetails.sellerInfo?.agentRating,
    brokenPhone: propertyDetails.sellerInfo?.phoneNumber,
    brokenEmail: propertyDetails.sellerInfo?.email,
    forRent: propertyDetails.forRent,
    forSale: propertyDetails.forSale,
    propertyCode: propertyDetails.propertyCode,
    rentCommission,
    rentPeriod: value?.rentPeriod,
    rentPrice: formatPrice(value?.rentPrice),
    latitude: propertyDetails.latitude,
    longitude: propertyDetails.longitude,
    isRented: propertyDetails?.isRented,
  };
  return property;
}

/**
 * Map guaranteed property (tin đăng ký gửi C2C)
 * @param {*} value PropertyPost data
 * @param {*} formatPrice @function formatPrice format price function
 * @param {*} isForRent For rent property post
 * @returns mapping UI object guaranteed property post
 * @see mapProperty
 */
export function mapPropertyC2CGuarantee(value, formatPrice, isCreatedUser, isForRent = false) {
  if (!value) return null;
  const postInfo = isForRent ? value?.searchPropertyPostInfoDto : value;
  const mappingProperty = mapProperty(postInfo, formatPrice, !isCreatedUser);
  const mappingPropertyForRent = mapPropertyForRent(value, formatPrice, isForRent);
  const property = {
    ...mappingProperty,
    ...mappingPropertyForRent,
    isGuaranteed: postInfo?.isGuaranteed,
    contractStatus: mapPropertyContractStatus(
      postInfo?.guaranteedPackage?.contractStatus ?? postInfo?.contractStatus,
    ),
    contractStatusValue: postInfo?.guaranteedPackage?.contractStatus ?? postInfo?.contractStatus,
    guaranteedPackageEndTime:
      postInfo?.guaranteedPackage?.guaranteedPackageEndTime ?? postInfo?.guaranteedPackageEndTime,
    postServiceType: postInfo?.postServiceType,
    requestedUpdatingReason: postInfo?.requestedUpdatingReason,
    isRequestedUpdate: postInfo?.propertyPostApprovalStatusId === APPROVAL_STATUS_ID.REQUEST,
    rejectedReason: postInfo?.rejectedReason,
    isRejected: postInfo?.propertyPostApprovalStatusId === APPROVAL_STATUS_ID.REJECTED,
    isCreatedUser: isCreatedUser,
    imagesSize: parseImageJson(postInfo?.images)?.length ?? 0,
    propertyPostApprovalStatusName: postInfo?.propertyPostApprovalStatusName ?? '',
    createdDatetime: dateToString(postInfo?.createdDatetime),
  };
  return property;
}
