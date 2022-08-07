import { put } from 'redux-saga/effects';
import { getOfferListFailure, getOfferListSuccess } from '../../actions/offer';

export function* getOfferListSaga(payload) {
  try {
    const params = { ...payload };
    // const data = yield call('', params);
    const data = {
      status: 200,
      data: {
        result: {
          totalCount: 5,
          items: [
            {
              id: 1,
              imageUrl:
                'https://www.b247.com.vn/wp-content/uploads/2019/11/kham-pha-bi-mat-ve-fintech-la-gi-danh-cho-nhung-ai-dang-tim-hieu-tai-day-01.jpg',
              title: 'Hưng Thịnh hợp tác cùng Akachain',
              description:
                'Tập đoàn Hưng Thịnh đổi mới và xây dựng hoàn chỉnh hệ sinh thái bất động sản',
              time: '15:00 - 17:00 - 15/05/2020'
            },
            {
              id: 2,
              imageUrl:
                'https://lh3.googleusercontent.com/proxy/GB5THwLQCWkHVuutU7aVb-t-ID5uZ7m6DLnkri-6MS7mN1HZESsXJvU2PX8MZQHcgMqxp5a5p34V6AKxQ_Tq25LSpMgWBoYOyjE9TupGSlhlK0X55wh03GUoZX4O2X6ceyg7',
              title: 'Hưng Thịnh hợp tác cùng Akachain',
              description:
                'Tập đoàn Hưng Thịnh đổi mới và xây dựng hoàn chỉnh hệ sinh thái bất động sản',
              time: '15:00 - 17:00 - 15/05/2020'
            },
            {
              id: 3,
              imageUrl: 'https://go.ocb.com.vn/upload/incentive/incentive_39.png',
              title: 'Hưng Thịnh hợp tác cùng Akachain',
              description:
                'Tập đoàn Hưng Thịnh đổi mới và xây dựng hoàn chỉnh hệ sinh thái bất động sản',
              time: '15:00 - 17:00 - 15/05/2020'
            },
            {
              id: 4,
              imageUrl:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9rEoLjrZhz84gVWZhZi56oWSXmfAm5yQHDw&usqp=CAU',
              title: 'Hưng Thịnh hợp tác cùng Akachain',
              description:
                'Tập đoàn Hưng Thịnh đổi mới và xây dựng hoàn chỉnh hệ sinh thái bất động sản',
              time: '15:00 - 17:00 - 15/05/2020'
            },
            {
              id: 5,
              imageUrl:
                'https://www.b247.com.vn/wp-content/uploads/2019/11/kham-pha-bi-mat-ve-fintech-la-gi-danh-cho-nhung-ai-dang-tim-hieu-tai-day-01.jpg',
              title: 'Hưng Thịnh hợp tác cùng Akachain',
              description:
                'Tập đoàn Hưng Thịnh đổi mới và xây dựng hoàn chỉnh hệ sinh thái bất động sản',
              time: '15:00 - 17:00 - 15/05/2020'
            },
            {
              id: 6,
              imageUrl:
                'https://stc.hnammobilecare.com/hcare/uploads/images/uu-dai-thang-10-blog-2.jpg',
              title: 'Hưng Thịnh hợp tác cùng Akachain',
              description:
                'Tập đoàn Hưng Thịnh đổi mới và xây dựng hoàn chỉnh hệ sinh thái bất động sản',
              time: '15:00 - 17:00 - 15/05/2020'
            },
            {
              id: 7,
              imageUrl:
                'https://mpos.vn/public/news/2f40fb7f-4b62-4ad8-996a-c29c28b0e527_MPOS-fastgo-800x500.png',
              title: 'Hưng Thịnh hợp tác cùng Akachain',
              description:
                'Tập đoàn Hưng Thịnh đổi mới và xây dựng hoàn chỉnh hệ sinh thái bất động sản',
              time: '15:00 - 17:00 - 15/05/2020'
            },
            {
              id: 8,
              imageUrl:
                'https://www.b247.com.vn/wp-content/uploads/2019/11/kham-pha-bi-mat-ve-fintech-la-gi-danh-cho-nhung-ai-dang-tim-hieu-tai-day-01.jpg',
              title: 'Hưng Thịnh hợp tác cùng Akachain',
              description:
                'Tập đoàn Hưng Thịnh đổi mới và xây dựng hoàn chỉnh hệ sinh thái bất động sản',
              time: '15:00 - 17:00 - 15/05/2020'
            },
            {
              id: 9,
              imageUrl:
                'https://mpos.vn/public/news/2f40fb7f-4b62-4ad8-996a-c29c28b0e527_MPOS-fastgo-800x500.png',
              title: 'Hưng Thịnh hợp tác cùng Akachain',
              description:
                'Tập đoàn Hưng Thịnh đổi mới và xây dựng hoàn chỉnh hệ sinh thái bất động sản',
              time: '15:00 - 17:00 - 15/05/2020'
            },
            {
              id: 10,
              imageUrl:
                'https://www.b247.com.vn/wp-content/uploads/2019/11/kham-pha-bi-mat-ve-fintech-la-gi-danh-cho-nhung-ai-dang-tim-hieu-tai-day-01.jpg',
              title: 'Hưng Thịnh hợp tác cùng Akachain',
              description:
                'Tập đoàn Hưng Thịnh đổi mới và xây dựng hoàn chỉnh hệ sinh thái bất động sản',
              time: '15:00 - 17:00 - 15/05/2020'
            }
          ]
        }
      }
    };

    if (data.status === 200) {
      yield put(
        getOfferListSuccess({
          items: data.data.result.items,
          totalCount: data.data.result.totalCount
        })
      );
    } else {
      yield put(getOfferListFailure(data));
    }
  } catch (error) {
    yield put(getOfferListFailure(error));
  }
}
