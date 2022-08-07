/* eslint-disable sonarjs/no-duplicate-string */
import {HOTLINE_NUMBER_FORMAT, SEARCH_TYPE_INDEX} from '../../../../assets/constants';
import {IMAGES} from '../../../../assets/images';
import ScreenIds from '../../../ScreenIds';
import {PageDataTypes} from './types';

export const TypeChatData = {
  plusService: 'PlusService',
  screen: 'Screen',
};

export const pageData: PageDataTypes = {
  chatDefault: {
    botIcon: IMAGES.IC_CHAT_ROBOT,
    botName: 'TopenLand',
    botChatOne: 'Bạn cần hỗ trợ gì?',
    userChatOne: 'Tôi cần ...',
    botChatTwo: 'Cảm ơn bạn đã liên hệ với TopenLand!',
    botChatThree: 'Chuyên viên hỗ trợ sẽ liên hệ với bạn. Hoặc gọi ngay 1900 8000 nhé!!! ',
    botChatFour1: 'Hoặc gọi Hotline',
    botChatFourHyperLink: HOTLINE_NUMBER_FORMAT,
    botChatFour2: ' để được hỗ trợ ngay.',
  },
  introData: [
    {
      title: 'Người bán',
      image: IMAGES.IC_SELLER_LINEAR,
      description:
        'Đăng tin dễ dàng, bán hàng nhanh chóng trên TopenLand thông qua kết nối cung cầu chuẩn xác, sử dụng các dịch vụ tích hợp hỗ trợ toàn diện xuyên suốt quá trình giao dịch.',
      chatData: [
        {
          servicesName: 'Định giá tài sản',
          type: TypeChatData.plusService,
          requestTypeId: 'd98ade1b-a88c-405a-a538-37325213419c',
          reply: {
            messagesUser: 'Tôi cần định giá tài sản',
            messagesBot: 'Bạn có thể tạo yêu cầu định giá BĐS tại đây',
            hyperlink: 'Dịch vụ thẩm định giá tài sản',
          },
        },
        {
          servicesName: 'Hướng dẫn bán với TopenLand',
          type: TypeChatData.screen,
          id: ScreenIds.TrainingDetailSceen,
          reply: {
            messagesUser: 'Tôi cần hướng dẫn bán với TopenLand',
            messagesBot: 'Bạn vui lòng tham khảo đăng tin tại đây',
            hyperlink: 'Hướng dẫn đăng tin',
          },
          params: {
            id: '211',
            slug: 'huong-dan-su-dung-nen-tang',
            title: 'Hướng dẫn bán với TopenLand',
          },
        },
        {
          servicesName: 'Thủ tục giao dịch BĐS',
          type: TypeChatData.screen,
          id: ScreenIds.TrainingDetailSceen,
          reply: {
            messagesUser: 'Tôi cần hướng dẫn Thủ tục giao dịch BĐS',
            messagesBot: 'Bạn vui lòng tham khảo các bước giao dịch tại đây',
            hyperlink: 'Hướng dẫn nhận liên hệ mua',
          },
          params: {
            id: '218',
            slug: 'huong-dan-su-dung-nen-tang',
            title: 'Thủ tục giao dịch BĐS',
          },
        },
        {
          servicesName: 'Tư vấn pháp lý',
          type: TypeChatData.plusService,
          requestTypeId: 'b620ba0d-149a-4846-a5ba-b7835f088bdf',
          reply: {
            messagesUser: 'Tôi cần tư vấn pháp lý',
            messagesBot: 'Bạn có thể tạo yêu cầu tư vấn tại đây',
            hyperlink: 'Dịch vụ Tư vấn pháp lý',
          },
        },
        {
          servicesName: 'Đội ngũ bán hàng',
          type: TypeChatData.screen,
          id: ScreenIds.Search,
          reply: {
            messagesUser: 'Tôi cần đội ngũ bán hàng',
            messagesBot: 'Bạn có thể tìm kiếm các chuyên gia tại TopenLand',
            hyperlink: 'Mua bán BĐS cùng chuyên gia',
          },
          params: {
            tabIndex: SEARCH_TYPE_INDEX.AGENT,
          },
        },
      ],
    },
    {
      title: 'Người mua',
      image: IMAGES.IC_BUYER_LINEAR,
      description:
        'Với hàng ngàn BĐS đăng bán mỗi ngày, tại TopenLand bạn sẽ dễ dàng tìm thấy các sản phẩm tin cậy phù hợp với nhu cầu của mình cùng nhiều chương trình ưu đãi hấp dẫn.',
      chatData: [
        {
          servicesName: 'Tìm kiếm BĐS',
          type: TypeChatData.screen,
          id: ScreenIds.Search,
          reply: {
            messagesUser: 'Tôi cần tìm bất động sản phù hợp',
            messagesBot: 'Bạn có thể tìm kiếm bất động sản phù hợp tại đây',
            hyperlink: 'Danh sách bất động sản bán',
          },
          params: {
            tabIndex: SEARCH_TYPE_INDEX.C2C,
          },
        },
        {
          servicesName: 'Hướng dẫn mua với TopenLand',
          type: TypeChatData.screen,
          id: ScreenIds.TrainingDetailSceen,
          reply: {
            messagesUser: 'Tôi cần hướng dẫn mua với TopenLand',
            messagesBot: 'Bạn vui lòng tham khảo các bước giao dịch tại đây',
            hyperlink: 'Hướng dẫn đặt chỗ dự án',
          },
          params: {
            id: '212',
            slug: 'huong-dan-su-dung-nen-tang',
            title: 'Hướng dẫn mua với TopenLand',
          },
        },
        {
          servicesName: 'Tìm kiếm dự án',
          type: TypeChatData.screen,
          id: ScreenIds.Search,
          reply: {
            messagesUser: 'Tôi cần tìm dự án phù hợp',
            messagesBot: 'Bạn có thể tìm kiếm Dự án phù hợp tại đây',
            hyperlink: 'Danh sách dự án',
          },
          params: {
            tabIndex: SEARCH_TYPE_INDEX.B2C,
          },
        },
        {
          servicesName: 'Thủ tục giao dịch BĐS',
          type: TypeChatData.screen,
          id: ScreenIds.TrainingDetailSceen,
          reply: {
            messagesUser: 'Tôi cần tìm hiểu thủ tục giao dịch BĐS',
            messagesBot: 'Bạn vui lòng tham khảo các bước giao dịch tại đây',
            hyperlink: 'Hướng dẫn gửi liên hệ mua ',
          },
          params: {
            id: '217',
            slug: 'huong-dan-su-dung-nen-tang',
            title: 'Thủ tục giao dịch BĐS',
          },
        },

        {
          servicesName: 'Kiểm tra quy hoạch',
          type: TypeChatData.screen,
          id: ScreenIds.Map360,
          reply: {
            messagesUser: 'Tôi cần kiểm tra quy hoạch',
            messagesBot: 'Bạn có thể tra cứu thông tin quy hoạch tại đây',
            hyperlink: 'Bản đồ quy hoạch',
          },
        },
        {
          servicesName: 'Xác định nhu cầu',
          type: TypeChatData.screen,
          id: ScreenIds.CreateGeneralRequestScreen,
          reply: {
            messagesUser: 'Tôi cần xác định nhu cầu',
            messagesBot: 'Để lại nhu cầu sản phẩm để được hỗ trợ nhé',
            hyperlink: 'Tạo yêu cầu',
          },
        },
      ],
    },
    {
      title: 'Cung cấp dịch vụ',
      image: IMAGES.IC_SERVICES_PROVIDER_LINEAR,
      description:
        'Trở thành đối tác của TopenLand để cung cấp một phần hay trọn gói các dịch vụ hỗ trợ xuyên suốt trước, trong và sau khi giao dịch bất động sản.',
      chatData: [
        {
          servicesName: 'Định giá tài sản',
          type: TypeChatData.plusService,
          requestTypeId: 'd98ade1b-a88c-405a-a538-37325213419c',
          reply: {
            messagesUser: 'Tôi cần hỗ trợ định giá tài sản',
            messagesBot: 'Bạn có thể tạo yêu hỗ trợ tại đây',
            hyperlink: 'Dịch vụ Thẩm định giá Bất động sản',
          },
        },
        {
          servicesName: 'Hỗ trợ công chứng',
          type: TypeChatData.plusService,
          requestTypeId: '3d610763-6890-45db-9d30-eb45a532a1e9',
          reply: {
            messagesUser: 'Tôi cần hỗ trợ công chứng',
            messagesBot: 'Bạn có thể tạo yêu hỗ trợ tại đây',
            hyperlink: 'Dịch vụ Công chứng',
          },
        },
        {
          servicesName: 'Tư vấn pháp lý',
          type: TypeChatData.plusService,
          requestTypeId: 'b620ba0d-149a-4846-a5ba-b7835f088bdf',
          reply: {
            messagesUser: 'Tôi cần hỗ trợ tư vấn pháp lý',
            messagesBot: 'Bạn có thể tạo yêu hỗ trợ tại đây',
            hyperlink: 'Dịch vụ Tư vấn pháp lý',
          },
        },
        {
          servicesName: 'Hỗ trợ tài chính BĐS',
          type: TypeChatData.plusService,
          requestTypeId: 'b09d47c9-91ac-48ea-9b11-66905e9d1622',
          reply: {
            messagesUser: 'Tôi cần hỗ trợ tài chính bất động sản',
            messagesBot: 'Bạn có thể tạo yêu hỗ trợ tại đây',
            hyperlink: 'Dịch vụ Tài chính Bất động sản',
          },
        },
        {
          servicesName: 'Tư vấn thủ tục BĐS',
          type: TypeChatData.plusService,
          requestTypeId: 'fb020586-5333-41eb-8e02-0e0cfe45df72',
          reply: {
            messagesUser: 'Tôi cần hỗ trợ thủ tục bất động sản',
            messagesBot: 'Bạn có thể tạo yêu hỗ trợ tại đây',
            hyperlink: 'Dịch vụ Tư vấn thủ tục Bất động sản',
          },
        },
        {
          servicesName: 'Thiết kế nội thất',
          type: TypeChatData.plusService,
          requestTypeId: '8c7cc817-8318-4ba7-bf65-e8540374e1c3',
          reply: {
            messagesUser: 'Tôi cần hỗ trợ thiết kế nội thất',
            messagesBot: 'Bạn có thể tạo yêu hỗ trợ tại đây',
            hyperlink: 'Dịch vụ Thiết kế nội thất',
          },
        },
      ],
    },
    {
      title: 'Người quan tâm',
      image: IMAGES.IC_INTERESTED_PERSON_LINEAR,
      description:
        'Tại TopenLand các dữ liệu, tin tức thị trường cập nhật liên tục cùng đa dạng khóa huấn luyện BĐS giúp tất cả mọi người có cơ hội bắt đầu sự nghiệp và thành công với BĐS.',
      chatData: [
        {
          servicesName: 'Hướng dẫn cho người Mua nhà lần đầu',
          type: TypeChatData.screen,
          id: ScreenIds.TrainingDetailSceen,
          reply: {
            messagesUser: 'Tôi cần xem hướng dẫn cho người mua nhà lần đầu',
            messagesBot: 'Bạn có thể xem hướng dẫn mua nhà lần đầu tại đây',
            hyperlink: 'Hướng dẫn cho người mua nhà lần đầu',
          },
          params: {
            id: '217',
            slug: 'kien-thuc',
            title: 'Hướng dẫn cho người Mua nhà lần đầu',
          },
        },
        {
          servicesName: 'Bí kíp mua',
          type: TypeChatData.screen,
          id: ScreenIds.TrainingDetailSceen,
          reply: {
            messagesUser: 'Tôi cần xem Bí kíp mua',
            messagesBot: 'Bạn có thể xem bí kíp mua tại đây',
            hyperlink: 'Bí kíp mua',
          },
          params: {
            slug: 'bi-kip-mua',
            title: 'Bí kíp mua',
          },
        },
        {
          servicesName: 'Pháp lý nhà ở riêng lẻ',
          type: TypeChatData.screen,
          id: ScreenIds.TrainingDetailSceen,
          reply: {
            messagesUser: 'Tôi cần xem các thủ tục pháp lý về nhà ở riêng lẻ',
            messagesBot: 'Bạn có thể xem pháp lý nhà ở riêng lẻ tại đây',
            hyperlink: 'Pháp lý nhà ở riêng lẻ',
          },
          params: {
            slug: 'phap-ly-nha-o-rieng-le',
            title: 'Pháp lý nhà ở riêng lẻ',
          },
        },
      ],
    },
  ],
};

export const slides = [
  {
    image: IMAGES.NGUOIBAN_MB,
    id: 0,
  },
  {
    image: IMAGES.NGUOIMUA_MB,
    id: 1,
  },
  {
    image: IMAGES.DICHVU_MB,
    id: 2,
  },
  {
    image: IMAGES.NGUOIQUANTAM_MB,
    id: 3,
  },
];
