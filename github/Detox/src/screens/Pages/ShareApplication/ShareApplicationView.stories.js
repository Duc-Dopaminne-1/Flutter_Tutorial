import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {ScrollView} from 'react-native';

import {configDecorator} from '../../../../storybook/utils/configDecorator';
import ShareApplicationView from './ShareApplicationView';

storiesOf('z|ShareApplicationView', module)
  .addDecorator(
    configDecorator({
      isCaptureScrollViewContent: true,
    }),
  ) //format
  .add('default', () => {
    return (
      <ScrollView>
        <ShareApplicationView {...props} />
      </ScrollView>
    );
  });

const props = {
  userInviteInfo: {
    __typename: 'GenerateInviteResponse',
    inviteCode: '0022337476',
    inviteLink: 'https://sandbox-citus.topenland.com/invitation/0022337476',
    totalInviteActive: 0,
  },
  userData: {
    isAgentLeader: false,
    initialAccountCode: null,
    preferPropertyTypes:
      '[{"id": "48cceac6-e202-494d-9b06-2374042f1044", "name": "villa", "description": "Biệt thự", "propertySubTypes": null}, {"id": "82cc71b0-704b-470c-bca8-5f967c0e11b7", "name": "land", "description": "Đất nền", "propertySubTypes": null}, {"id": "b2ba5130-faa5-458c-aba8-58c505ac59b9", "name": "house", "description": "Nhà phố", "propertySubTypes": null}, {"id": "2e2b0611-e1fc-4406-b13f-8afafff1c675", "name": "apartment", "description": "Căn hộ", "propertySubTypes": null}]',
    preferPropertyPriceFrom: 0,
    preferPropertyPriceTo: 50000000000,
    workingAreas:
      '[{"cityId": 1, "cityName": "Hồ Chí Minh", "districtId": 24, "districtName": "Thành phố Thủ Đức"}]',
    profilePhoto:
      'https://perstoresb.blob.core.windows.net/upload/1654253445114_143b87c97a68472ca4be4b98e69b7376.jpg',
    imageSizes:
      '[{"images": [{"url": "https://perstoresb.blob.core.windows.net/images/web_30x30_1654253445114_143b87c97a68472ca4be4b98e69b7376.jpg", "avatar": false}], "isActive": true, "itemName": "UserProfilePhoto", "platform": "web"}, {"images": [{"url": "https://perstoresb.blob.core.windows.net/images/web_100x100_1654253445114_143b87c97a68472ca4be4b98e69b7376.jpg", "avatar": false}], "isActive": true, "itemName": "UserProfilePhoto", "platform": "web"}, {"images": [{"url": "https://perstoresb.blob.core.windows.net/images/web_200x200_1654253445114_143b87c97a68472ca4be4b98e69b7376.jpg", "avatar": false}], "isActive": true, "itemName": "UserProfilePhoto", "platform": "web"}]',
    agentRankName: 'rank1',
    agentRankingDescription: 'Silver',
    agentGroupName: 'TopenLand',
    agentGroupDescription: 'TopenLand',
    updatedDatetime: 1654670344549,
    createdDatetime: 1644814431845,
    referralCode: null,
    contactAddress:
      '{"cityId": 1, "wardId": 258, "placeId": null, "cityName": "Hồ Chí Minh", "latitude": 10.8162933, "wardName": "Tân Thuận Đông", "longitude": 106.706451, "districtId": 19, "streetName": "200 Nguyen Van Linh", "homeAddress": null, "districtName": "Quận 7"}',
    nationalIdType: 'CCCD',
    nationalIdIssuePlace: 'TP.HCM',
    nationalIdIssueDate: 1643821200000,
    topenerServiceTypes: null,
    propertyAllocates: false,
    gender: 'NA',
    isVerifyProfilePhoto: false,
    isCompletedProfile: true,
    __typename: 'AgentDto',
  },
};
