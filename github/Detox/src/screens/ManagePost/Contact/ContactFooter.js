import {useNavigation} from '@react-navigation/native';
import {useAnalytics} from '@segment/analytics-react-native';
import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';

import {AppContext} from '../../../appData/appContext/useAppContext';
import {HOTLINE_NUMBER_FORMAT} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';
import {extractImageUri} from '../../../utils/extractImageUri';
import {useLogin} from '../../Auth/useLogin';
import ScreenIds from '../../ScreenIds';
import {Category, TrackingActions} from '../../WithSegment';

const styles = StyleSheet.create({
  fullWidthButton: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonAdvice: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
  },
  titleStyle: {color: COLORS.PRIMARY_A100, ...FONTS.bold, ...FONTS.fontSize14},
  newBackgroundColor: {
    backgroundColor: COLORS.PRIMARY_A100,
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: COLORS.GREY_F0,
  },
  sendContactRequestText: {
    ...FONTS.bold,
    ...FONTS.fontSize14,
  },
});

const ContactFooter = ({
  post,
  project,
  isAlreadyContactSuccess,
  showConsultantRequestBtn,
  showContactBtn,
  loading,
}) => {
  const navigation = useNavigation();
  const {track} = useAnalytics();
  const {showMessageAlert} = useContext(AppContext);
  const {showLogin} = useLogin();

  const needAdvice = () => {
    const params = {};
    const originState = post?.originState ?? {};
    if (originState.propertyPostId) {
      params.postTitle = originState.postTitle;
      params.image = extractImageUri(post);
      params.propertyPostId = originState.propertyPostId;
    } else if (project && project.projectId) {
      params.postTitle = project.projectName;
      params.image = project.featurePhotos;
      params.projectId = project.projectId;
    }

    track(TrackingActions.consultancyRequestClicked, {
      category: project.projectId ? Category.project : Category.buy,
      name: params.postTitle,
    });

    if (params.projectId || params.propertyPostId) {
      navigation.navigate(ScreenIds.ContactToAdvice, params);
    }
  };

  const contactToBuy = () => {
    if (isAlreadyContactSuccess) {
      showMessageAlert(
        translate('contactTrading.alert.already.title'),
        translate('contactTrading.alert.already.message'),
        HOTLINE_NUMBER_FORMAT,
      );
      return;
    }
    const originState = post?.originState ?? {};
    if (originState.propertyPostId) {
      navigation.navigate(ScreenIds.ContactToBuy, {
        postTitle: originState.postTitle,
        image: extractImageUri(post),
        propertyPostId: originState.propertyPostId,
        propertyPost: originState,
        alreadyContactedToBuy: post?.alreadyContactedToBuy,
        alreadyContactedToRent: post?.alreadyContactedToRent,
      });
    }
  };

  const contactToBuyWithLogin = () => {
    showLogin(contactToBuy);
  };

  if (loading) {
    return null;
  }

  return (
    <View style={[commonStyles.footerContainer, styles.borderTop]}>
      {showConsultantRequestBtn && (
        <CustomButton
          style={[commonStyles.buttonNext, styles.fullWidthButton, styles.buttonAdvice]}
          titleStyle={styles.titleStyle}
          title={translate(STRINGS.REQUEST_SUPPORT)}
          onPress={needAdvice}
        />
      )}
      {showContactBtn && showConsultantRequestBtn && (
        <View style={commonStyles.separatorColumn12} />
      )}
      {showContactBtn && (
        <CustomButton
          style={[commonStyles.buttonNext, styles.fullWidthButton, styles.newBackgroundColor]}
          onPress={contactToBuyWithLogin}
          title={translate('propertyPost.sendContactRequest')}
          titleStyle={styles.sendContactRequestText}
        />
      )}
    </View>
  );
};

ContactFooter.propTypes = {
  post: PropTypes.object,
  project: PropTypes.object,
  afterContactSuccess: PropTypes.bool,
};

ContactFooter.defaultProps = {
  post: {},
  project: {},
  afterContactSuccess: false,
};

export default ContactFooter;
