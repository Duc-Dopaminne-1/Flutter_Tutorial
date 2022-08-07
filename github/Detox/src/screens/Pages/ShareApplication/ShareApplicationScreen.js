/* eslint-disable sonarjs/no-identical-functions */
import Clipboard from '@react-native-clipboard/clipboard';
import React, {useContext, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import Share from 'react-native-share';
import {useSelector} from 'react-redux';

import {
  useGetAgentDetailLazyQuery,
  useInviteUserInfoLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../appData/appContext/appContext';
import {getUserId} from '../../../appData/user/selectors';
import {FETCH_POLICY} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {METRICS, normal} from '../../../assets/theme/metric';
import BaseScreen from '../../../components/BaseScreen';
import {useMount} from '../../commonHooks';
import ScreenIds from '../../ScreenIds';
import ShareApplicationView from './ShareApplicationView';

const ShareApplicationScreen = ({navigation}) => {
  const [userInviteInfo, setUserInviteInfo] = React.useState({});
  const userId = useSelector(getUserId);
  const [userData, setUserData] = useState();
  const {showMessageAlert} = useContext(AppContext);

  const {startApi: getAgentDetail} = useGraphqlApiLazy({
    graphqlApiLazy: useGetAgentDetailLazyQuery,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'agentById',
    showSpinner: true,
    onSuccess: setUserData,
  });

  const onSuccessInviteUserInfoSuccess = detail => {
    setUserInviteInfo(detail);
  };

  const {startApi: getInviteUserInfo} = useGraphqlApiLazy({
    graphqlApiLazy: useInviteUserInfoLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'inviteInfo',
    showSpinner: true,
    onSuccess: onSuccessInviteUserInfoSuccess,
  });

  useMount(() => {
    getInviteUserInfo({variables: {userId}});
    getAgentDetail({variables: {agentId: userId}});
  });

  const onViewListMemberInvited = () => {
    navigation.navigate(ScreenIds.ListInviteActiveUser, {
      numberOfMember: userInviteInfo?.totalInviteActive,
    });
  };

  const onShareLink = async () => {
    const contentShare = {
      url: userInviteInfo?.inviteLink,
      message: translate('shareScreen.textShareApp'),
    };
    Share.open(contentShare)
      .then(() => {
        const title = translate(STRINGS.SUCCESS);
        const content = translate('shareScreen.contentShareSuccess');
        showMessageAlert(title, content);
      })
      .catch(() => {});
  };

  const onShareQrCode = uri => {
    const contentShare = {
      url: uri,
      message: translate('shareScreen.textShareApp'),
    };
    Share.open(contentShare)
      .then(() => {
        const title = translate(STRINGS.SUCCESS);
        const content = translate('shareScreen.contentShareSuccess');
        showMessageAlert(title, content);
      })
      .catch(() => {});
  };

  const onCopyCode = () => {
    Clipboard.setString(userInviteInfo?.inviteCode);
    showMessageAlert(
      translate('shareScreen.titleCopySuccess'),
      translate('shareScreen.contentCopySuccess'),
    );
  };

  return (
    <BaseScreen
      title={translate('shareScreen.title')}
      headerOptions={{
        leftTextStyle: styles.headerTitle,
        leftIconStyle: styles.leftIconStyle,
        leftIconContainerStyle: styles.leftIconContainerStyle,
      }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ShareApplicationView
          userInviteInfo={userInviteInfo}
          userData={userData}
          onViewListMemberInvited={onViewListMemberInvited}
          onShareLink={onShareLink}
          onCopyCode={onCopyCode}
          onShareQrCode={onShareQrCode}
        />
      </ScrollView>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: SIZES.FONT_24,
    alignSelf: 'center',
  },
  leftIconContainerStyle: {
    ...METRICS.resetPadding,
    paddingEnd: normal,
  },
  leftIconStyle: {
    marginTop: SIZES.MARGIN_0,
  },
});

export default ShareApplicationScreen;
