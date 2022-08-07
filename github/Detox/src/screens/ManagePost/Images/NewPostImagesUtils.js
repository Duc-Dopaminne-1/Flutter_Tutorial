import {PROPERTY_LOCATION} from '../../../assets/constants';
import MeasureUtils from '../../../utils/MeasureUtils';
import {PROPERTY_LOCATION_BY_NAME} from '../PropertyPostUtils';

const getSuggestionTitles = state => {
  const {step1Data} = state;
  let tradingTypeText = step1Data?.forRent ? 'cho thuê' : 'bán';
  let propertyLocationText = '';
  if (step1Data?.forSale && step1Data?.forRent) {
    tradingTypeText = 'bán/cho thuê';
  }
  if (step1Data?.propertyLocation === PROPERTY_LOCATION.FRONTAGE) {
    propertyLocationText =
      PROPERTY_LOCATION_BY_NAME[PROPERTY_LOCATION.FRONTAGE]?.toLocaleLowerCase();
  }
  if (step1Data?.propertyLocation === PROPERTY_LOCATION.ALLEY && step1Data?.alleyWidth) {
    propertyLocationText = `${PROPERTY_LOCATION_BY_NAME[
      PROPERTY_LOCATION.ALLEY
    ]?.toLocaleLowerCase()} ${step1Data.alleyWidth}m`;
  }
  const propertyTypeDescription = step1Data?.propertyTypeDescription?.toLocaleLowerCase() ?? '';

  const buildingAreaText = step1Data?.buildingArea ? `- ${step1Data.buildingArea}m2` : '';
  const numberOfBedroomsText = step1Data?.numberOfBedrooms
    ? `- ${step1Data?.numberOfBedrooms} pn`
    : '';

  const numberOfBathroomsText = step1Data?.numberOfBathrooms
    ? `- ${step1Data.numberOfBathrooms} wc`
    : '';
  const priceValue = step1Data?.forSale ? step1Data?.price : step1Data?.rentPrice;
  const priceText = MeasureUtils.getPriceDescriptionNoUnitInput(priceValue);
  const districtText = step1Data?.propertyAddress?.districtName;

  return [
    {
      id: 1,
      value: [
        'Cần',
        tradingTypeText,
        propertyTypeDescription,
        'chính chủ',
        propertyLocationText,
        buildingAreaText,
        numberOfBedroomsText,
        numberOfBathroomsText,
        priceText && `- ${priceText}`,
        districtText && `- ${districtText}`,
      ]
        .filter(Boolean)
        .join(' '),
    },
    {
      id: 2,
      value: [
        'Cần',
        tradingTypeText,
        propertyTypeDescription,
        propertyLocationText,
        buildingAreaText,
        priceText && `- ${priceText}`,
        districtText && `- ${districtText}`,
      ]
        .filter(Boolean)
        .join(' '),
    },
    {
      id: 3,
      value: [
        'Cần',
        tradingTypeText,
        'gấp',
        propertyTypeDescription,
        propertyLocationText,
        'tại',
        districtText,
        'giá',
        priceText,
      ]
        .filter(Boolean)
        .join(' '),
    },
  ];
};

const NewPostImagesUtils = {
  getSuggestionTitles,
};

export default NewPostImagesUtils;
