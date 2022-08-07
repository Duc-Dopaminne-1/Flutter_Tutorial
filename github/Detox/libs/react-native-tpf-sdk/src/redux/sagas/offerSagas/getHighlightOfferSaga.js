import { put } from 'redux-saga/effects';
import { getHighlightOfferFailure, getHighlightOfferSuccess } from '../../actions/offer';

export function* getHighlightOfferSaga(payload) {
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
              imageUrl: 'https://file.hstatic.net/1000184601/file/b.w-mobile_uddb.jpg',
              title: 'Hưng Thịnh hợp tác cùng Akachain',
              description:
                'Tập đoàn Hưng Thịnh đổi mới và xây dựng hoàn chỉnh hệ sinh thái bất động sản',
              time: '15:00 - 17:00 - 15/05/2020'
            },
            {
              id: 3,
              imageUrl: 'https://media3.scdn.vn/img3/2019/11_20/lvfMz8.png',
              title: 'Hưng Thịnh hợp tác cùng Akachain',
              description:
                'Tập đoàn Hưng Thịnh đổi mới và xây dựng hoàn chỉnh hệ sinh thái bất động sản',
              time: '15:00 - 17:00 - 15/05/2020'
            },
            {
              id: 4,
              imageUrl:
                'https://res.klook.com/image/upload/v1607413396/blog/ippgys9omrhemiy2jilb.jpg',
              title: 'Hưng Thịnh hợp tác cùng Akachain',
              description:
                'Tập đoàn Hưng Thịnh đổi mới và xây dựng hoàn chỉnh hệ sinh thái bất động sản',
              time: '15:00 - 17:00 - 15/05/2020'
            },
            {
              id: 5,
              imageUrl: 'https://nhakhoakim.com/wp-content/uploads/2020/02/Banner_CTKM-01-6.jpg',
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
        getHighlightOfferSuccess({
          items: data.data.result.items.slice(params.maxResultCount)
        })
      );
    } else {
      yield put(getHighlightOfferFailure(data));
    }
  } catch (error) {
    yield put(getHighlightOfferFailure(error));
  }
}
