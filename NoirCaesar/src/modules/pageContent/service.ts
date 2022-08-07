import { api } from '@goldfishcode/noir-caesar-api-sdk';
import { PageTypeListEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/page_content';

export const getPageContent = async (page_type: PageTypeListEnum) => {
  try {
    const response = await api.PageContent.get(page_type);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
