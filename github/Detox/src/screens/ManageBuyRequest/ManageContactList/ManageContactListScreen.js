import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import {ContactType} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import BaseScreen from '../../../components/BaseScreen';
import CustomListItem from '../../../components/CustomListItem';
import {SizeBox} from '../../../components/SizeBox';
import {FeatureConfig} from '../../../configs/FeatureConfig';
import ScreenIds from '../../ScreenIds';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.NEUTRAL_BACKGROUND,
  },
  item: {
    paddingHorizontal: SIZES.PADDING_12,
    paddingVertical: SIZES.PADDING_8,
    marginVertical: SIZES.MARGIN_4,
    borderRadius: SIZES.BORDER_RADIUS_8,
    overflow: 'hidden',
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
});

const CustomItem = ({containerStyle, customStyle, title, onPress, imageSource}) => {
  return (
    <>
      <TouchableOpacity style={[HELPERS.rowSpaceBetweenCenter, containerStyle]} onPress={onPress}>
        <CustomListItem
          imageStyle={{tintColor: COLORS.PRIMARY_A100}}
          backgroundIcon={COLORS.PRIMARY_A20}
          customStyle={customStyle}
          title={title}
          imageSource={imageSource}
          showArrow={false}
          disabled={true}
          sizeIconLeft={40}
        />
        <Feather name={'chevron-right'} size={20} color={COLORS.BLACK_31} />
      </TouchableOpacity>
    </>
  );
};

const MenuContainer = ({navigation}) => {
  return (
    <>
      <CustomItem
        containerStyle={styles.item}
        customStyle={[HELPERS.fill, METRICS.resetMargin, METRICS.resetPadding]}
        title={translate('contactTrading.manageList.listOneTitle')}
        imageSource={IMAGES.IC_PROJECT}
        onPress={() =>
          navigation.navigate(ScreenIds.ManageBuyRequest, {
            typeSelect: ContactType.B2C,
          })
        }
        showSeparator
      />
      <CustomItem
        containerStyle={styles.item}
        customStyle={[HELPERS.fill, METRICS.resetMargin, METRICS.resetPadding]}
        title={translate('contactTrading.manageList.listTwoTitle')}
        imageSource={IMAGES.IC_PROPERTY}
        onPress={() =>
          navigation.navigate(ScreenIds.ManageBuyRequest, {
            typeSelect: ContactType.C2C,
          })
        }
        showSeparator
      />
      <CustomItem
        containerStyle={styles.item}
        customStyle={[HELPERS.fill, METRICS.resetMargin, METRICS.resetPadding]}
        title={translate('contactTrading.manageList.listFourTitle')}
        imageSource={IMAGES.IC_YOUR_CONTACT_ADVICE}
        onPress={() => navigation.navigate(ScreenIds.ManageContactAdvice)}
        showSeparator
      />
      {FeatureConfig.enableTopenerService && (
        <CustomItem
          containerStyle={styles.item}
          customStyle={[HELPERS.fill, METRICS.resetMargin, METRICS.resetPadding]}
          title={translate('contactTrading.manageList.listThreeTitle')}
          imageSource={IMAGES.IC_SUPPORT_REQUSEST}
          onPress={() => navigation.navigate(ScreenIds.RequestSupport)}
          showSeparator
        />
      )}
      <CustomItem
        containerStyle={styles.item}
        customStyle={[HELPERS.fill, METRICS.resetMargin, METRICS.resetPadding]}
        title={translate('contactTrading.manageList.searchRequest')}
        imageSource={IMAGES.COMPASS_FILL}
        onPress={() =>
          navigation.navigate(ScreenIds.ManageGeneralRequestScreen, {
            typeSelect: ContactType.C2C,
          })
        }
        showSeparator
      />
    </>
  );
};

const ManageContactListScreen = ({navigation}) => {
  return (
    <BaseScreen
      containerStyle={styles.container}
      title={translate('common.requestType')}
      testID={ScreenIds.ManageContactList}
      showHeaderShadow>
      <View style={METRICS.smallHorizontalPadding}>
        <SizeBox height={SIZES.SEPARATOR_20} />
        <MenuContainer navigation={navigation} />
      </View>
    </BaseScreen>
  );
};

export default ManageContactListScreen;
