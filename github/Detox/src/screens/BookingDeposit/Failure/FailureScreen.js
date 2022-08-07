import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {normal, small} from '../../../assets/theme/metric';
import ScreenIds from '../../ScreenIds';
import Summary from '../Confirm/Components/Summary';

const styles = StyleSheet.create({
  viewInside: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: SIZES.BORDER_RADIUS_10,
    padding: 16,
  },
  viewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  buttonText: {
    ...FONTS.bold,
    fontSize: 14,
    color: COLORS.NEUTRAL_WHITE,
    textAlign: 'center',
  },
  title: {
    ...FONTS.semiBold,
    fontSize: 20,
    alignSelf: 'center',
    marginBottom: normal,
    textAlign: 'center',
  },
  descriptionContainer: {
    alignSelf: 'center',
    width: '80%',
  },
  descriptionText: {
    ...FONTS.regular,
    fontSize: 15,
    alignSelf: 'center',
    color: COLORS.TEXT_DARK_10,
    paddingVertical: 2,
  },
  imageContainer: {
    width: '100%',
    marginVertical: normal,
  },
  image: {
    alignSelf: 'center',
  },
});

const modalErrorStyle = StyleSheet.create({
  projectName: {...FONTS.semiBold, fontSize: 15, color: COLORS.BLACK_33, textAlign: 'center'},
  projectTitle: {
    ...FONTS.regular,
    fontSize: 15,
    color: COLORS.GREY_82,
    textAlign: 'center',
  },
  projectContainer: {
    flex: 1,
    borderRadius: 4,
    paddingVertical: small,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.NEUTRAL_BORDER,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    marginTop: normal,
  },
  divider: {height: 1, marginBottom: normal, backgroundColor: COLORS.NEUTRAL_DIVIDER},
  button: {
    backgroundColor: COLORS.PRIMARY_A100,
    borderRadius: 5,
    paddingTop: 10,
    paddingBottom: 12,
  },
});

export const ProjectErrorContainer = ({transactionDetail}) => {
  return (
    <>
      <View style={[HELPERS.rowCenter]}>
        <View style={modalErrorStyle.projectContainer}>
          <Text style={modalErrorStyle.projectTitle}>{`${translate(STRINGS.PROJECT_NAME)}:`}</Text>
          <Text style={modalErrorStyle.projectName}>
            {transactionDetail?.propertyPostInfo?.projectInfo?.projectName}
          </Text>
        </View>
      </View>
      <Summary propertyPost={transactionDetail?.propertyPostInfo} />
    </>
  );
};

const FailureScreen = ({
  containerView,
  title = translate('modal.payment.failure'),
  description = translate('common.productInfo'),
}) => {
  const navigation = useNavigation();
  const onReturnHome = () => {
    navigation.navigate(ScreenIds.Home);
  };

  return (
    <View style={styles.viewInside} testID={ScreenIds.FailureScreen}>
      <View style={styles.viewContainer}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={IMAGES.IC_CLOSE_CIRCLE_FILL} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
        {containerView}
      </View>
      <View style={modalErrorStyle.divider} />
      <TouchableOpacity onPress={onReturnHome}>
        <View style={modalErrorStyle.button}>
          <Text style={styles.buttonText}>{translate('common.backToHome')}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default FailureScreen;
