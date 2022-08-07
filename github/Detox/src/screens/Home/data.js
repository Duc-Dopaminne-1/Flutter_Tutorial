import {IMAGES} from '../../assets/images';
import {COLORS} from '../../assets/theme/colors';

const Data = {
  IncommingEventData: [
    {
      image:
        'https://perstoresb.blob.core.windows.net/topenland-newui/app/home/banner-4-816x459.jpg',
    },
    {
      image:
        'https://perstoresb.blob.core.windows.net/topenland-newui/app/home/banner-5-816x459.jpg',
    },
    {
      image:
        'https://perstoresb.blob.core.windows.net/topenland-newui/app/home/banner-6-816x459.jpg',
    },
  ],

  FourStepHome: [
    {
      id: 1,
      stepNumber: 'Bước 1',
      stepContent: 'Đăng ký/Đăng nhập',
      icon: IMAGES.IC_HOME_STEP_USER,
      iconBackgroundColor: COLORS.ORANGE_33,
    },
    {
      id: 2,
      stepNumber: 'Bước 2',
      stepContent: 'Tìm kiếm bất động sản',
      icon: IMAGES.IC_HOME_STEP_SEARCH,
      iconBackgroundColor: COLORS.GREEN_DARK,
    },
    {
      id: 3,
      stepNumber: 'Bước 3',
      stepContent: 'Chọn sản phẩm ưng ý',
      icon: IMAGES.IC_HOME_STEP_CHOOSE,
      iconBackgroundColor: COLORS.BLUE_CA,
    },
    {
      id: 4,
      stepNumber: 'Bước 4',
      stepContent: 'Đặt chỗ và xác nhận thông tin',
      icon: IMAGES.IC_HOME_STEP_ATM,
      iconBackgroundColor: COLORS.RED_3D,
    },
    {
      id: 5,
      stepNumber: 'Bước 5',
      stepContent: 'Hoàn tất mua nhà',
      icon: IMAGES.IC_HOME_STEP_CHECK,
      iconBackgroundColor: COLORS.GREEN_94,
    },
  ],

  TextSignUp:
    'Kinh doanh Bất động sản chưa bao giờ dễ dàng hơn thế! Quý khách đã sẵn sàng trở thành Topener?',
};

export default Data;
