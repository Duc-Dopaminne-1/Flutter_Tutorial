import {SearchPropertyPostInfoDto} from '../../../../api/graphql/generated/graphql';
import {CommissionCurrencyUnit, getDirectionList} from '../../../../assets/constants';
import {extractAddressData} from '../../../../utils/DataProcessUtil';
import PropertyPostUtils from '../../../ManagePost/PropertyPostUtils';

const formatDirection = direction => {
  return getDirectionList()?.find(item => {
    return item?.id?.toLowerCase() === direction?.toLowerCase();
  })?.name;
};

export function mapPropertySent(value: SearchPropertyPostInfoDto, formatPrice) {
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
      return images[0].url ?? images[0].uri;
    }
    return null;
  };
  const commission = PropertyPostUtils.parseCommission(
    value?.commission,
    value?.saleCommissionCurrencyUnitId,
    CommissionCurrencyUnit.PERCENTAGE,
  );
  const property: PropertySentItem = {
    propertyInfo: {
      propertyPostId: value.propertyPostId,
      images: parseImageUrl(value.images),
      isFollowed: value.isFollowed,
      isAgent: value?.sellerInfo?.isAgent,
      address: extractAddressData(value.propertyAddress, true),
      title: value.postTitle,
      numberOfBedrooms: value.numberOfBedrooms,
      numberOfBathrooms: value.numberOfBathrooms,
      buildingArea: value.buildingArea ?? value.capetAreas,
      direction: formatDirection(value.direction),
      price: formatPrice(
        value.price,
        value?.unitOfMeasureId ?? value?.unitOfMeasure?.unitOfMeasureId,
      ),
      commission: commission,
      brokenAvatar: value.sellerInfo?.avatar,
      brokenName: value.sellerInfo?.fullName,
      brokenRank: value.sellerInfo?.agentRankingName,
      brokenRating: value.sellerInfo?.agentRating,
      brokenPhone: value.sellerInfo?.phoneNumber,
      brokenEmail: value.sellerInfo?.email,
      propertyCode: value.propertyCode,
    },
  };
  return property;
}
