import { call, put } from 'redux-saga/effects';
import SCREENS_NAME from '../../../constants/screens';
import { apiGetNewActionLink } from '../../../services/api/workflowApi';
import { getNewActionFailure, getNewActionSuccess } from '../../actions/workflow';

export function* getNewActionSaga(obj) {
  try {
    const { screenCode, flowCode, data } = obj.payload;

    const workflowData = yield call(apiGetNewActionLink, {
      screenCode,
      flowCode,
      data
    });

    // if (workflowData.status === 200) {
    //   yield put(getNewActionSuccess(workflowData.data.result));
    // } else {
    //   yield put(getNewActionFailure(workflowData.response));
    // }

    let dummyData;
    if (screenCode === 'InsuranceDetail' && flowCode === 'CreateInsurance') {
      dummyData = {
        status: 200,

        result: {
          screenCode: SCREENS_NAME.INSURANCE_PURCHASE_SCREEN,
          flowCode: 'CreateInsurance',
          isAutoGenCode: true,
          entityId: null,
          memberId: null,
          listComponent: [
            {
              groupId: 2,
              type: 'Group',
              name: 'Thông tin người mua',
              description: null,
              key: 'buyerInfo',
              eavAttribute: [
                {
                  entityDetailId: null,
                  attributeId: 20,
                  name: 'Họ và tên',
                  type: 'textinput',
                  value: '',
                  isRequired: true,
                  optionData: null,
                  addressData: null,
                  description: 'Nhập họ và tên người mua',
                  key: 'name',
                  validation: null
                },
                {
                  entityDetailId: null,
                  attributeId: 21,
                  name: 'CMND/CCCD',
                  type: 'textinput',
                  value: '',
                  isRequired: true,
                  optionData: null,
                  addressData: null,
                  description: 'Nhập CMND/CCCD',
                  key: 'idNumber',
                  validation: 'ID'
                },
                {
                  entityDetailId: null,
                  attributeId: 22,
                  name: 'Số điện thoại',
                  type: 'textinput',
                  value: null,
                  isRequired: true,
                  optionData: null,
                  addressData: null,
                  description: 'Nhập số điện thoại',
                  key: 'phoneNumber',
                  validation: 'phone'
                },
                {
                  entityDetailId: null,
                  attributeId: 23,
                  name: 'Email',
                  type: 'textinput',
                  value: '',
                  isRequired: true,
                  optionData: null,
                  addressData: null,
                  description: 'Nhập email',
                  key: 'email',
                  validation: 'email'
                },
                {
                  entityDetailId: null,
                  attributeId: 24,
                  name: 'Quan hệ với người thụ hưởng',
                  type: 'select',
                  value: '',
                  isRequired: true,
                  optionData: [
                    {
                      name: 'Cha',
                      value: 21
                    },
                    {
                      name: 'Mẹ',
                      value: 22
                    },
                    {
                      name: 'Anh trai',
                      value: 23
                    },
                    {
                      name: 'Chị gái',
                      value: 23
                    },
                    {
                      name: 'Em trai',
                      value: 23
                    },
                    {
                      name: 'Em gái',
                      value: 23
                    }
                  ],
                  addressData: null,
                  description: null,
                  key: 'relationship',
                  validation: null
                },
                {
                  entityDetailId: null,
                  attributeId: 25,
                  name: 'Địa chỉ hiện tại',
                  type: 'address',
                  value: null,
                  isRequired: false,
                  optionData: null,
                  addressData: {
                    addressTypeId: 48,
                    addressDetail: [
                      {
                        code: 'Province',
                        name: 'Thành phố/Tỉnh',
                        value: ''
                      },
                      {
                        code: 'District',
                        name: 'Quận/Huyện',
                        value: ''
                      },
                      {
                        code: 'Ward',
                        name: 'Phường/Xã',
                        value: ''
                      },
                      {
                        code: 'AddressDetail',
                        name: 'Địa chỉ',
                        value: ''
                      }
                    ]
                  },
                  description: null,
                  key: 'address',
                  validation: null
                }
              ]
            },
            {
              groupId: 1,
              type: 'Group',
              name: 'Thông tin đối tượng thụ hưởng',
              description: null,
              key: 'beneficiaryInfo',
              eavAttribute: [
                {
                  entityDetailId: null,
                  attributeId: 10,
                  name: 'Họ và tên',
                  type: 'textinput',
                  value: '',
                  isRequired: true,
                  optionData: null,
                  addressData: null,
                  description: 'Nhập họ và tên người thụ hưởng',
                  key: 'name',
                  validation: null
                },
                {
                  entityDetailId: null,
                  attributeId: 11,
                  name: 'CMND/CCCD',
                  type: 'textinput',
                  value: '',
                  isRequired: true,
                  optionData: null,
                  addressData: null,
                  description: 'Nhập CMND/CCCD',
                  key: 'idNumber',
                  validation: 'ID'
                },
                {
                  entityDetailId: null,
                  attributeId: 14,
                  name: 'Giới tính',
                  type: 'select',
                  value: '',
                  isRequired: true,
                  optionData: [
                    {
                      name: 'Nam',
                      value: 141
                    },
                    {
                      name: 'Nữ',
                      value: 142
                    },
                    {
                      name: 'Khác',
                      value: 143
                    }
                  ],
                  addressData: null,
                  description: 'Chọn giới tính',
                  key: 'gender',
                  validation: null
                },
                {
                  entityDetailId: null,
                  attributeId: 19,
                  name: 'Ngày sinh',
                  type: 'datetime',
                  value: null,
                  isRequired: true,
                  optionData: null,
                  addressData: null,
                  description: 'Chọn ngày sinh',
                  key: 'dob',
                  validation: null
                },
                {
                  entityDetailId: null,
                  attributeId: 12,
                  name: 'Số điện thoại',
                  type: 'textinput',
                  value: null,
                  isRequired: true,
                  optionData: null,
                  addressData: null,
                  description: 'Nhập số điện thoại',
                  key: 'phoneNumber',
                  validation: 'phone'
                },
                {
                  entityDetailId: null,
                  attributeId: 13,
                  name: 'Email',
                  type: 'textinput',
                  value: '',
                  isRequired: true,
                  optionData: null,
                  addressData: null,
                  description: 'Nhập email',
                  key: 'email',
                  validation: 'email'
                }
              ]
            },
            {
              groupId: 3,
              type: 'files',
              name: 'Tài liệu đính kèm',
              description: null,
              key: 'attachedFiles',
              allowAddMore: true,
              moreTitle: 'Thêm hồ sơ',
              eavAttribute: [
                {
                  entityDetailId: null,
                  attributeId: 30,
                  name: 'Hồ sơ yêu cầu 1',
                  type: 'file',
                  value: null,
                  isRequired: false,
                  optionData: null,
                  addressData: null,
                  description: null,
                  key: 'file1',
                  validation: null
                },
                {
                  entityDetailId: null,
                  attributeId: 31,
                  name: 'Hồ sơ yêu cầu 2',
                  type: 'file',
                  value: null,
                  isRequired: false,
                  optionData: null,
                  addressData: null,
                  description: null,
                  key: 'file2',
                  validation: null
                }
              ]
            },
            {
              groupId: 5,
              type: 'Group',
              name: 'Thông tin hiệu lực sản phẩm',
              description: null,
              key: 'effectiveDate',
              eavAttribute: [
                {
                  entityDetailId: null,
                  attributeId: 450,
                  name: 'Hiệu lực từ',
                  type: 'datetime',
                  value: null,
                  isRequired: true,
                  optionData: null,
                  addressData: null,
                  description: 'Chọn ngày hiệu lực',
                  key: 'effectiveDate',
                  validation: null
                }
              ]
            },
            {
              groupId: 4,
              type: 'Group',
              name: 'Thông tin xuất hóa đơn',
              description: null,
              key: 'billInfo',
              eavAttribute: [
                {
                  entityDetailId: null,
                  attributeId: 40,
                  name: 'Tên công ty',
                  type: 'textinput',
                  value: 'FPT Software',
                  isRequired: true,
                  optionData: null,
                  addressData: null,
                  description: null,
                  key: 'company',
                  validation: null
                },
                {
                  entityDetailId: null,
                  attributeId: 41,
                  name: 'Mã số thuế',
                  type: 'textinput',
                  value: '000011',
                  isRequired: true,
                  optionData: null,
                  addressData: null,
                  description: null,
                  key: 'taxNumber',
                  validation: 'number'
                },
                {
                  entityDetailId: null,
                  attributeId: 42,
                  name: 'Địa chỉ công ty',
                  type: 'textinput',
                  value: 'FPT Software, Quận 9, TP. HCM',
                  isRequired: true,
                  optionData: null,
                  addressData: null,
                  description: null,
                  key: 'companyAddress',
                  validation: 'phone'
                },
                {
                  entityDetailId: null,
                  attributeId: 43,
                  name: 'Email',
                  type: 'textinput',
                  value: 'htanh.design@gmail.com',
                  isRequired: true,
                  optionData: null,
                  addressData: null,
                  description: null,
                  key: 'email',
                  validation: 'email'
                }
              ]
            }
          ]
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      };
    }

    if (screenCode === 'InsurancePurchaseScreen' && flowCode === 'CreateInsurance') {
      dummyData = {
        status: 200,
        result: {
          screenCode: SCREENS_NAME.INSURANCE_CONFIRM_INFO_SCREEN,
          flowCode: 'Create Insurance',
          isAutoGenCode: true,
          listComponent: [
            {
              type: 'form',
              name: 'Thông tin người mua',
              key: 'buyerInfo',
              validation: null,
              placeholder: 'Nhập họ và tên người mua',
              data: null,
              value: [
                {
                  type: 'text',
                  name: 'Họ và tên',
                  key: 'name',
                  validation: 'default',
                  placeholder: 'Nhập họ và tên người mua',
                  data: null,
                  value: 'Nguyễn Cường Phát'
                },
                {
                  type: 'text',
                  name: 'Ngày sinh',
                  key: 'dob',
                  validation: null,
                  placeholder: 'Chọn ngày sinh',
                  data: null,
                  value: '1997-12-12'
                },
                {
                  type: 'text',
                  name: 'CMND/CCCD',
                  key: 'idNumber',
                  validation: 'id',
                  placeholder: 'Nhập CMND/CCCD',
                  data: null,
                  value: '123456789'
                },
                {
                  type: 'text',
                  name: 'Số điện thoại',
                  key: 'phoneNumber',
                  validation: 'phone',
                  placeholder: 'Nhập số điện thoại',
                  data: null,
                  value: '0396616552'
                },
                {
                  type: 'text',
                  name: 'Email',
                  key: 'email',
                  validation: 'email',
                  placeholder: 'Nhập email',
                  data: null,
                  value: 'phatnc@gmail.com'
                },
                {
                  type: 'text',
                  name: 'Quan hệ với người thụ hưởng',
                  key: 'relationship',
                  validation: null,
                  placeholder: 'Chọn quan hệ',
                  value: 'Anh trai',
                  data: ['Cha', 'Mẹ', 'Anh trai', 'Chị gái', 'Em trai', 'Em gái']
                }
              ]
            },
            {
              type: 'form',
              name: 'Thông tin đối tượng thụ hưởng',
              key: 'beneficiaryInfo',
              validation: null,
              placeholder: 'Nhập họ và tên người mua',
              data: null,
              value: [
                {
                  type: 'text',
                  name: 'Họ và tên',
                  key: 'name',
                  validation: 'default',
                  placeholder: 'Nhập họ và tên người thụ hưởng',
                  data: null,
                  value: 'Nguyễn Trần Gia Huy'
                },
                {
                  type: 'text',
                  name: 'CMND/CCCD',
                  key: 'idNumber',
                  validation: 'id',
                  placeholder: 'Nhập CMND/CCCD',
                  data: null,
                  value: '987654321'
                },
                {
                  type: 'text',
                  name: 'Giới tính',
                  key: 'relationship',
                  validation: null,
                  placeholder: 'Chọn giới tính',
                  data: ['Nam', 'Nữ'],
                  value: '987654321'
                },
                {
                  type: 'text',
                  name: 'Ngày sinh',
                  key: 'dob',
                  validation: null,
                  placeholder: 'Chọn ngày sinh',
                  data: null,
                  value: '2000-12-12'
                },
                {
                  type: 'text',
                  name: 'Số điện thoại',
                  key: 'phoneNumber',
                  validation: 'phone',
                  placeholder: 'Nhập số điện thoại',
                  data: null,
                  value: '0123456789'
                },
                {
                  type: 'text',
                  name: 'Email',
                  key: 'email',
                  validation: 'email',
                  placeholder: 'Nhập email',
                  data: null,
                  value: 'huyntg@gmail.com'
                }
              ]
            },
            {
              type: 'groupbutton',
              name: null,
              key: 'groupbutton',
              validation: null,
              placeholder: 'Nhập email',
              data: null,
              value: [
                {
                  type: 'button',
                  name: 'Quay lại',
                  key: 'backButton',
                  validation: null,
                  placeholder: null,
                  data: null,
                  value: 'back'
                },
                {
                  type: 'button',
                  name: 'Tiếp tục',
                  key: 'submitButton',
                  validation: null,
                  placeholder: null,
                  data: SCREENS_NAME.INSURANCE_ORDER_INFO_PURCHASE_SCREEN,
                  value: 'submit'
                }
              ]
            }
          ]
        }
      };
    }

    if (
      screenCode === SCREENS_NAME.INSURANCE_CONFIRM_INFO_SCREEN &&
      flowCode === 'CreateInsurance'
    ) {
      dummyData = {
        status: 200,
        result: {
          screenCode: SCREENS_NAME.INSURANCE_ORDER_INFO_PURCHASE_SCREEN,
          flowCode: 'Create Insurance',
          isAutoGenCode: true,
          listComponent: [
            {
              type: 'form',
              name: 'Thông tin đơn hàng',
              key: 'orderInfo',
              validation: null,
              placeholder: null,
              data: null,
              value: [
                {
                  type: 'text',
                  name: 'Tên sản phẩm',
                  key: 'productName',
                  validation: 'default',
                  placeholder: null,
                  data: null,
                  value: 'Bảo An Khang'
                },
                {
                  type: 'text',
                  name: 'Nhà cung cấp',
                  key: 'provideName',
                  validation: null,
                  placeholder: null,
                  data: null,
                  value: 'Bảo hiểm bưu điện PTI'
                },
                {
                  type: 'text',
                  name: 'Gói sản phẩm',
                  key: 'productType',
                  validation: null,
                  placeholder: null,
                  data: null,
                  value: 'Gói cơ bản'
                },
                {
                  type: 'text',
                  name: 'Hiệu lực từ',
                  key: 'startDate',
                  validation: null,
                  placeholder: null,
                  data: null,
                  value: '2021-05-12'
                },
                {
                  type: 'text',
                  name: 'Tổng phí bảo hiểm',
                  key: 'fee',
                  validation: null,
                  placeholder: null,
                  data: null,
                  value: '10.000.000đ'
                },
                {
                  type: 'text',
                  name: 'Số tiền cần thanh toán',
                  key: 'totalAmount',
                  validation: null,
                  placeholder: null,
                  value: '8.400đ',
                  data: null
                }
              ]
            },
            {
              type: 'groupbutton',
              name: null,
              key: 'groupbutton',
              validation: null,
              placeholder: 'Nhập email',
              data: null,
              value: [
                {
                  type: 'button',
                  name: 'Quay lại',
                  key: 'backButton',
                  validation: null,
                  placeholder: null,
                  data: null,
                  value: 'back'
                },
                {
                  type: 'button',
                  name: 'Thanh toán',
                  key: 'submitButton',
                  validation: null,
                  placeholder: null,
                  data: SCREENS_NAME.INSURANCE_ORDER_INFO_PURCHASE_SCREEN,
                  value: 'submit'
                }
              ]
            }
          ]
        }
      };
    }

    if (
      screenCode === SCREENS_NAME.INSURANCE_ORDER_INFO_PURCHASE_SCREEN &&
      flowCode === 'CreateInsurance'
    ) {
      dummyData = {
        status: 200,
        result: {
          screenCode: SCREENS_NAME.PAYMENT_RESULT_SCREEN,
          flowCode: 'Create Insurance',
          isAutoGenCode: true,
          listComponent: [
            {
              type: 'form',
              name: 'Thông tin đơn hàng',
              key: 'orderInfo',
              validation: null,
              placeholder: null,
              data: null,
              value: [
                {
                  type: 'text',
                  name: 'Mã đơn hàng',
                  key: 'orderCode',
                  validation: 'default',
                  placeholder: null,
                  data: null,
                  value: '0000111'
                },
                {
                  type: 'text',
                  name: 'Tên sản phẩm',
                  key: 'productName',
                  validation: null,
                  placeholder: null,
                  data: null,
                  value: 'Bảo An Khang'
                },
                {
                  type: 'text',
                  name: 'Giá trị thanh toán',
                  key: 'totalAmount',
                  validation: null,
                  placeholder: null,
                  data: null,
                  value: '8.400đ'
                },
                {
                  type: 'text',
                  name: 'Họ và tên người mua',
                  key: 'orderCode',
                  validation: 'default',
                  placeholder: null,
                  data: null,
                  value: 'Nguyễn Cường Phát'
                }
              ]
            }
          ]
        }
      };
    }

    // const workflowData = yield call(apiGetNewActionLink, params);
    if (dummyData.status === 200) {
      yield put(getNewActionSuccess(dummyData.result));
    } else {
      yield put(getNewActionFailure({}));
    }
  } catch (error) {
    yield put(getNewActionFailure(error));
  }
}
