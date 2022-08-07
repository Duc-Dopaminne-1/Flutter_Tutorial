import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';

const propertySubTypeDescription = 'propertySubTypeDescription'; // loại căn
const floor = 'floor'; /// tầng
const direction = 'direction'; /// hướng
const numberOfBedrooms = 'numberOfBedrooms'; // số phòng ngủ
const numberOfBathrooms = 'numberOfBathrooms'; // số WC
const heartWallArea = 'heartWellArea'; // diện tích tim tường = buildingArea
const clearedArea = 'clearedArea'; // diện tích thông thuỷ = capetArea
const propertyTypeDescription = 'propertyTypeDescription';
const numberOfFloor = 'numberOfFloor'; // số tầng
const totalSiteArea = 'totalSiteArea'; // tổng diện tích sàn
const buildingArea = 'buildingArea'; // diện tích lô đất
const capetArea = 'capetArea'; // diện tích sử dụng
const buildingLine = 'buildingLine'; // lộ giới
const minimumPayment = 'minimumPayment'; // thanh toán tối thiểu
const length = 'length';
const width = 'width';
const floorOrSubAreaCode = 'floorOrSubAreaCode';
const tower = 'tower';
const TransactionContextType = {
  Nothing: 'Nothing',
  Booking: 'Booking',
  NewDeposit: 'NewDeposit',
  BookedDeposit: 'BookedDeposit',
  CannotDeposit: 'CannotDeposit',
  MoveDeposit: 'MoveDeposit',
};
const balconyDirection = 'balconyDirection'; // Hướng ban công

const INITIAL_CONFIRM_PROPERTY_DATA = {
  propertyType: '',
  propertyTypeDescription: '',
  propertyCode: '',
  projectId: '',
  floorOrSubAreaCode: '',
  images: [],
  length: '',
  width: '',
  price: '',
  priceNoVAT: '',
  commission: '',
  numberOfBooking: '',
  minimumPayment: '',
  postDescription: '',
  propertySubTypeDescription: '',
  floor: '',
  direction: '',
  numberOfBedrooms: '',
  numberOfBathrooms: '',
  heartWellArea: '',
  clearedArea: '',
  saleTrackingStatus: '',
  bookingFee: '',
  houseDesign: '',
  numberOfFloor: '',
  totalSiteArea: '',
  buildingArea: '',
  capetArea: '',
  buildingLine: '',
  contextType: TransactionContextType.Nothing,
  block: '',
  subArea: '',
  balconyDirection: '',
};

const TITLE_FIELDS = {
  postDescription: translate(STRINGS.PROPERTY_DESCRIPTION),
  propertySubTypeDescription: translate('project.confirmProperty.projectType'),
  floor: translate(STRINGS.FLOOR),
  direction: translate(STRINGS.HOUSE_DIRECTION),
  numberOfBedrooms: translate(STRINGS.NUMBER_OF_BEDROOM),
  numberOfBathrooms: translate(STRINGS.NUMBER_OF_WC),
  heartWellArea: translate(STRINGS.HEART_WALL_AREA),
  clearedArea: translate(STRINGS.CLEARED_AREA),
  saleTrackingStatus: translate(STRINGS.STATUS),
  bookingFee: translate(STRINGS.MONEY_BOOKING),
  houseDesign: translate(STRINGS.FORM_OF_HOUSE),
  numberOfFloor: translate(STRINGS.NUMBER_OF_FLOOR),
  totalSiteArea: translate(STRINGS.TOTAL_FLOOR_AREA),
  buildingArea: translate(STRINGS.PLOT_AREA),
  capetArea: translate(STRINGS.CARPET_AREA),
  buildingLine: translate(STRINGS.BOUNDARY_LINE_SHORTEN),
  price: translate('common.unitPrice'),
  minimumPayment: translate('minimumPayment'),
  length: translate('length'),
  width: translate('width'),
  propertyTypeDescription: translate('project.confirmProperty.projectType'),
  blockName: translate(STRINGS.BLOCK),
  floorOrSubAreaCode: translate(STRINGS.SUB_AREA),
  tower: translate(STRINGS.TOWER),
  balconyDirection: translate(STRINGS.BALCONY_DIRECTION),
};

const LIST_FIELDS = {
  apartment: [
    propertySubTypeDescription,
    tower,
    floor,
    direction,
    balconyDirection,
    numberOfBedrooms,
    numberOfBathrooms,
    clearedArea,
    heartWallArea,
    minimumPayment,
  ],
  villa: [
    propertyTypeDescription,
    floorOrSubAreaCode,
    numberOfFloor,
    numberOfBedrooms,
    numberOfBathrooms,
    direction,
    length,
    width,
    capetArea,
    totalSiteArea,
    buildingArea,
    buildingLine,
    minimumPayment,
  ],
  house: [
    propertyTypeDescription,
    floorOrSubAreaCode,
    numberOfFloor,
    numberOfBedrooms,
    numberOfBathrooms,
    direction,
    length,
    width,
    capetArea,
    totalSiteArea,
    buildingArea,
    buildingLine,
    minimumPayment,
  ],
  land: [
    propertyTypeDescription,
    floorOrSubAreaCode,
    length,
    width,
    buildingLine,
    buildingArea,
    direction,
    minimumPayment,
  ],
};

export {INITIAL_CONFIRM_PROPERTY_DATA, LIST_FIELDS, TITLE_FIELDS, TransactionContextType};
