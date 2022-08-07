import {SearchAgentInfoDto} from '../../api/graphql/generated/graphql';
import {getUserFullName} from '../../utils/UserAgentUtil';

export const defaultAgent = {
  agentInfo: {
    nameAgent: 'RICHMOND CITY',
    avatarAgent:
      'https://sandbox-citus.topenland.com/gateway/downloader/sale/H%C3%ACnh%20%E1%BA%A3nh%20%C4%91%E1%BA%A1i%20di%E1%BB%87n-32a87dc4-29b5-4e82-b58d-0beaff92ecd9.jpg',
    groupName: 'Công ty Cổ phần Cơ khí',
    rankAgent: 'Hạng vàng',
    numberPropertySell: 10,
    propertyInterested: ['Căn hộ', 'Nhà phố', 'Đất nền', 'Villa'],
    areaInterested: ['Căn hộ', 'Nhà phố', 'Đất nền', 'Villa'],
    rateNumber: 4,
    rankName: 'rank1',
    agentId: 1,
  },
};

export type AgentProps = typeof defaultAgent;

export function mapAgentItemsUi(data: SearchAgentInfoDto) {
  const agent: AgentProps = {
    agentInfo: {
      nameAgent: getUserFullName(data),
      avatarAgent: data.profilePhoto,
      groupName: data.agentGroupDescription,
      rankAgent: data.agentRankingDescription,
      propertyInterested: JSON.parse(data.preferPropertyTypes),
      areaInterested: JSON.parse(data.workingAreas),
      rateNumber: data.rating,
      rankName: data.agentRankingName || data.agentRankName,
      agentId: data.agentId,
      numberPropertySell: data?.sellingTotal || 0,
      latitude: data.latitude,
      longitude: data.longitude,
    },
  };
  return agent;
}
