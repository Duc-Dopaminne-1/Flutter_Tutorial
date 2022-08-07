import isEmpty from 'lodash/isEmpty';

import {APPROVAL_STATUS} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import logService from '../../service/logService';
import JsonDataUtils from '../../utils/JsonDataUtils';

export const generateYourSaleItemsString = (summaryPropertyPosts, isAgent = false) => {
  let post = 0;
  let follow = 0;
  let project = 0;
  try {
    if (summaryPropertyPosts) {
      const {propertyPostInfoByApproveStatus} = summaryPropertyPosts;
      const {postFollowC2CCount, projectFollowCount, postApprovalStatusList, saleProject} =
        JsonDataUtils.parseJSONObject(propertyPostInfoByApproveStatus);
      if (!isEmpty(postApprovalStatusList)) {
        const approval = postApprovalStatusList.find(
          it => it.approvalStatus?.toLowerCase() === APPROVAL_STATUS.APPROVAL,
        );
        post = approval?.count ?? 0;
      }
      follow = (postFollowC2CCount?.count ?? 0) + (projectFollowCount?.count ?? 0);
      project = saleProject?.count ?? 0;
    }
  } catch (err) {
    logService.log(err);
  }
  if (isAgent) {
    return translate(STRINGS.AGENT_WAREHOUSE_DESCRIPTION, {
      project,
      follow,
      post,
    });
  } else {
    return translate(STRINGS.MEMBER_WAREHOUSE_DESCRIPTION, {
      follow,
      post,
    });
  }
};
