import isEmpty from 'lodash/isEmpty';

import {ContactTradingInfoDto, PropertyPostDto} from '../../api/graphql/generated/graphql';
import {
  CommissionCurrencyUnit,
  CONTACT_STATUS_ID,
  DAY_TO_MILISECOND,
  PAYMENT_METHODS,
} from '../../assets/constants';
import {getPendingReasonDescById} from '../../utils/GetMasterData';
import JsonDataUtils from '../../utils/JsonDataUtils';
import MeasureUtils from '../../utils/MeasureUtils';
import {getTransactionDateTimeString} from '../../utils/TimerCommon';
import PropertyPostUtils from '../ManagePost/PropertyPostUtils';
import {ProgressDetail} from './type';

const mapResponseRequestInfoToUI = (
  data: ContactTradingInfoDto,
  masterData,
  isSending,
  propertyPostDto: PropertyPostDto,
) => {
  if (!data) {
    return {};
  }
  // Huỷ cọc với tiền bồi thường [pending reason Id from master data]
  const showPendingPriceById = 'db5b2c8d-2275-4c7f-a374-f68e0272f2fe';
  const {
    assigneeEmail,
    assigneeFullName,
    assigneePhoneNumber,
    assigneeProfilePhoto,
    assigneeStaffGroupName,
    contract,
    contactTradingStatusId,
    createdDatetime,
    updatedDatetime,
    customerPhoneNumber: customerPhone,
    customerEmail,
    customerFullName,
    requesterPhoneNumber: requesterPhone,
    requesterId,
    requesterFullName,
    requesterEmail,
    requesterProfilePhoto,
    requesterIsAgency,
    requesterIsBuyer,
    pendingReason,
    pendingCompensationAmount,
    deposit,
    serviceBonus,
    negotiationPrice,
  } = data ?? {};

  const initailPaymentProgressDetail: ProgressDetail = {
    amount: '',
    paymentDatetime: '',
    paymentTerms: '',
    remainingPayAmount: deposit?.depositedAmount,
    minDate: deposit?.depositPaymentTermFrom ? new Date(deposit?.depositPaymentTermFrom) : null,
  };

  let customerPhoneNumber = customerPhone || null;
  customerPhoneNumber = customerPhoneNumber ? JSON.parse(customerPhoneNumber) : [];
  customerPhoneNumber = customerPhoneNumber.join(', ');

  let requesterPhoneNumber = requesterPhone || null;
  requesterPhoneNumber = requesterPhoneNumber ? JSON.parse(requesterPhoneNumber) : [];
  requesterPhoneNumber = requesterPhoneNumber.join(', ');

  const contractDetail = {
    ...contract,
    attachment: JSON.parse(contract?.attachment ?? '{}')?.images ?? [],
  };

  const {avatar, email, fullName, isAgent, phoneNumber, sellerId} =
    propertyPostDto?.sellerInfo ?? {};

  const {
    owner: ownerInfo,
    ownerIsAuthor,
    commission,
    commissionTpl,
    saleCommissionCurrencyUnitId,
  } = propertyPostDto ?? {};

  const isAccepted =
    !isEmpty(contactTradingStatusId) &&
    contactTradingStatusId !== CONTACT_STATUS_ID.Rejected &&
    contactTradingStatusId !== CONTACT_STATUS_ID.Waiting;

  const requester = {
    contactRole: 'requester',
    userId: requesterId,
    avatar: requesterProfilePhoto,
    fullName: requesterFullName,
    phoneNumber: requesterPhoneNumber,
    email: requesterEmail,
    visible: requesterId !== (ownerIsAuthor ? sellerId : ownerInfo?.userId),
    contactable: isAccepted,
    isAgent: requesterIsAgency,
  };

  const customer = {
    contactRole: 'buyer',
    avatar: requesterIsBuyer ? requesterProfilePhoto : '',
    fullName: requesterIsBuyer ? requesterFullName : customerFullName,
    phoneNumber: requesterIsBuyer ? requesterPhoneNumber : customerPhoneNumber,
    email: requesterIsBuyer ? requesterEmail : customerEmail,
  };

  const seller = {
    contactRole: 'seller',
    userId: sellerId,
    visible: phoneNumber !== (requesterIsBuyer ? requesterPhoneNumber : customerPhoneNumber),
    contactable:
      isAccepted && phoneNumber !== (requesterIsBuyer ? requesterPhoneNumber : customerPhoneNumber),
    avatar: avatar,
    fullName: fullName,
    phoneNumber: phoneNumber,
    email: email,
    isAgent,
  };

  const owner = {
    contactRole: 'owner',
    userId: ownerIsAuthor ? sellerId : ownerInfo?.userId,
    avatar: ownerIsAuthor ? avatar : '',
    fullName: ownerIsAuthor ? fullName : ownerInfo?.customerFullName,
    email: ownerIsAuthor ? email : ownerInfo?.customerEmail,
    phoneNumber: ownerIsAuthor ? phoneNumber : ownerInfo?.customerPhone,
  };

  const staff = {
    contactRole: 'staff',
    visible: true,
    contactable: true,
    avatar: assigneeProfilePhoto,
    fullName: assigneeFullName,
    phoneNumber: assigneePhoneNumber,
    email: assigneeEmail,
    agentGroup: assigneeStaffGroupName,
  };

  const contactInfoList = isSending ? [seller, customer, staff] : [requester, owner, staff];

  const contactTradingObj = {
    ...data,
    contactInfoList: contactInfoList,
    requesterPhoneNumber,
    createdDate: getTransactionDateTimeString(createdDatetime),
    updatedDate: getTransactionDateTimeString(updatedDatetime),
    customerPhoneNumber,
    pendingReason: pendingReason ? getPendingReasonDescById(masterData, pendingReason ?? '') : '',
    showPendingPrice: showPendingPriceById === pendingReason ?? false,
    pendingCompensationAmount: pendingCompensationAmount ?? 0,
    contract: contractDetail,
    deposit: {
      ...deposit,
      commission: deposit?.commission ?? commission,
      commissionUnitId:
        deposit?.commissionUnitId ??
        saleCommissionCurrencyUnitId ??
        CommissionCurrencyUnit.PERCENTAGE,
      commissionTpl: deposit?.commissionTpl ?? commissionTpl,
      closingPrice: deposit?.closingPrice ?? negotiationPrice ?? '',
      depositTerm: deposit?.depositTerm ?? 0,
      depositedAmount: deposit?.depositedAmount ?? 0,
      paymentMethodId: deposit?.paymentMethodId ?? PAYMENT_METHODS.cash.id,
      paymentProgressDtos:
        deposit?.paymentProgressDtos && deposit?.paymentProgressDtos?.length > 0
          ? mapPaymentProgress(
              deposit.paymentProgressDtos,
              deposit?.depositPaymentTermFrom,
              deposit?.depositPaymentTermTo,
            )
          : [initailPaymentProgressDetail],
      attachment: JSON.parse(deposit?.attachment || '[]') ?? [],
    },
    listServiceBonus: JsonDataUtils.parseJSONArray(serviceBonus),
  };
  return contactTradingObj;
};

const mapResponsePropertyPostInfoToUI = data => {
  if (!data) {
    return {};
  }
  const {
    propertyAddress,
    propertyCode,
    projectInfo,
    price,
    buildingArea,
    numberOfBedrooms,
    numberOfBathrooms,
    images = '[]',
    commission,
    saleCommissionCurrencyUnitId,
    direction,
    postTitle,
    guaranteedPackage,
    postServiceType,
  } = data ?? {};

  const {cityName = '', districtName = '', wardName = '', streetName = ''} = propertyAddress ?? {};
  let interestedArea = districtName;
  if (!isEmpty(cityName)) {
    interestedArea = interestedArea + (isEmpty(interestedArea) ? '' : ', ') + cityName;
  }

  const address =
    streetName +
    (!!streetName && ', ') +
    wardName +
    (!!wardName && ', ') +
    districtName +
    (!!districtName && ', ') +
    cityName;

  let priceRange = price ?? 0;
  priceRange = MeasureUtils.getPriceDescriptionNoUnitInput(price);

  let areaMeasurement = buildingArea ?? 0;
  areaMeasurement = MeasureUtils.getSquareMeterText(areaMeasurement);

  const commissionText = PropertyPostUtils.parseCommission(
    commission,
    saleCommissionCurrencyUnitId,
    CommissionCurrencyUnit.PERCENTAGE,
  );

  const propertyPostObj = {
    postId: propertyCode ?? '',
    project: projectInfo?.projectName ?? '',
    projectId: projectInfo?.projectId ?? '',
    interestedNeighborhood: interestedArea ?? '',
    priceRange,
    areaMeasurement,
    direction,
    commission: commissionText,
    numberOfBedrooms,
    numberOfBathrooms,
    images: JSON.parse(images),
    address,
    postTitle,
    guaranteedPackage,
    postServiceType,
  };
  return propertyPostObj;
};

const mapPropertyToObject = data => {
  if (!data) {
    return {};
  }
  const {
    propertyPostId = '',
    propertyCode = '',
    direction = '',
    propertyTypeId = '',
    propertyTypeName = '',
    projectInfo = '',
    projectId = '',
    propertyAddress = {},
    price = '',
    buildingArea = '',
    capetAreas = '',
    numberOfBedrooms = 0,
    numberOfBathrooms = 0,
  } = data ?? {};
  const postArea = buildingArea ?? capetAreas ?? '';

  const propertyInfo = {
    propertyCode,
    propertyPostId,
    direction,
    propertyTypeId,
    propertyTypeName,
    projectInfo,
    projectId,
    propertyAddress,
    postArea,
    price,
    numberOfBedroom: numberOfBedrooms,
    numberOfBathroom: numberOfBathrooms,
  };
  return propertyInfo;
};

const initialCTError = {
  city: '',
  district: '',
  fromPrice: '',
  toPrice: '',
  fromArea: '',
  toArea: '',
  postCode: '',
  isValid: false,
};
const initialCTState = {
  postInfo: {},
  postUrl: '',
  postCode: '',
  postDirection: '',
  location: '',
  price: '',
  postArea: '',
  propertyPostId: '',
  projectId: '',
  projectInfo: {},
  propertyAddress: {},
  propertyTypeName: '',
  propertyTypeId: '',
  defaultRelevantProperty: {},
  errors: initialCTError,
};

const mapStateCreateCT = allState => {
  const originState = allState?.originState;

  if (!isEmpty(originState)) {
    return {
      postDirection: originState.postDirection ?? '',
      price: originState.price ?? '',
      postArea: originState.postArea ?? '',
      propertyPostId: originState.propertyPostId ?? '',
      projectId: originState.projectId ?? '',
      projectInfo: originState.projectInfo,
      propertyAddress: originState.propertyAddress,
      propertyTypeName: originState.propertyTypeName ?? '',
      propertyTypeId: originState.propertyTypeId ?? '',
      postInfo: originState.postInfo,
      postUrl: originState.postUrl ?? '',
      postCode: originState.postCode ?? '',
      location: originState.location ?? '',
      numberOfBedRoom: originState.numberOfBedRoom ?? 0,
      numberOfBathRoom: originState.numberOfBathRoom ?? 0,
      defaultRelevantProperty: originState.defaultRelevantProperty ?? {},
    };
  }
  return initialCTState;
};

const filterPropertyIdsByRelevantStatusId = ({statusId, arrayData = []}) => {
  if (arrayData && !isEmpty(statusId)) {
    const filteredData = arrayData
      .filter(item => item.relevantPropertyStatus === statusId)
      .map(item => item.propertyPostId);
    if (filteredData && filteredData.length > 0) {
      return filteredData;
    }
  }
  return [''];
};

const mapResponseContactTradingInfoB2CUI = data => {
  if (!data) {
    return {};
  }
  const {
    contactTradingB2CId,
    consultantFullName,
    consultantId = null,
    contactTradingB2CCode,
    customerEmail,
    customerFullName,
    customerPhoneNumber,
    projectId,
    projectName,
    propertyPostCode,
    propertyPostId,
    requestDate,
    updatedDate,
    isFavorite, // khách hàng có quan tâm hoặc không
    floor,
    contactTradingB2CStatusName,
    propertyBlockName,
    agentFullName,
    agentId,
    description,
    contactTradingB2CStatusDescription,
    consultantPhoneNumber,
    propertyTypeName,
  } = data ?? {};
  const contactTradingInfo = {
    agentFullName: agentFullName ?? '',
    agentId: agentId ?? '',
    contactTradingId: contactTradingB2CId ?? '',
    requestCode: contactTradingB2CCode ?? '',
    assigneeId: consultantId ?? '',
    buyerFullName: customerFullName ?? '',
    buyerPhoneNumber: customerPhoneNumber ?? '',
    buyerEmail: customerEmail ?? '',
    status: contactTradingB2CStatusDescription ?? '',
    statusCode: contactTradingB2CStatusName ?? '',
    createdDate: getTransactionDateTimeString(requestDate),
    updatedDate: getTransactionDateTimeString(updatedDate),
    propertyPostId: propertyPostId ?? '',
    propertyTypeName: propertyTypeName ?? '',
    transactionType: 'Mua',
    isFavorite: isFavorite,
    fullName: customerFullName ?? '',
    phoneNumber: customerPhoneNumber ?? '',
    email: customerEmail ?? '',
  };
  const staffInfo = {
    assigneeFullName: consultantFullName ?? '',
    assigneePhoneNumber: consultantPhoneNumber ?? '',
  };

  const propertyPost = {
    postId: propertyPostCode ?? '',
    project: projectName ?? '',
    projectId: projectId ?? '',
    floor: floor,
    block: propertyBlockName,
    note: description,
  };

  return {contactTradingInfo, propertyPostInfo: propertyPost, staffInfo};
};

const mapPaymentProgress = (progresses, defaultMinDate, defaultMaxDate) => {
  if (!progresses) {
    return progresses;
  }
  const defaultMinimumDate = defaultMinDate ? new Date(defaultMinDate) : null;
  let minDate = null;
  const paymentProgresses: Array<ProgressDetail> = progresses.map((e, index) => {
    const output: ProgressDetail = {
      paymentDatetime: e?.paymentDatetime,
      paymentTerms: e?.paymentTerms ?? '',
      amount: e?.amount,
      remainingPayAmount: 0,
      minDate: index === 0 ? defaultMinimumDate : minDate,
      maxDate: index === 0 ? defaultMaxDate : null,
      paymentProgressId: e?.paymentProgressId ?? null,
    };
    minDate = e?.paymentDatetime ? new Date(e?.paymentDatetime + DAY_TO_MILISECOND) : null;
    return output;
  });

  return paymentProgresses;
};

export {
  filterPropertyIdsByRelevantStatusId,
  mapPropertyToObject,
  mapResponseContactTradingInfoB2CUI,
  mapResponsePropertyPostInfoToUI,
  mapResponseRequestInfoToUI,
  mapStateCreateCT,
};
