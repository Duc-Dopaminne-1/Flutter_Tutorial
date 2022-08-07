import React, {useMemo} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomButton from '../../../../components/Button/CustomButton';
import {SizeBox} from '../../../../components/SizeBox';
import homeStyles from '../../styles';

export const ServiceItem = ({item, onPressServiceItem, isLastItem, isHomePage}) => {
  const onPress = () => {
    onPressServiceItem(item);
  };

  const styleItem = useMemo(() => {
    const itemContainer = styles.itemContainer;
    const imageItem = styles.imageItem;
    const icon = styles.icon;
    if (isHomePage) {
      return {
        itemContainer: {
          ...itemContainer,
          paddingHorizontal: 0,
        },
        imageItem: {
          ...imageItem,
          width: 44,
          height: 44,
          backgroundColor: COLORS.PRIMARY_A100,
        },
        icon: {
          ...icon,
          tintColor: COLORS.NEUTRAL_WHITE,
        },
      };
    }
    return {
      itemContainer,
      imageItem,
      icon,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={onPress}
        style={styleItem.itemContainer}
        key={item.id}>
        <View style={styleItem.imageItem}>
          <Image source={item.icon} style={styleItem.icon} resizeMode="contain" />
        </View>
        <SizeBox width={SIZES.SEPARATOR_12} />
        <Text style={styles.textNameServices}>{item.name}</Text>
        <MaterialIcons
          name="arrow-forward-ios"
          size={16}
          color={isHomePage ? COLORS.PRIMARY_A100 : COLORS.TEXT_DARK_10}
        />
      </TouchableOpacity>
      {isHomePage && !isLastItem && <View style={styles.line} />}
    </>
  );
};

const ServiceItemSection = ({title, services, onPressServiceItem, isHomePage}) => {
  if (!services || services?.length < 1) {
    return null;
  }

  return (
    <>
      <Text style={[styles.subSectionTitle(isHomePage)]}>{title}</Text>
      <View style={{marginBottom: SIZES.MARGIN_12}}>
        {services.map((item, index) => (
          <ServiceItem
            key={index}
            isLastItem={index === services.length - 1}
            item={item}
            onPressServiceItem={onPressServiceItem}
            isHomePage={isHomePage}
          />
        ))}
      </View>
    </>
  );
};

const PlusServiceBlock = ({onPressServiceItem, onPressSendRequest, plusServices, isHomePage}) => {
  const {beforeBuying, whileBuying, afterBuying} = plusServices;
  return (
    <>
      <View style={METRICS.horizontalPadding}>
        {isHomePage && (
          <>
            <View style={commonStyles.separatorRow16} />
            <View style={styles.sectionTextContainer}>
              <Text style={[homeStyles.sectionText, styles.sectionText]}>
                {translate('home.plusService.services')}
              </Text>
              {!!onPressSendRequest && (
                <CustomButton
                  style={styles.quickSendRequest}
                  title={translate('plusService.tpf.createRequest')}
                  onPress={onPressSendRequest}
                  titleColor={COLORS.PRIMARY_A100}
                />
              )}
            </View>
            <Text style={[homeStyles.textContent, {color: COLORS.TEXT_DARK_40}]}>
              {translate('home.plusService.subTitle')}
            </Text>
            <View style={commonStyles.separatorRow16} />
          </>
        )}
        <ServiceItemSection
          title={`${translate('home.plusService.beforeBuy')}`}
          services={beforeBuying}
          onPressServiceItem={onPressServiceItem}
          isHomePage={isHomePage}
        />
        <ServiceItemSection
          title={`${translate('home.plusService.whileBuying')}`}
          services={whileBuying}
          onPressServiceItem={onPressServiceItem}
          isHomePage={isHomePage}
        />
        <ServiceItemSection
          title={`${translate('home.plusService.afterBuy')}`}
          services={afterBuying}
          onPressServiceItem={onPressServiceItem}
          isHomePage={isHomePage}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  textNameServices: {...FONTS.regular, flex: 1, fontSize: SIZES.FONT_16, color: COLORS.BLACK_31},
  subSectionTitle: isHomePage => ({
    ...HELPERS.fill,
    ...FONTS.bold,
    fontSize: isHomePage ? SIZES.FONT_20 : SIZES.FONT_16,
    color: COLORS.TEXT_DARK_10,
    marginBottom: isHomePage ? 0 : SIZES.MARGIN_12,
  }),
  blockTitle: {
    ...HELPERS.fill,
    ...FONTS.semiBold,
    fontSize: 16,
    color: COLORS.PRIMARY_B100,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.PADDING_8,
    marginVertical: SIZES.MARGIN_4,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: SIZES.BORDER_RADIUS_4,
    paddingHorizontal: SIZES.PADDING_12,
  },
  imageItem: {
    width: 40,
    height: 40,
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY_A20,
    justifyContent: 'center',
    borderRadius: SIZES.BORDER_RADIUS_100,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: COLORS.PRIMARY_A100,
  },
  line: {height: 1, backgroundColor: COLORS.NEUTRAL_DIVIDER},
  sectionTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionText: {
    marginRight: SIZES.MARGIN_18,
  },
  quickSendRequest: {
    alignItems: 'flex-start',
    marginTop: SIZES.MARGIN_4,
  },
});

export default React.memo(PlusServiceBlock);
