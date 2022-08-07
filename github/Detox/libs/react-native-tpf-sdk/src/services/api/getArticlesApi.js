import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';
export const apiGetArticles = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-cms/services/app/CmsArticle/GetArticlesByCategory`,
    params
  );
};
export const apiGetArticleDetail = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-cms/services/app/CmsArticle/GetArticleForEdit`,
    params
  );
};
