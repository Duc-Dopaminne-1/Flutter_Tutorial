import moment from 'moment';
import {useState} from 'react';

import {
  GetPropertyPostByIdForTransactionQuery,
  useCheckCurrentUserIsSaleAgentLazyQuery,
  useGetPropertyPostByIdForTransactionLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {
  APP_CURRENCY,
  FETCH_POLICY,
  SALE_TRACKING_STATUS,
  TRANSACTION_MODE,
} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import JsonDataUtils from '../../../utils/JsonDataUtils';
import MeasureUtils from '../../../utils/MeasureUtils';
import NumberUtils from '../../../utils/NumberUtils';
import {INITIAL_CONFIRM_PROPERTY_DATA, TransactionContextType} from './ConfirmPropertyConstants';

const getTypeDeposit = ({rawData}) => {
  const ableConfirmDeposite = rawData.ableConfirmDeposite;
  const bookingTransactionInfo = rawData.bookingTransactionInfo;
  const saleTrackingStatusName = rawData.saleTrackingStatusName;
  const isBooked = rawData.isBooked;
  const isDeposited = rawData?.isDeposited;

  const endDepositeDatetime = bookingTransactionInfo?.endDepositeDatetime;
  const beginDepositeDatetime = bookingTransactionInfo?.beginDepositeDatetime;
  const inTimeToDeposite =
    endDepositeDatetime &&
    beginDepositeDatetime &&
    moment().isBefore(moment(endDepositeDatetime)) &&
    moment().isAfter(moment(beginDepositeDatetime));

  let contextType = TransactionContextType.CannotDeposit;

  switch (saleTrackingStatusName) {
    case SALE_TRACKING_STATUS.HOLD_PLACE:
    case SALE_TRACKING_STATUS.BOOKED:
    case SALE_TRACKING_STATUS.BOOKING:
      contextType = isBooked
        ? TransactionContextType.CannotDeposit
        : TransactionContextType.Booking;
      break;
    case SALE_TRACKING_STATUS.WAITING_DEPOSIT:
      if (isBooked && ableConfirmDeposite && inTimeToDeposite) {
        contextType = TransactionContextType.BookedDeposit;
      }
      break;
    case SALE_TRACKING_STATUS.OPENING_DEPOSIT:
      contextType = TransactionContextType.NewDeposit;
      break;
    default:
      break;
  }

  if (isDeposited) {
    contextType = TransactionContextType.CannotDeposit;
  }
  return contextType;
};

const getContextType = ({rawData, transactionMode}) => {
  const saleTrackingStatusName = rawData.saleTrackingStatusName;

  let contextType = null;
  if (transactionMode === TRANSACTION_MODE.MOVE_DEPOSIT) {
    contextType =
      saleTrackingStatusName === SALE_TRACKING_STATUS.OPENING_DEPOSIT
        ? TransactionContextType.MoveDeposit
        : TransactionContextType.CannotDeposit;
  } else {
    contextType = getTypeDeposit({rawData});
  }

  return contextType;
};

const getCurrentMode = (rawData, transactionMode) => {
  const openDatetime = rawData.saleSeasonInfo?.openDatetime;
  let currentMode = transactionMode;
  if (
    transactionMode === TRANSACTION_MODE.BOOKING &&
    openDatetime &&
    moment(openDatetime).isBefore(moment())
  ) {
    currentMode = TRANSACTION_MODE.DEPOSIT;
  }
  return currentMode;
};

const mapPropertyByIdForTransactionToData = (rawData, transactionMode, isAgentUser) => {
  if (!rawData) {
    return INITIAL_CONFIRM_PROPERTY_DATA;
  }
  const rawImages = JsonDataUtils.parseJSONArray(rawData.images);
  let images = [];
  if (Array.isArray(rawImages) && rawImages.length > 0) {
    images = rawImages.map(item => ({uri: item.url}));
  }

  const fee = `${NumberUtils.formatNumber(rawData.bookingFee)} ${APP_CURRENCY}`;

  const isBooked = rawData.isBooked;
  const ableConfirmDeposite = rawData.ableConfirmDeposite;
  const bookingTransactionInfo = rawData.bookingTransactionInfo;
  const propertyPrice = Math.max(rawData.priceNoVat, rawData.priceVat);
  const fullPrice = `${NumberUtils.formatNumber(propertyPrice)} VND`;
  const priceOnMeter = `${NumberUtils.formatNumber(rawData.price)} VND`;
  let isDeposited = false;
  switch (rawData.saleTrackingStatusName) {
    case SALE_TRACKING_STATUS.DEPOSIT_CONFIRMED:
    case SALE_TRACKING_STATUS.SOLD:
    case SALE_TRACKING_STATUS.PILE_OUTSIDE:
      isDeposited = true;
      break;
    default:
      isDeposited = false;
  }

  // check deposited on payment transfer BIDV, FAST
  const isDepositedRawData = rawData.isDeposited;
  if (isDepositedRawData) {
    isDeposited = true;
  }

  const contextType = isDeposited
    ? TransactionContextType.CannotDeposit
    : getContextType({rawData, transactionMode});

  const currentMode = getCurrentMode(rawData, transactionMode);

  const parsedData = {
    propertyPostId: rawData.propertyPostId,
    propertyType: rawData.propertyTypeName,
    propertyTypeName: rawData.propertyTypeName,
    propertyTypeDescription: rawData.propertyTypeDescription,
    propertyCode: rawData.propertyCode,
    projectName: rawData.projectInfo?.projectName ?? '',
    projectCode: rawData.projectInfo?.projectCode ?? '',
    projectId: rawData.projectInfo?.projectId ?? '',
    floorOrSubAreaCode: rawData.blockName,
    images,
    price: priceOnMeter,
    propertyPrice: fullPrice,
    expectedPrice: rawData.expectedPrice,
    commission: `${rawData.commission ?? 0}%`,
    buyCommission: `${rawData.buyCommission ?? 0}%`,
    saleCommission: `${rawData.saleCommission ?? 0}%`,
    numberOfBooking: rawData.numberOfBookingTransactions,
    staffGroupIds: rawData.staffGroupIds ?? '',
    width: `${rawData?.width} m`,
    length: `${rawData?.length} m`,
    postDescription: rawData.postDescription,
    propertySubTypeDescription: rawData.propertySubTypeDescription ?? '',
    floor: rawData.floor,
    direction: rawData.direction ? translate(rawData.direction) : '',
    balconyDirection: rawData.balconyDirection ? translate(rawData.balconyDirection) : '',
    numberOfBedrooms: rawData.numberOfBedrooms,
    numberOfBathrooms: rawData.numberOfBathrooms,
    heartWellArea: MeasureUtils.getSquareMeterText(rawData.buildingArea),
    clearedArea: MeasureUtils.getSquareMeterText(rawData.capetAreas),
    saleTrackingStatus: rawData.foSaleTrackingStatusDescription,
    bookingFee: fee,
    houseDesign: rawData.houseDesign,
    numberOfFloor: rawData.numberOfFloor,
    tower: rawData.blockName,
    totalSiteArea: MeasureUtils.getSquareMeterText(rawData.totalSiteArea),
    buildingArea: MeasureUtils.getSquareMeterText(rawData.buildingArea),
    capetArea: MeasureUtils.getSquareMeterText(rawData.capetAreas),
    buildingLine: rawData.buildingLine ? `${rawData.buildingLine} m` : '',
    blockName: rawData.blockName,
    saleSeasonId: rawData.saleSeasonId ?? '',
    isBooked,
    ableConfirmDeposite,
    bookingTransactionInfo,
    contextType,
    isDeposited,
    rawPrice: rawData.price,
    isAgentUser,
    currentMode,
    rawBookingFee: rawData.bookingFee,
    detailPath: rawData?.detailPath,
  };

  return parsedData;
};

const useGetApiForConfirmProperty = ({
  propertyPostId,
  onSuccessDetail,
  onError,
  onSuccessCheckSaleAgent,
  onSuccessDetailAndIsSaleAgent,
}) => {
  const [propertyDetail, setPropertyDetail] = useState(null);
  const [spinnerDetail, setSpinnerDetail] = useState(false);

  const onSuccessGetDetail = result => {
    setPropertyDetail(result);
    onSuccessDetail && onSuccessDetail(result);
  };

  const {startApi: fetchDetailProperty, loading: loadingDetailProperty} = useGraphqlApiLazy({
    showSpinner: spinnerDetail,
    graphqlApiLazy: useGetPropertyPostByIdForTransactionLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'propertyPostByIdForTransaction',
    onSuccess: onSuccessGetDetail,
    onError,
  });

  const getPropertyForTransaction = ({newPropertyPostId, isShowSpinner = false}) => {
    const input = newPropertyPostId ?? propertyPostId;
    setSpinnerDetail(isShowSpinner);
    fetchDetailProperty({variables: {propertyPostId: input}});
  };

  const onSuccessCheckIsSaleAgent = result => {
    onSuccessCheckSaleAgent(result.isSaleAgent);
  };

  const {startApi: callCheckIsSaleAgent, loading: loadingIsSaleAgent} = useGraphqlApiLazy({
    graphqlApiLazy: useCheckCurrentUserIsSaleAgentLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'checkCurrentUserIsSaleAgent',
    showSpinner: false,
    onSuccess: onSuccessCheckIsSaleAgent,
  });

  const getCheckIsSaleAgent = (newPropertyPostId, newSaleSeasonId) => {
    callCheckIsSaleAgent({
      variables: {
        input: {
          propertyPostId: newPropertyPostId ?? propertyPostId,
          saleSeasonId: newSaleSeasonId ?? newSaleSeasonId,
        },
      },
    });
  };

  const onSuccessGetDetailAndIsSaleAgent = (result: GetPropertyPostByIdForTransactionQuery) => {
    onSuccessDetailAndIsSaleAgent && onSuccessDetailAndIsSaleAgent(result);
  };

  const {startApi: callGetDetailPropertyAndIsSaleAgent, loading: loadingDetailPropertyAndAgent} =
    useGraphqlApiLazy({
      graphqlApiLazy: useGetPropertyPostByIdForTransactionLazyQuery,
      queryOptions: {
        ...FETCH_POLICY.NETWORK_ONLY,
      },
      dataField: '',
      showSpinner: false,
      onSuccess: onSuccessGetDetailAndIsSaleAgent,
    });

  const getGetDetailPropertyAndIsSaleAgent = () => {
    callGetDetailPropertyAndIsSaleAgent({
      variables: {
        propertyPostId,
      },
    });
  };

  return {
    getPropertyForTransaction,
    getCheckIsSaleAgent,
    getGetDetailPropertyAndIsSaleAgent,
    propertyDetail,
    loadingDetailProperty,
    loadingDetailPropertyAndAgent,
    loadingIsSaleAgent,
  };
};

export {mapPropertyByIdForTransactionToData, useGetApiForConfirmProperty};
