import {GENDER_ARRAY, IDENTIFY_TYPE} from '../../../assets/constants';

export const nationalIdDefault = '00000000000';
const defaultNameCity = 'Hồ Chí Minh';
export const initialState = {
  name: '',
  middleLastName: '',
  mobilePhone: '',
  email: '',
  password: '',
  confirmPassword: '',
  dob: '',
  gender: GENDER_ARRAY[0].value,
  inviteCode: '',
  campaignCode: '',
  nationalIdType: IDENTIFY_TYPE[0].value,
  nationalId: nationalIdDefault,
  nationalIdIssueDate: '2000-01-01T00:00:00.000Z',
  nationalIdIssuePlace: defaultNameCity,
  permanentAddress: {
    city: {id: 1, name: defaultNameCity, checked: true},
    district: {id: 3, name: 'Bình Thạnh', checked: true},
    ward: {id: 40, name: 'Phường 26', checked: true},
    street: 'Richmond City, 207c Nguyễn Xí',
  },
  contactAddress: {city: {}, district: {}, ward: {}, street: ''},
  isSameAddress: true,
  workingAreas: [
    {
      city: {
        id: 4,
        name: 'Bình Dương',
      },
      district: {
        id: 66,
        name: 'Dĩ An',
      },
      id: 0,
    },
    {
      city: {
        id: 1,
        name: 'Hồ Chí Minh',
      },
      district: {
        id: 24,
        name: 'Thành phố Thủ Đức',
      },
      id: 1,
    },
    {
      city: {
        id: 25,
        name: 'Bình Định',
      },
      district: {
        id: 343,
        name: 'Quy Nhơn',
      },
      id: 2,
    },
  ],
  preferPropertyTypes: [
    {
      checked: true,
      description: 'Căn hộ',
      id: '2e2b0611-e1fc-4406-b13f-8afafff1c675',
      name: 'apartment',
    },
    {
      checked: true,
      description: 'Biệt thự',
      id: '48cceac6-e202-494d-9b06-2374042f1044',
      name: 'villa',
    },
    {
      checked: true,
      description: 'Nhà phố',
      id: 'b2ba5130-faa5-458c-aba8-58c505ac59b9',
      name: 'house',
    },
    {
      checked: true,
      description: 'Đất nền',
      id: '82cc71b0-704b-470c-bca8-5f967c0e11b7',
      name: 'land',
    },
  ],
  preferPropertyPriceFrom: 0,
  preferPropertyPriceTo: 50,
  isAgree: false,
};

export type State = typeof initialState;

export type InputViewsError = {
  step1: {
    name?: String,
    middleLastName?: String,
    email?: String,
    password?: String,
    confirmPassword?: String,
    dob?: String,
  },
  step2: {
    errArea?: String,
    errProperty?: String,
    errTeam?: String,
    errNationId?: String,
    errContactAddress?: String,
    errAddress?: String,
    errReferral?: String,
    errNationalIdIssueDate?: String,
    errNationalIdIssuePlace?: String,
    errNationalIdType?: String,
  },
};

export type InputViewsProps = {
  mobilePhone: String,
  inviteCodeLink: String,
  data: State,
  validates: InputViewsError,
  dispatch: () => {},
  setName: () => {},
  setMiddleLastName: () => {},
  setPassword: () => {},
  setDob: () => {},
  onChangeGender: () => {},
  setConfirmPassword: () => {},
  setInviteCode: () => {},
  setCampaignCode: () => {},
  onChangeIdentificationType: () => {},
  onIdTextChanged: () => {},
  nationalIdIssueDate: any,
  errNationalIdIssueDate: any,
  onChangeIdentifyDate: () => {},
  onChangeIdentifyPlace: () => {},
  setInviteCode: () => {},
  permanentAddress: {street: any},
  onAddressTextChanged: () => {},
  onContactAddressTextChanged: () => {},
  onCheckSameAddress: () => {},
  contactCities: [],
  workingAreas: [],
  errArea: any,
  onRemoveArea: () => {},
  preferPropertyPriceFrom: any,
  preferPropertyPriceTo: any,
  onPriceInterestedChanged: () => {},
  addressCities: [],
  areaCities: [],
};
