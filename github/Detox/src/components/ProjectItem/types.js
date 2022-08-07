import {SearchProjectInfoDto} from '../../api/graphql/generated/graphql';
import {extractAddressData} from '../../utils/DataProcessUtil';
import {getProjectStatistic} from '../../utils/getProjectStatistic';

export const defaultProject = {
  isShowFollowButton: true,
  isTop: false,
  isShowFollower: true,
  projectPostId: 1,
  projectInfo: {
    projectId: 'projectId',
    projectName: 'RICHMOND CITY',
    bannerImage:
      'https://sandbox-citus.topenland.com/gateway/downloader/sale/H%C3%ACnh%20%E1%BA%A3nh%20%C4%91%E1%BA%A1i%20di%E1%BB%87n-32a87dc4-29b5-4e82-b58d-0beaff92ecd9.jpg',
    investorOwnerName: 'Công ty Cổ phần Cơ khí và Xây dựng Bình triệu (BTC) ',
    investorOwnerLogo:
      'https://sandbox-citus.topenland.com/gateway/downloader/sale/Logo-bb911de9-c6ad-484d-9175-56c5887047eb.png',
    projectStatusName: 'Sắp bán',
    address: '117 Lê Thị Hồng Phường 17 quận Gò Vấp, TP.HCM',
    totalViewer: 120,
    statusLabel: 'Có đặt chỗ ',
    deposit: 80,
    blankPosition: 30,
    isFollowed: true,
    countDownTime: 1604484000000,
    isShowStatus: true,
    minPrice: 1000000,
  },
  style: [],
};

export type ProjectProps = typeof defaultProject;

export const mapProjectUi = (data: SearchProjectInfoDto) => {
  const output: ProjectProps = {
    projectInfo: {
      projectId: data.projectId,
      bannerImage: data.featurePhotos,
      isFollowed: data.isFollowed,
      projectStatusId: data.projectStatusId,
      projectStatusName: data.projectStatusName,
      investorOwnerLogo: data.investorOwnerLogo,
      investorOwnerName: data.investorOwnerName,
      overallDescription: data?.overallDescription,
      startYear: data?.startYear,
      totalArea: data?.totalArea,
      projectName: data.projectName,
      projectAddress: extractAddressData(data.projectAddress),
      totalViewer: data.saleSeasonStatistic?.viewingCount ?? 0,
      minPrice: data.minPrice,
      ...getProjectStatistic(data),
    },
  };
  return output;
};
