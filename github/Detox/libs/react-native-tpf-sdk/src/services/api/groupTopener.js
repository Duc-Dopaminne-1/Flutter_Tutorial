import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';

export const apiGetGroupByTopener = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/GroupTopener/GetGroupByTopener`,
    params
  );
};

export const apiGetGroupForMember = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/GroupTopener/GetGroupForMember`,
    params
  );
};

export const apiGetListRequestOrMember = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/GroupTopener/GetListMemberInGroup`,
    params
  );
};

export const apiCreateMemberRequest = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/GroupTopener/CreateMemberRequest`,
    params
  );
};

export const apiGetMemberInfoDetail = memberId => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/GroupTopener/GetMemberInfoDetail?memberId=${memberId}`
  );
};

export const apiGetGroupById = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/GroupTopener/GetGroupById`,
    params
  );
};

export const apiProcessRequest = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/GroupTopener/ProcessMemberRequest`,
    params
  );
};

export const apiRemoveListMember = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/GroupTopener/ProcessListRequest`,
    params
  );
};
