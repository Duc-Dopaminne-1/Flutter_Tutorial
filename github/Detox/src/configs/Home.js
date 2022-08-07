import {IMAGES} from '../assets/images';

const PLUS_SERVICES_BEFORE_BUYING = [
  {
    icon: IMAGES.IC_VAS_13,
    id: 'ConsultCost',
    isLoanService: false,
    name: 'Định giá bất động sản',
    requestTypeId: 'd98ade1b-a88c-405a-a538-37325213419c',
  },
  {
    icon: IMAGES.IC_VAS_8,
    id: 'ConsultLegal',
    isLoanService: false,
    name: 'Hỗ trợ pháp lý',
    requestTypeId: 'b620ba0d-149a-4846-a5ba-b7835f088bdf',
  },
];

const PLUS_SERVICES_WHILE_BUYING = [
  {
    header: 'Tài chính bất động sản',
    icon: IMAGES.IC_VAS_9,
    id: 'ConsultFinance',
    isLoanService: false,
    name: 'Tài chính bất động sản',
    requestTypeId: 'b09d47c9-91ac-48ea-9b11-66905e9d1622',
  },
  {
    icon: IMAGES.IC_VAS_10,
    id: 'Notarization',
    isLoanService: false,
    name: 'Thủ tục công chứng',
    requestTypeId: '3d610763-6890-45db-9d30-eb45a532a1e9',
  },
];

const PLUS_SERVICES_AFTER_BUYING = [
  {
    icon: IMAGES.IC_VAS_11,
    id: 'ConsultLegal',
    isLoanService: false,
    name: 'Tư vấn thủ tục bất động sản',
    requestTypeId: 'fb020586-5333-41eb-8e02-0e0cfe45df72',
  },
  {
    icon: IMAGES.IC_VAS_12,
    id: 'Certification',
    isLoanService: false,
    name: 'Thiết kế & thi công nội thất',
    requestTypeId: '8c7cc817-8318-4ba7-bf65-e8540374e1c3',
  },
  {
    icon: IMAGES.IC_VAS_14,
    id: 'Certification',
    isLoanService: false,
    name: 'Bảo hiểm',
    requestTypeId: 'c1b41352-af25-44ba-886c-d557d0b59e4e',
  },
];

export {PLUS_SERVICES_AFTER_BUYING, PLUS_SERVICES_BEFORE_BUYING, PLUS_SERVICES_WHILE_BUYING};
