import { UserState, UserActionType, UserAction } from '@/redux/user/index';

export interface UserInit {
  user: UserState;
}

const initialState: UserState = {
  data: {
    id: '',
    avatarId: -1,
    phoneNumber: '',
    email: '',
    token: null,
    status: '',
    firstName: '',
    lastName: '',
    hideAge: false,
    dateOfBirth: '',
    genderId: 1,
    payoutMethodId: null,
    thumbnailId: null,
    likes: 0,
    languageId: null,
    paymentMethodId: 0,
    gender: {
      id: 1,
      name: '',
      code: 1,
      slug: '',
    },
    city: {
      id: 0,
      name: '',
      address: '',
      lng: 0,
      lat: 0,
    },
    avatar: null,
    photos: [
      {
        id: 0,
        url: '',
        key: '',
        contentType: '',
        size: 0,
        type: '',
        order: 0,
        isVerified: false,
        createdAt: null,
        updateAt: null,
        deletedAt: null,
      },
    ],
    authProviders: [
      {
        id: '',
        type: '',
        email: '',
        userId: '',
      },
    ],
    paymentMethod: {
      id: 0,
      type: '',
      token: '',
      globalId: '',
      userId: '',
      cardType: '',
      expirationMonth: '',
      expirationYear: '',
      expirationDate: '',
      last4: '',
      uniqueNumberIdentifier: '',
      sourceDescription: null,
      username: null,
      venmoUserId: null,
      email: null,
      payerId: null,
    },
    sexualOrientations: [],
    isShowSexual: true,

    school: null,

    appLanguage: '',
    languages: [],

    instagramUsername: '',

    description: '',
    job: {
      id: 0,
      name: '',
      createdAt: '',
      updatedAt: '',
      deletedAt: '',
    },
    strengths: [],
    interests: [],
    categories: [],
    company: {
      id: 0,
      name: '',
      createdAt: '',
      updatedAt: '',
      deletedAt: '',
    },

    auctions: [],

    pauses: null,

    showMeIds: [],
    showMeNames: [],
  },
};

const reducer = (state: UserState = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case UserActionType.SAVE_USER:
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    case UserActionType.CREATE_PHOTO:
      return {
        ...state,
      };
    case UserActionType.LOG_OUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
