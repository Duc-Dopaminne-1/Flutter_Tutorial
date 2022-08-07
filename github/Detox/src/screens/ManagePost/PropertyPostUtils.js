import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import moment from 'moment';

import {PostContractStatus, PostServiceType} from '../../api/graphql/generated/graphql';
import {
  APP_CURRENCY,
  APPROVAL_STATUS,
  COMMISSION_CHART_COLORS_THEME,
  CommissionCurrencyUnit,
  CONSTANTS,
  getGuaranteeContractStatusStyle,
  getPropertyPostStatusStyle,
  getPropertyPostTextColor,
  GUARANTEE_CONTRACT_STATUS,
  IMAGE_MIME,
  MAX_LENGTH,
  PERCENTAGE_UNIT,
  PROPERTY_POST_REJECT_REASON_ID,
} from '../../assets/constants';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import ArrayUtils from '../../utils/ArrayUtils';
import {extractAddressData} from '../../utils/DataProcessUtil';
import {
  getBankDescriptionById,
  getLegalInfoDescriptionById,
  getPropertyPostApprovalStatusById,
  getPropertyPostApprovalStatusDescriptionByName,
  getPropertyPostStatusDescriptionById,
  getPropertyTypeById,
  getUnitOfMeasureById,
} from '../../utils/GetMasterData';
import {mapToUiImageSelectionSources, sortImagesWithAvatar} from '../../utils/ImageUtil';
import JsonDataUtils from '../../utils/JsonDataUtils';
import MeasureUtils from '../../utils/MeasureUtils';
import NumberUtils from '../../utils/NumberUtils';
import {dateToString, getCurrentDateString} from '../../utils/TimerCommon';
import styles from './ReviewPropertyPost/styles';

export const COMMISSION_CHART_LENGTH = 164;
export const COMMISSION_CHART_INNER_PADDING_RADIUS = 46;
export const COMMISSION_CHART_PORTION_PADDING = 1; // unit: Angle, max value = 360

export const RENT_PERIOD_LIST = [
  {
    id: 1,
    name: '1 tháng',
    checked: false,
    value: 1,
  },
  {
    id: 3,
    name: '3 tháng',
    checked: true,
    value: 3,
  },
  {
    id: 6,
    name: '6 tháng',
    checked: false,
    value: 6,
  },
  {
    id: 12,
    name: '1 năm',
    checked: false,
    value: 12,
  },
];

export const VIEW_PROPERTY_POST_HEADER_POSITION_CUSTOMER = [
  // eslint-disable-next-line sonarjs/no-duplicate-string
  translate('propertyPost.headerNav.general'),
  translate('propertyPost.headerNav.contact'),
  // eslint-disable-next-line sonarjs/no-duplicate-string
  translate('propertyPost.headerNav.detailInfo'),
  // eslint-disable-next-line sonarjs/no-duplicate-string
  translate('propertyPost.headerNav.facility'),
  translate('propertyPost.headerNav.comment'),
  translate('propertyPost.headerNav.similarPost'),
  translate('propertyPost.headerNav.visitedPost'),
];

export const VIEW_PROPERTY_POST_HEADER_POSITION_OWNER = [
  translate('propertyPost.headerNav.general'),
  translate('propertyPost.headerNav.support'),
  translate('propertyPost.headerNav.detailInfo'),
  translate('propertyPost.headerNav.facility'),
  translate('propertyPost.headerNav.comment'),
];

export const VIEW_PROPERTY_POST_HEADER_POSITION_PREVIEW = [
  translate('propertyPost.headerNav.general'),
  translate('propertyPost.headerNav.support'),
  translate('propertyPost.headerNav.detailInfo'),
  translate('propertyPost.headerNav.facility'),
];

export const PROPERTY_LOCATION_BY_NAME = {
  FRONTAGE: translate('propertyPost.frontage'),
  ALLEY: translate('propertyPost.alley'),
};

const canClosePost = (masterData, postInfo) => {
  const closePostProps = {
    canClose: false,
    shouldShow: false,
  };

  if (!postInfo) {
    return closePostProps;
  }

  const postApprovalStatusId = postInfo.propertyPostApprovalStatusId;
  const postApprovalStatus = getPropertyPostApprovalStatusById(masterData, postApprovalStatusId);

  if (postApprovalStatus.propertyPostApprovalStatusName === APPROVAL_STATUS.APPROVAL) {
    closePostProps.shouldShow = true;
    closePostProps.canClose = true;
  }

  return closePostProps;
};

const canEditPost = (masterData, postInfo) => {
  if (!postInfo) {
    return false;
  }

  if (postInfo.isPrivate) {
    return true;
  }

  const postApprovalStatusId = postInfo.propertyPostApprovalStatusId;
  const postApprovalStatus = getPropertyPostApprovalStatusById(masterData, postApprovalStatusId);
  if (!postApprovalStatus) {
    return false;
  }

  switch (postApprovalStatus.propertyPostApprovalStatusName) {
    case APPROVAL_STATUS.REQUEST:
    case APPROVAL_STATUS.WAITING:
    case APPROVAL_STATUS.APPROVAL:
    case APPROVAL_STATUS.REJECTED:
      const postIsNotValid = postInfo?.rejectReasonId === PROPERTY_POST_REJECT_REASON_ID.junkPost;
      if (postIsNotValid) {
        return false;
      }
      return true;
    default:
      return false;
  }
};

const canShowShareLike = (masterData, postApprovalStatusId) => {
  const postApprovalStatus = getPropertyPostApprovalStatusById(masterData, postApprovalStatusId);
  if (!postApprovalStatus) {
    return false;
  }

  switch (postApprovalStatus.propertyPostApprovalStatusName) {
    case APPROVAL_STATUS.APPROVAL:
    case APPROVAL_STATUS.CLOSE:
    case APPROVAL_STATUS.SOLD:
      return true;
    default:
      return false;
  }
};

const canContactToBuy = (masterData, postInfo, userId) => {
  if (!postInfo) {
    return false;
  }

  const isOwner = postInfo.originState?.createdByUserId === userId;
  const shouldShowContactFooterButton =
    (postInfo?.originState?.forSale && !postInfo?.originState?.isSold) ||
    (postInfo?.originState?.forRent && !postInfo?.originState?.propertyPostForRentDto?.isRented);
  const postApprovalStatusId = postInfo?.originState?.propertyPostApprovalStatusId;
  const postApprovalStatus = getPropertyPostApprovalStatusById(masterData, postApprovalStatusId);
  if (!postApprovalStatus) {
    return false;
  }

  const approvalStatusName = postApprovalStatus.propertyPostApprovalStatusName;

  const contactable =
    !isOwner &&
    approvalStatusName !== APPROVAL_STATUS.SOLD &&
    approvalStatusName !== APPROVAL_STATUS.CLOSE &&
    approvalStatusName !== APPROVAL_STATUS.EXPIRED &&
    shouldShowContactFooterButton;

  return contactable;
};

const priceToString = (price, unitOfMeasure, isUnitNameVisible = true) => {
  if (!price) {
    price = 0; //just to cast price to valid number if needed
  }
  const unit = unitOfMeasure?.multiplyWithBaseUnit ?? 1;
  const unitName = isUnitNameVisible ? unitOfMeasure?.unitOfMeasureName ?? '' : '';
  const isDecimal = price % unit !== 0;
  let priceFormat = price / unit;
  if (isDecimal) {
    priceFormat = NumberUtils.formatNumberToCurrencyNumber(price / unit, 5); // format ext 5
    priceFormat = String(priceFormat).replace(/0+$/, ''); // remove all 0 after format
  }

  return `${priceFormat} ${unitName.toLowerCase()}`;
};

const mapGeneralToInput = step1Data => {
  if (!step1Data) {
    return {};
  }
  const projectId = step1Data?.projectInfo?.projectId;
  return {
    b2C2CProjectId: isEmpty(projectId) ? '' : projectId,
    freeTextProject: step1Data.freeTextProject,
    propertyTypeId: step1Data.propertyTypeId,
    ownerIsAuthor: step1Data.ownerIsAuthor,
    propertyAddress: {
      countryId: step1Data?.propertyAddress?.countryId ?? 1,
      cityId: step1Data?.propertyAddress?.cityId,
      districtId: step1Data?.propertyAddress?.districtId,
      wardId: step1Data?.propertyAddress?.wardId,
      homeAddress: step1Data?.propertyAddress?.homeAddress,
      streetName: step1Data?.propertyAddress?.streetName,
      direction: step1Data?.direction ?? 'NULL',
    },
    forSale: true,
    price: NumberUtils.parseFloatValue(step1Data?.price),
    unitOfMeasureId: step1Data?.unitOfMeasureId,
    commission: NumberUtils.parseFloatValue(step1Data?.commission),
    saleCommissionCurrencyUnitId: step1Data?.saleCommissionCurrencyUnitId,
    propertyPostApprovalStatusId: step1Data?.propertyPostApprovalStatusId,
    negotiable: step1Data?.negotiable,
    forRent: false,
    rentPrice: null,
    rentCommission: null,
    rentCommissionCurrencyUnitId: null,
    rentPeriod: null,
    commissionTpl: step1Data?.commissionTpl,
    commissionBuyer: step1Data?.commissionBuyer,
    commissionSeller: step1Data?.commissionSeller,
    propertyLocation: step1Data?.propertyLocation ?? 'UNDEFINED',
    balconyDirection: step1Data?.balconyDirection === 'NULL' ? null : step1Data?.balconyDirection, // Hướng ban công
    nearFacility: JsonDataUtils.stringifyJSONArray(parseToFacilityValue(step1Data.nearFacility)),
    internalFacility: JsonDataUtils.stringifyJSONArray(
      parseToInternalFacilityValue(step1Data.internalFacility),
    ),
  };
};

const parseToFacilityValue = (listData: Array) => {
  if (ArrayUtils.hasArrayData(listData)) {
    const listFacilities = listData.map(item => ({
      name: item?.name,
      distance: NumberUtils.parseFloatValue(item?.distance),
    }));
    return listFacilities;
  }

  return [];
};

const parseToInternalFacilityValue = (listData: Array) => {
  if (ArrayUtils.hasArrayData(listData)) {
    const listFacilities = listData.map(item => ({
      name: item.name,
    }));
    return listFacilities;
  }
  return [];
};

const parseToImagesValue = list => {
  if (!list) {
    return [];
  }
  const listResults = list.map(e => ({
    url: e?.url || e?.uri,
    avatar: e?.checked || e?.avatar || false,
    name: e.name ?? 'Unknown',
    size: e.size ?? 0,
    type: e.type ?? IMAGE_MIME.JPEG,
    lastModified: e.lastModified ?? new Date().getTime(),
  }));
  return listResults.sort(sortImagesWithAvatar);
};

const mapLegalDocuments = (legalDocuments: Array, legalFiles: Array) => {
  let result = [...legalFiles];
  if (ArrayUtils.hasArrayData(legalDocuments)) {
    const legalMapping = legalDocuments.map((e, index) => ({
      url: e?.uri || e?.url,
      name: e.name ?? `Unknown${index}`,
      size: e.size ?? 0,
      type: e.type ?? IMAGE_MIME.JPEG,
      lastModified: e.lastModified ?? new Date().getTime(),
    }));
    result = [...result, ...legalMapping];
  }
  return result;
};

const mapStep4Data = step4Data => {
  return {
    owner: {
      customerEmail: step4Data?.owner?.customerEmail ?? '',
      customerFullName: step4Data?.owner?.customerFullName ?? '',
      customerPhone: step4Data?.owner?.customerPhone ?? '',
    },
    ownerIsAuthor: step4Data?.ownerIsAuthor ?? false,
    postServiceType: step4Data?.postServiceType,
    guaranteedPackageId: step4Data?.guaranteedPackageId,
  };
};

const mapStep2Data = step2Data => {
  const legalDocuments = mapLegalDocuments(
    step2Data?.legalDocuments ?? [],
    step2Data?.legalFiles ?? [],
  );

  return {
    legalDocuments: JsonDataUtils.stringifyJSONArray(legalDocuments),
    supportRequestTypeIds: JsonDataUtils.stringifyJSONArray(step2Data?.supportRequestTypeIds),
    isShowGoogleStreetView: step2Data?.isShowGoogleStreetView,
    postTitle: step2Data.postTitle,
    postDescription: step2Data.postDescription,
    propertyName: step2Data.postTitle,
    matterportUrl: step2Data?.matterportUrl,
    images: JsonDataUtils.stringifyJSONArray(parseToImagesValue(step2Data.images)),
  };
};

export const mapToPropertyDetail = propertyData => {
  const {
    propertyPostStatusId,
    blockName,
    floor,
    buildingArea,
    capetAreas,
    buildingLine,
    direction,
    numberOfFloor,
    numberOfBedrooms,
    numberOfBathrooms,
    legalInfoId,
    isCollateralized,
    collateralizedAtBankId,
    width,
    length,
    propertyLocation,
    alleyWidth,
    balconyDirection,
  } = propertyData ?? {};
  return {
    propertyPostStatusId,
    blockName,
    floor,
    buildingArea,
    capetAreas,
    buildingLine,
    numberOfFloor,
    numberOfBedrooms,
    numberOfBathrooms,
    direction: direction === 'NULL' ? null : direction,
    legalInfoId,
    isCollateralized,
    collateralizedAtBankId,
    width,
    length,
    propertyLocation: propertyLocation?.toUpperCase(),
    alleyWidth,
    balconyDirection: balconyDirection === 'NULL' ? null : balconyDirection, // Hướng ban công
  };
};

/**
 * Map data UI to object request
 * @param {*} state data input from UI
 * @param {*} isUpdate flog for update property or create
 * @param {*} isPrivate flag for save draft or public
 * @returns object request API
 */
const mapping = (state, isUpdate = null, isPrivate = null) => {
  const originData = state.originState;
  const step1Data = state.step1Data;
  const step2Data = state.step2Data;
  const step3Data = state.step3Data;
  const step4Data = state.step4Data;
  const inputIsUpdate = isUpdate !== null ? isUpdate : state.isEdit;

  const generalInfoInput = mapGeneralToInput(step1Data);
  const detailInfo = mapToPropertyDetail(step1Data);
  const imagesInfo = mapStep2Data(step2Data);
  const ownerInfo = mapStep4Data(step4Data);

  const inputIsPrivate = isPrivate !== null ? isPrivate : state.isPrivate;

  const objectInput = {
    tokenCaptcha: state.tokenCaptcha,
    expiredDate: NumberUtils.parseIntValue(state.expiredDate),
    isFeatureProperty: false,
    isPrivate: inputIsPrivate,
    isCollateralized: false,
    postTypeId: step1Data.postTypeId || originData?.postTypeId,

    ...detailInfo,
    ...generalInfoInput,
    ...state.coordinate,
    ...ownerInfo,
    ...imagesInfo,

    staffUserId: step3Data?.staffUserId,
  };
  for (const [key, value] of Object.entries(objectInput)) {
    if ((value === null || value?.length === 0) && key !== 'freeTextProject') {
      delete objectInput[key];
    }
  }
  let input = {};

  if (inputIsUpdate) {
    objectInput.propertyPostId = originData.propertyPostId;
    objectInput.ownerId = originData.ownerId;
    objectInput.addressId = originData.addressId;
    objectInput.recordVersion = originData?.recordVersion;
    !inputIsPrivate && delete objectInput.staffUserId;
    delete objectInput.tokenCaptcha;
    input = {updateC2CPropertyPostInput: objectInput};
  } else {
    input = {createC2CPropertyPost: objectInput};
  }

  return input;
};

const onNumberChange = (number, key, onComponentChange) => {
  if (isValidIntNumberForPost(number)) {
    onComponentChange({[key]: number});
  }
};

const onNumberChangeMinor = (number, key, onComponentChange, isPlus = true) => {
  let value = NumberUtils.parseIntValue(number);
  if (isPlus) {
    value++;
  } else {
    value--;
  }

  if (isValidIntNumberForPost(value)) {
    onComponentChange({[key]: value});
  }
};

const onFloatNumberChange = (oldNumber, key, onComponentChange) => {
  const number = oldNumber.replace(',', '.');
  if (isValidFloatNumberForPost(number)) {
    onComponentChange({[key]: number});
  }
};

function isValidFloatNumberForPost(
  number,
  maxRoundNumber = MAX_LENGTH.arceRoundNumber,
  maxFractionNumber = MAX_LENGTH.arceFractionNumber,
) {
  const isValid = NumberUtils.isValidFloatNumber(number, maxRoundNumber, maxFractionNumber);
  return isValid;
}

function isValidIntNumberForPost(number, maxRoundNumber = MAX_LENGTH.bedBathFloorNumber) {
  const isValid = NumberUtils.isValidIntNumber(number, maxRoundNumber);
  return isValid;
}

const mapPropertyItem = item => {
  return {
    ...(item?.node || {}),
    images: mapToUiImageSelectionSources({images: item.node?.images}),
  };
};

const isOtherProjectId = projectId => {
  const isOther = !projectId || projectId === CONSTANTS.DROPDOWN_OTHER_ID;
  return isOther;
};

const getRentPeriodString = period => {
  if (NumberUtils.isValidIntNumber(String(period))) {
    const value = NumberUtils.parseIntValue(period);
    return `${value} tháng`;
  }
  return '';
};

const parseCommission = (
  commission,
  commissionCurrencyUnitId,
  defaultUnit = CommissionCurrencyUnit.VND,
) => {
  if (isNaN(commission) || isNil(commission)) {
    return '';
  }
  if (commission === 0) {
    return '0%';
  }

  if (commissionCurrencyUnitId) {
    switch (commissionCurrencyUnitId) {
      case CommissionCurrencyUnit.PERCENTAGE:
        return commission + '%';
      case CommissionCurrencyUnit.VND:
        return MeasureUtils.getPriceDescriptionNoUnitInput(commission);
    }
  }

  if (commission > 100) {
    return MeasureUtils.getPriceDescriptionNoUnitInput(commission);
  }

  const output =
    defaultUnit === CommissionCurrencyUnit.VND
      ? MeasureUtils.getPriceDescriptionNoUnitInput(commission)
      : commission + '%';
  return output;
};

const getShouldShowGuaranteePostBadge = (
  contractStatus,
  packageEndTime,
  viewOwner,
  postServiceType,
) => {
  if (postServiceType && postServiceType === PostServiceType.Guaranteed) {
    if (viewOwner) return true;
    else {
      return (
        contractStatus === PostContractStatus.Haspaid &&
        packageEndTime &&
        moment().isBefore(packageEndTime)
      );
    }
  }

  return false;
};

// TODO: comment feature ký kết hợp đồng tin đăng đảm bảo
// eslint-disable-next-line no-unused-vars
const getShouldShowGuaranteeContractView = guaranteedPackage => {
  // const {contractStatus} = guaranteedPackage ?? {};
  // return (
  //   contractStatus === GUARANTEE_CONTRACT_STATUS.WAIT_FOR_PAY ||
  //   contractStatus === GUARANTEE_CONTRACT_STATUS.HAS_PAID ||
  //   contractStatus === GUARANTEE_CONTRACT_STATUS.REFUSE
  // );
  return null;
};

const getShouldShowRatingView = (state, viewByOtherMode) => {
  const {contractStatus} = state?.guaranteedPackage ?? {};
  if (viewByOtherMode) {
    return true;
  } else {
    return contractStatus === GUARANTEE_CONTRACT_STATUS.HAS_PAID;
  }
};

const getVisibleAgentView = ({
  staffInfo,
  staffInfoLoading,
  sellerInfo,
  viewByOtherMode,
  isPreview,
}) => {
  if (!viewByOtherMode || isPreview) {
    return staffInfo && !staffInfoLoading;
  } else {
    return sellerInfo;
  }
};

const canRequestSupport = (masterData, postInfo) => {
  const postApprovalStatusId = postInfo.propertyPostApprovalStatusId;
  const postApprovalStatus = getPropertyPostApprovalStatusById(masterData, postApprovalStatusId);
  if (!postApprovalStatus || postInfo.isPrivate) {
    return false;
  }

  switch (postApprovalStatus.propertyPostApprovalStatusName) {
    case APPROVAL_STATUS.APPROVAL:
    case APPROVAL_STATUS.REQUEST:
    case APPROVAL_STATUS.WAITING:
      return true;
    default:
      return false;
  }
};

const mapCommissionChartLegends = (totalAmount, buyerPercentage, sellerPercentage) => {
  const buyerAmount = Math.round((totalAmount * buyerPercentage) / 100);
  const sellerAmount = Math.round((totalAmount * sellerPercentage) / 100);

  return [
    {
      title: translate('newPost.commissionConfig.buyer'),
      titleDescription: `${NumberUtils.formatNumberToCurrencyNumber(
        buyerAmount,
        0,
      )} ${APP_CURRENCY}`,
      description: `${buyerPercentage ?? 0}${PERCENTAGE_UNIT}`,
      themeColor: COMMISSION_CHART_COLORS_THEME.buyer,
    },
    {
      title: translate('newPost.commissionConfig.seller'),
      titleDescription: `${NumberUtils.formatNumberToCurrencyNumber(
        sellerAmount,
        0,
      )} ${APP_CURRENCY}`,
      description: `${sellerPercentage ?? 0}${PERCENTAGE_UNIT}`,
      themeColor: COMMISSION_CHART_COLORS_THEME.seller,
    },
  ];
};

const mapCommissionChartData = (props: {
  buyerPercentage: Required<Number>,
  sellerPercentage: Required<Number>,
}) => {
  const output = [];
  for (const obj in props) {
    if (props[obj] > 0) {
      output.push(props[obj]);
    }
  }

  return output.map((e, index) => ({
    x: index + 1,
    y: e,
  }));
};

const mapCommissionChartColorScales = (props: {
  buyerPercentage: Required<Number>,
  sellerPercentage: Required<Number>,
}) => {
  const colors = [];
  for (const obj in props) {
    if (props[obj] > 0) {
      switch (obj) {
        case 'buyerPercentage':
          colors.push(COMMISSION_CHART_COLORS_THEME.buyer);
          break;
        case 'sellerPercentage':
          colors.push(COMMISSION_CHART_COLORS_THEME.seller);
          break;
      }
    }
  }

  return colors;
};

const calculateTotalCommissionAmount = (price, commission, commissionCurrencyUnit) => {
  const totalCommission =
    commissionCurrencyUnit === CommissionCurrencyUnit.PERCENTAGE
      ? (commission * price) / 100
      : commission;

  return Math.round(totalCommission);
};

const getPropertyStatuses = ({
  propertyPostApprovalStatusName,
  propertyPostApprovalStatusDescription,
  guaranteedPackageStatus,
  showApprovalStatus,
  forSale,
  isSold,
  viewByOtherMode,
}) => {
  let statusDescription = getPropertyPostApprovalStatusDescriptionByName(
    propertyPostApprovalStatusName,
    propertyPostApprovalStatusDescription,
  );

  if (propertyPostApprovalStatusName === APPROVAL_STATUS.APPROVAL && viewByOtherMode) {
    statusDescription = '';
  }

  const statusBackground = getPropertyPostStatusStyle(propertyPostApprovalStatusName);
  const statusTextColor = getPropertyPostTextColor(propertyPostApprovalStatusName);

  const guaranteedStatusBackgroundColor = getGuaranteeContractStatusStyle(guaranteedPackageStatus);

  const guaranteedStatusTextColor = getGuaranteeContractStatusStyle(guaranteedPackageStatus, false);

  const statuses = [
    // #Post for rent statuses
    // {
    //   isVisible: false,
    //   containerStyle: styles.statusForRentContainer,
    //   statusText: translate('common.forRent'),
    //   statusTextStyle: styles.statusForRentText,
    // },
    // {
    //   isVisible: forRent && isRented && !isSold,
    //   containerStyle: styles.rentedContainer,
    //   statusText: translate('propertyPost.isRented'),
    //   statusTextStyle: styles.rentedText,
    // },
    {
      isVisible: forSale && isSold && viewByOtherMode,
      containerStyle: styles.statusForSaleContainer,
      iconLeft: IMAGES.IC_CANCEL_HOUSE,
      statusText: translate('propertyPost.status.sold'),
    },
    {
      isVisible: showApprovalStatus && !!statusDescription,
      containerStyle: statusBackground,
      statusText: statusDescription,
      statusTextStyle: statusTextColor,
    },
    // #Guaranteed Post statuses
    // {
    //   isVisible: PropertyPostUtils.getShouldShowGuaranteePostBadge(
    //     guaranteedPackageStatus,
    //     guaranteedPackageEndTime,
    //     !viewByOtherMode,
    //     postServiceType,
    //   ),
    //   containerStyle: styles.statusPropertyServiceTypeContainer,
    //   iconLeft: IMAGES.IC_PROTECT,
    //   statusText: translate('propertyPost.guaranteedProperty'),
    //   statusTextStyle: styles.statusPropertyServiceTypeText,
    // },
    // {
    //   isVisible:
    //     !viewByOtherMode &&
    //     !!guaranteedPackageStatus &&
    //     postServiceType === PostServiceType.Guaranteed &&
    //     propertyPostApprovalStatusName === APPROVAL_STATUS.APPROVAL,
    //   containerStyle: {backgroundColor: guaranteedStatusBackgroundColor},
    //   statusText: mapPropertyContractStatus(guaranteedPackageStatus),
    //   statusTextStyle: {color: guaranteedStatusTextColor},
    // },
  ];

  return statuses;
};

const getPropertyType = (isEdit, masterData, state) => {
  return getPropertyTypeById(
    masterData,
    isEdit ? state.originState.propertyTypeId : state.step1Data.propertyTypeId,
  );
};

const getPropertyStatusDescription = (isEdit, masterData, state) => {
  return getPropertyPostStatusDescriptionById(
    masterData,
    isEdit ? state.originState.propertyPostStatusId : state.step1Data.propertyPostStatusId,
  );
};

const getLegalInfoDescription = (isEdit, masterData, state) => {
  return getLegalInfoDescriptionById(
    masterData,
    isEdit ? state.originState.legalInfoId : state.step1Data.legalInfoId,
  );
};

const getCollateralizedAtBank = (isEdit, masterData, state) => {
  return getBankDescriptionById(
    masterData,
    isEdit ? state?.originState?.collateralizedAtBankId : state?.step1Data?.collateralizedAtBankId,
  );
};

const getMapImages = images => {
  if (!images) {
    return [];
  }
  return images.map(item => {
    return {uri: item.url || item.uri, dimensions: {width: 1080, height: 1920}};
  });
};

const formatDirection = direction => {
  if (direction && direction !== 'NULL') {
    return translate(direction);
  }
  return null;
};

const getPriceToString = ({masterData, value, unitOfMeasureId}) => {
  const price = NumberUtils.parseFloatValue(value);
  if (!unitOfMeasureId) {
    return MeasureUtils.getPriceDescriptionNoUnitInput(price);
  }
  const unitOfMeasure = getUnitOfMeasureById(masterData, unitOfMeasureId);
  return PropertyPostUtils.priceToString(price, unitOfMeasure);
};

const mappingViewingState = (masterData, state, isCustomerView) => {
  if (!state) {
    return {};
  }
  const propertyType = getPropertyType(true, masterData, state);
  const createdDate = dateToString(state.originState.createdDatetime);
  const updatedDate = dateToString(
    state.originState.lastModified ||
      state.originState?.updatedDatetime ||
      state.originState.createdDatetime,
  );

  const formattedPrice = getPriceToString({
    masterData: masterData,
    value: state.originState?.price,
    unitOfMeasureId: state.originState?.unitOfMeasureId,
  }).toLowerCase();
  const formattedRentPrice = getPriceToString({
    masterData: masterData,
    value: state.originState?.propertyPostForRentDto?.rentPrice,
    unitOfMeasureId: '',
  });
  const commissionText = PropertyPostUtils.parseCommission(
    state?.originState?.commission,
    state?.originState?.saleCommissionCurrencyUnitId,
    CommissionCurrencyUnit.PERCENTAGE,
  );
  const rentCommissionText = PropertyPostUtils.parseCommission(
    state?.originState?.propertyPostForRentDto?.rentCommission,
    state?.originState?.propertyPostForRentDto?.rentCommissionCurrencyUnitId,
    CommissionCurrencyUnit.VND,
  );

  const pricePerSquare = MeasureUtils.getPricePerSquare(
    state?.step1Data?.price,
    state?.step1Data?.buildingArea,
    1,
  );

  const result = {
    propertyPostId: state.originState?.propertyPostId,
    propertyCode: state.originState?.propertyCode,
    isPrivate: state.originState?.isPrivate,
    images: mapToUiImageSelectionSources({
      images: state.originState.images,
      isSortable: true,
    }),
    addressId: state.originState?.addressId ?? null,
    address: extractAddressData(state.originState.propertyAddress, isCustomerView),
    postTitle: state.originState.postTitle,
    createdDate,
    updatedDate,
    expiredDate: dateToString(state.originState.expiredDate),
    bedRooms: state.originState.numberOfBedrooms,
    bathRooms: state.originState.numberOfBathrooms,
    floor: state.originState.floor,
    numberOfFloor: state.originState.numberOfFloor,
    forSale: state.originState?.forSale ?? false,
    forRent: state.originState?.forRent ?? false,
    commission: commissionText,
    price: formattedPrice,
    rentPrice: formattedRentPrice,
    rentCommission: rentCommissionText,
    rentPeriod: PropertyPostUtils.getRentPeriodString(
      state.originState?.propertyPostForRentDto?.rentPeriod,
    ),
    negotiable: state.originState?.negotiable,
    length: state.originState?.length,
    width: state.originState?.width,
    totalShare: state.originState?.totalShare,
    totalFollower: state.originState?.totalFollower,
    totalSpam: state.originState?.totalSpam,
    apartmentAcreage: state.originState.buildingArea,
    capetAreas: state.originState.capetAreas,
    buildingArea: state.originState.buildingArea,
    propertyStatus: getPropertyStatusDescription(true, masterData, state),
    direction: formatDirection(state.originState.direction),
    legalStatus: getLegalInfoDescription(true, masterData, state),
    propertyType: propertyType?.propertyTypeName,
    propertyName: propertyType?.propertyTypeDescription,
    tower: state.originState.blockName,
    boundaryLine: state.originState.buildingLine,
    mortgaged: state.originState.isCollateralized,
    mortgagedBank: getCollateralizedAtBank(true, masterData, state),
    ownerName: state.originState.owner?.customerFullName,
    ownerPhoneNumber: state.originState.owner?.customerPhone,
    ownerEmail: state.originState.owner?.customerEmail,
    postDescription: state.originState?.postDescription,
    propertyPostApprovalStatusId: state.originState?.propertyPostApprovalStatusId,
    requestedUpdatingReason: state?.requestedUpdatingReason,
    rejectedReason: state.originState?.rejectedReason,
    createdByUserId: state.originState?.createdByUserId,
    isFollowed: state.originState?.isFollowed,
    freeTextProject: state.originState?.freeTextProject,
    b2C2CProjectId: state.originState?.b2C2CProjectId,
    b2C2CProjectInfo: state.originState?.b2C2CProjectInfo,
    projectInfo: state.originState?.projectInfo,
    isSold: state.originState?.isSold,
    isRented: state.originState?.propertyPostForRentDto?.isRented ?? state?.originState?.isRented,
    nearFacility: JsonDataUtils.parseJSONArray(state.originState?.nearFacility),
    internalFacility: JsonDataUtils.parseJSONArray(state.originState?.internalFacility),
    isShowGoogleStreetView: state.originState?.isShowGoogleStreetView,
    longitude: state.originState?.longitude,
    latitude: state.originState?.latitude,
    guaranteedPackage: state.originState?.guaranteedPackage,
    postServiceType: state.originState?.postServiceType,
    contractStatus: state.originState?.contractStatus,
    propertyLocation: state.originState?.propertyLocation?.toUpperCase(),
    alleyWidth: state.originState?.alleyWidth,
    commissionTpl: state.originState?.commissionTpl,
    commissionBuyer: state.originState?.commissionBuyer,
    commissionSeller: state.originState?.commissionSeller,
    priceRaw: state.originState?.price,
    commissionRaw: state.originState?.commission,
    commissionCurrenyUnit: state.originState?.saleCommissionCurrencyUnitId,
    balconyDirection: formatDirection(state.originState?.balconyDirection),
    matterportUrl: state.originState?.matterportUrl,
    detailPath: state.originState?.detailPath,
    pricePerSquare,
    rating: state.originState?.rating,
    sellerInfo: state.originState?.sellerInfo,
  };

  return result;
};

const mappingPreviewState = (masterData, state) => {
  if (!state) {
    return {};
  }

  const propertyType = getPropertyType(false, masterData, state);
  const formattedPrice = getPriceToString({
    masterData: masterData,
    value: state.step1Data?.price,
    unitOfMeasureId: state.step1Data?.unitOfMeasureId,
  });

  const formattedRentPrice = getPriceToString({
    masterData: masterData,
    value: state.step1Data?.rentPrice,
    unitOfMeasureId: '',
  });

  const createdDate = getCurrentDateString();
  const updatedDate = getCurrentDateString();
  const commissionText = PropertyPostUtils.parseCommission(
    state?.step1Data?.commission,
    state?.step1Data?.saleCommissionCurrencyUnitId,
    CommissionCurrencyUnit.PERCENTAGE,
  );
  const rentCommissionText = PropertyPostUtils.parseCommission(
    state?.step1Data?.rentCommission,
    state?.step1Data?.rentCommissionCurrencyUnitId,
    CommissionCurrencyUnit.VND,
  );

  const pricePerSquare = MeasureUtils.getPricePerSquare(
    state?.step1Data?.price,
    state?.step1Data?.buildingArea,
    1,
  );

  const result = {
    propertyPostId: state.originState?.propertyPostId,
    isPrivate: state.originState?.isPrivate,
    images: mapToUiImageSelectionSources({images: state?.step2Data?.images, isSortable: true}),
    addressId: state.originState?.addressId ?? null,
    address: extractAddressData(state.step1Data.propertyAddress, false),
    postTitle: state.step2Data.postTitle,
    createdDate,
    updatedDate,
    expiredDate: dateToString(state.expiredDate),
    bedRooms: state.step1Data.numberOfBedrooms,
    bathRooms: state.step1Data.numberOfBathrooms,
    floor: state.step1Data.floor,
    numberOfFloor: state.step1Data.numberOfFloor,
    commission: commissionText,
    price: formattedPrice,
    forSale: state?.step1Data?.forSale ?? true,
    forRent: state?.step1Data?.forRent,
    rentCommission: rentCommissionText,
    rentPeriod: PropertyPostUtils.getRentPeriodString(state?.step1Data?.rentPeriod),
    rentPrice: formattedRentPrice,
    negotiable: state?.step1Data?.negotiable,
    length: state?.step1Data?.length,
    width: state?.step1Data?.width,
    totalShare: 0,
    totalFollower: 0,
    apartmentAcreage: state.step1Data?.buildingArea,
    capetAreas: state.step1Data?.capetAreas,
    buildingArea: state.step1Data?.buildingArea,
    propertyStatus: getPropertyStatusDescription(false, masterData, state),
    direction: formatDirection(state.step1Data?.direction),
    legalStatus: getLegalInfoDescription(false, masterData, state),
    propertyType: propertyType?.propertyTypeName,
    propertyName: propertyType?.propertyTypeDescription,
    tower: state.step1Data.blockName,
    boundaryLine: state.step1Data.buildingLine,
    mortgaged: state.step1Data.isCollateralized,
    mortgagedBank: getCollateralizedAtBank(false, masterData, state),
    ownerName: state.step1Data?.owner?.customerFullName,
    ownerPhoneNumber: state.step1Data?.owner?.customerPhone,
    ownerEmail: state.step1Data?.owner?.customerEmail,
    postDescription: state.step2Data?.postDescription,
    propertyPostApprovalStatusId: state.originState?.propertyPostApprovalStatusId,
    requestedUpdatingReason: state.originState?.requestedUpdatingReason,
    rejectedReason: state.originState?.rejectedReason,
    createdByUserId: state.originState?.createdByUserId,
    isFollowed: state.originState?.isFollowed,
    freeTextProject: state.step1Data?.freeTextProject,
    b2C2CProjectId: state.originState?.b2C2CProjectId,
    b2C2CProjectInfo: state.originState?.b2C2CProjectInfo,
    projectInfo: state.step1Data?.projectInfo,
    nearFacility: state?.step1Data?.nearFacility,
    internalFacility: state?.step1Data?.internalFacility,
    postServiceType: state?.step2Data?.postServiceType,
    contractStatus: PostContractStatus.Unsent,
    longitude: state?.coordinate?.longitude ?? 0,
    latitude: state?.coordinate?.latitude ?? 0,
    propertyLocation: state?.step1Data?.propertyLocation,
    alleyWidth: state.step1Data?.alleyWidth,
    commissionTpl: state.step1Data?.commissionTpl,
    commissionBuyer: state.step1Data?.commissionBuyer,
    commissionSeller: state.step1Data?.commissionSeller,
    priceRaw: state.step1Data?.price,
    commissionRaw: state.step1Data?.commission,
    commissionCurrenyUnit: state?.step1Data?.saleCommissionCurrencyUnitId,
    balconyDirection: formatDirection(state.step1Data.balconyDirection),
    staffInfo: state?.step3Data?.chosenAgent,
    pricePerSquare,
  };

  return result;
};

/**
 * Map original property data to UI data to view
 * @param {*} masterData master data (meta data)
 * @param {*} state property post data
 * @param {*} currentUserId user id logged in app
 * @param {*} isPreview (true/false) Preview property mode or view property
 * @param {*} isCustomerView (true/false) View property with customer mode (buyer) / View property with owner mode
 * @returns Object property data UI
 */
const mappingState = (masterData, state, currentUserId, isPreview, isCustomerView) => {
  if (!state) {
    return {};
  }
  const isViewing = !isPreview;
  let result = isViewing
    ? mappingViewingState(masterData, state, isCustomerView)
    : mappingPreviewState(masterData, state);

  const isCreatedUser =
    !result.createdByUserId || (result.createdByUserId && result.createdByUserId === currentUserId);
  const approvalStatus = getPropertyPostApprovalStatusById(
    masterData,
    result.propertyPostApprovalStatusId,
  );

  // don't show approval status for private post or preview when create
  const showApprovalStatus = isViewing && !!approvalStatus && !result.isPrivate;
  const showUpdatingReason =
    isCreatedUser &&
    approvalStatus &&
    approvalStatus.propertyPostApprovalStatusName === APPROVAL_STATUS.REQUEST;
  const showRejectedReason =
    isCreatedUser &&
    approvalStatus &&
    approvalStatus.propertyPostApprovalStatusName === APPROVAL_STATUS.REJECTED;
  const showShareLike = PropertyPostUtils.canShowShareLike(
    masterData,
    result.propertyPostApprovalStatusId,
  );

  result = {
    ...result,
    approvalStatus,
    showApprovalStatus,
    showUpdatingReason,
    showRejectedReason,
    showShareLike,
    isCreatedUser,
  };

  return result;
};

const PropertyPostUtils = {
  canClosePost,
  canEditPost,
  canShowShareLike,
  canContactToBuy,
  priceToString,
  mapping,
  onNumberChange,
  onNumberChangeMinor,
  onFloatNumberChange,
  isValidIntNumberForPost,
  isValidFloatNumberForPost,
  mapPropertyItem,
  isOtherProjectId,
  getRentPeriodString,
  parseCommission,
  getShouldShowGuaranteePostBadge,
  getShouldShowGuaranteeContractView,
  getShouldShowRatingView,
  getVisibleAgentView,
  canRequestSupport,
  mapCommissionChartLegends,
  mapCommissionChartData,
  mapCommissionChartColorScales,
  calculateTotalCommissionAmount,
  getPropertyStatuses,
  getMapImages,
  mappingState,
};

export default PropertyPostUtils;
