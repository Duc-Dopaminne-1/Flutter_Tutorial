import {useNavigation} from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';
import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';

import {useGetAgentDetailLazyQuery} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../api/graphql/useGraphqlApiLazy';
import {updateDateCloseIntroduce} from '../../appData/appSettings/actions';
import {getDateCloseIntroduce} from '../../appData/appSettings/selectors';
import {getUserId} from '../../appData/user/selectors';
import {CONSTANTS, FETCH_POLICY} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {useLogin} from '../../screens/Auth/useLogin';
import {useMount} from '../../screens/commonHooks';
import ScreenIds from '../../screens/ScreenIds';
import {SCREEN_SIZE} from '../../utils/ImageUtil';
import {diffDate} from '../../utils/TimerCommon';
import CustomButton from '../Button/CustomButton';

const SIZE_IMG = SCREEN_SIZE.WIDTH - 80;
const HEIGHT_BUTTON = 34;
export const IntroduceTopenLandModal = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const dateCloseIntroduce = useSelector(getDateCloseIntroduce);

  const {notLoggedIn, showLogin} = useLogin();
  const agentId = useSelector(getUserId);
  const [isVisible, setIsVisible] = useState(false);

  const {startApi: getAgentDetail} = useGraphqlApiLazy({
    showSpinner: true,
    graphqlApiLazy: useGetAgentDetailLazyQuery,
    queryOptions: {...FETCH_POLICY.CACHE_AND_NETWORK},
    dataField: 'agentById',
    onSuccess: res => {
      navigation.navigate(ScreenIds.UpdateAgentProfile, {
        agentById: res,
        isEditRefCode: isEmpty(res.referralCode),
      });
    },
  });

  useMount(() => {
    const diffHour = diffDate(new Date(), dateCloseIntroduce, 'hours');
    // before 24 hours
    if (!dateCloseIntroduce || diffHour >= 24) {
      setIsVisible(true);
    }
  });

  const closeModal = () => {
    setIsVisible(false);
    dispatch(updateDateCloseIntroduce(new Date()));
  };

  const justNow = () => {
    closeModal();
    if (notLoggedIn) {
      showLogin(() => {});
    } else {
      getAgentDetail({variables: {agentId}});
    }
  };

  return (
    <Modal
      useNativeDriver
      isVisible={isVisible}
      statusBarTranslucent={true}
      backdropOpacity={0.35}
      backdropColor={COLORS.TEXT_DARK_10}
      animationIn="fadeIn"
      animationOut="fadeOut"
      deviceHeight={SCREEN_SIZE.HEIGHT}
      deviceWidth={SCREEN_SIZE.WIDTH}>
      <View style={styles.container}>
        <Image source={IMAGES.IMG_BANNER_INTRODUCE} style={styles.image} />
        <CustomButton
          activeOpacity={0.8}
          mode="primary"
          title={translate(STRINGS.JOIN_NOW)}
          style={styles.btnInvite}
          titleStyle={{fontSize: SIZES.FONT_14}}
          onPress={justNow}
        />
        <TouchableOpacity
          hitSlop={CONSTANTS.HIT_SLOP}
          activeOpacity={0.8}
          style={styles.btnClose}
          onPress={closeModal}>
          <Ionicons name="close" color={COLORS.NEUTRAL_WHITE} size={20} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: SIZE_IMG,
    height: SIZE_IMG,
  },
  btnInvite: {
    borderRadius: SIZES.BORDER_RADIUS_20,
    height: HEIGHT_BUTTON,
    marginTop: -HEIGHT_BUTTON / 2,
    paddingHorizontal: SIZES.PADDING_12,
  },
  btnClose: {
    width: 24,
    height: 24,
    borderRadius: SIZES.BORDER_RADIUS_16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY_A100,
    position: 'absolute',
    top: -8,
    right: 20,
  },
});
