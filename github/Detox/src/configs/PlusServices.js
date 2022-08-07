import {IMAGES} from '../assets/images';

export const TPF_PLUS_SERVICES = [
  {
    requestTypeId: 'd98ade1b-a88c-405a-a538-37325213419c',
    requestTypeName: 'ConsultCost',
    requestTypeDescription: 'Thẩm định giá BĐS',
    tpf: {
      triggerCode: 'tham_dinh_gia',
      data: {},
    },
  },
  {
    requestTypeId: 'b620ba0d-149a-4846-a5ba-b7835f088bdf',
    requestTypeName: 'ConsultLegal',
    requestTypeDescription: 'Tư vấn pháp lý BĐS',
    tpf: {
      triggerCode: 'phap_ly',
      data: {},
    },
  },
  {
    requestTypeId: 'b09d47c9-91ac-48ea-9b11-66905e9d1622',
    requestTypeName: 'ConsultFinance',
    requestTypeDescription: 'Tài chính BĐS',
    tpf: {
      triggerCode: 'tin_dung',
      data: {},
    },
  },
  {
    requestTypeId: '3d610763-6890-45db-9d30-eb45a532a1e9',
    requestTypeName: 'Notarization',
    requestTypeDescription: 'Hỗ trợ công chứng',
    tpf: {
      triggerCode: 'cong_chung',
      data: {},
    },
  },
  {
    requestTypeId: 'fb020586-5333-41eb-8e02-0e0cfe45df72',
    requestTypeName: 'ConsultProcedure',
    requestTypeDescription: 'Tư vấn thủ tục BĐS',
    tpf: {
      triggerCode: 'thu_tuc_bds',
      data: {},
    },
  },
  {
    requestTypeId: 'c1b41352-af25-44ba-886c-d557d0b59e4e',
    requestTypeName: 'Insurance',
    requestTypeDescription: 'Bảo hiểm',
    tpf: {
      triggerCode: 'bao_hiem',
      data: {},
    },
  },
  {
    requestTypeId: 'ae04a607-6787-438b-a16a-01d2a6b63c2d',
    requestTypeName: 'AnotherServices',
    requestTypeDescription: 'Dịch vụ theo yêu cầu',
    tpf: {
      triggerCode: 'dich_vu_khac',
      data: {},
    },
  },
  {
    requestTypeName: 'Certification',
    requestTypeDescription: 'Thiết kế & thi công nội thất',
    requestTypeId: '8c7cc817-8318-4ba7-bf65-e8540374e1c3',
    tpf: {
      triggerCode: 'noi_that',
      data: {},
    },
  },
];

export const PLUS_SERVICES = [
  {
    requestTypeId: 'b09d47c9-91ac-48ea-9b11-66905e9d1622',
    requestTypeName: 'ConsultFinance',
    requestTypeDescription: 'Tài chính BĐS',
    icon: IMAGES.IC_VAS_9,
  },
  {
    requestTypeId: 'd98ade1b-a88c-405a-a538-37325213419c',
    requestTypeName: 'ConsultCost',
    requestTypeDescription: 'Thẩm định giá BĐS',
    icon: IMAGES.IC_VAS_13,
  },
  {
    requestTypeId: '3d610763-6890-45db-9d30-eb45a532a1e9',
    requestTypeName: 'Notarization',
    requestTypeDescription: 'Hỗ trợ công chứng',
    icon: IMAGES.IC_VAS_10,
  },
  {
    requestTypeId: 'c1b41352-af25-44ba-886c-d557d0b59e4e',
    requestTypeName: 'Insurance',
    requestTypeDescription: 'Bảo hiểm',
    icon: IMAGES.IC_VAS_14,
  },
  {
    requestTypeId: 'b620ba0d-149a-4846-a5ba-b7835f088bdf',
    requestTypeName: 'ConsultLegal',
    requestTypeDescription: 'Tư vấn pháp lý BĐS',
    icon: IMAGES.IC_VAS_8,
  },
  {
    requestTypeId: 'fb020586-5333-41eb-8e02-0e0cfe45df72',
    requestTypeName: 'ConsultProcedure',
    requestTypeDescription: 'Tư vấn thủ tục BĐS',
    icon: IMAGES.IC_VAS_11,
  },
  {
    requestTypeId: '8c7cc817-8318-4ba7-bf65-e8540374e1c3',
    requestTypeName: 'ConsultingInterior',
    requestTypeDescription: 'Tư vấn thiết kế & thi công nội thất',
    icon: IMAGES.IC_VAS_12,
  },
  {
    requestTypeId: 'ae04a607-6787-438b-a16a-01d2a6b63c2d',
    requestTypeName: 'AnotherServices',
    requestTypeDescription: 'Dịch vụ theo yêu cầu',
    icon: IMAGES.IC_VAS_7,
  },
];
