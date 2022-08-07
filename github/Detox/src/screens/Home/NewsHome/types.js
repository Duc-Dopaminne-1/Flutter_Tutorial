import {ArticleDto} from '../../../api/graphql/generated/graphql';

export const defaultItemNews = {
  title: 'Quyết định dúng khi mua chung cư vẫn giữ được nhà đất',
  time: '5 giờ trước',
  bannerImage: null,
  isSmallStyle: true,
  articleType: 'Tin thị trường',
  onPress: () => {},
  customStyle: {},
};

export type NewsItem = typeof defaultItemNews;

export const defaultListNews = {listNews: [defaultItemNews]};

export type NewsProps = typeof defaultListNews;

export const mapAgentPropsUi = (data: ArticleDto) => {
  const newUi: NewsProps = {
    title: data.title,
    createdDatetime: data.createdDatetime,
    previewImageUrl: data.previewImageUrl,
    id: data.id,
    isSmallStyle: true,
    body: data.body,
    articleType: data?.articleType ?? '',
    slug: data?.slug ?? null,
  };
  return newUi;
};
