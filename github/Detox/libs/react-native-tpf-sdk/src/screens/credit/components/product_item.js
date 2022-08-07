import { useNavigation } from '@react-navigation/core';
import { ICCurrencyYellow, ICHotMix } from '../../../assets/icons';
import { CheckBox } from '../../../components/';
import AppText from '../../../components/app_text';
import Divider from '../../../components/divider';
import { FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import SCREENS_NAME from '../../../constants/screens';
import { BORDER_RADIUS, SPACING } from '../../../constants/size';
import { Shadow } from '../../../constants/stylesCSS';
import { formatNumber } from '../../../helpers/formatNumber';
import { handleTouchItem } from '../../../helpers/handleTouchItem';
import { validateNumberic } from '../../../helpers/validate';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { partnerItemSelector } from '../../../redux/selectors/partner';
import { scale } from '../../../utils/responsive';
import themeContext from '../../../constants/theme/themeContext';

const ProductItem = props => {
  const { text, fonts, app, icon } = useContext(themeContext) || {};
  const { item, checkedComparation, onAddComparation, isHot, route, hasComparation } = props;
  const navigation = useNavigation();

  const partner = useSelector(state => partnerItemSelector(state, item?.partnerId));
  const { topenId } = useSelector(state => state.auth);

  const onPress = event => {
    handleTouchItem(event, 'CreditItem', route, item, topenId);
    navigation.navigate(SCREENS_NAME.CREDIT_PRODUCT_DETAIL_SCREEN, {
      item: item
    });
  };
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.cardContainer}>
        {isHot ? <ICHotMix color1={app?.primaryColor1} style={styles.icNew} /> : null}
        <FastImage source={{ uri: item?.image || '' }} style={styles.img} />
        <View style={styles.brandContainer}>
          <FastImage
            source={{
              uri: partner?.imageLink || ''
            }}
            style={styles.brand}
            resizeMode="contain"
          />
        </View>

        <View style={styles.contentContainer}>
          <Text style={[styles.textTitle, { color: text.primary, fontFamily: fonts?.SEMIBOLD }]}>
            {item?.name}
          </Text>
          <Text
            style={[styles.textDetail, { color: text.secondary, fontFamily: fonts?.REGULAR }]}
            numberOfLines={2}>
            {item?.description}
          </Text>
          <View style={styles.currencyContainer}>
            <ICCurrencyYellow
              styles={styles.currencyIC}
              color1={icon?.color2}
              color2={icon?.color2}
            />
            <AppText
              translate
              style={[
                styles.currencyText,
                { color: app.primaryColor2, fontFamily: fonts?.SEMIBOLD }
              ]}>
              {'insurance_screen.maximum_limit'}
              {formatNumber(item?.loanLimit || '0')}
              {validateNumberic(item?.loanLimit) ? 'common.currency' : ''}
            </AppText>
          </View>
        </View>
        {hasComparation ? (
          <>
            <Divider />
            <View style={styles.comparationContainer}>
              <CheckBox
                translate
                label={'insurance_screen.compare'}
                checked={checkedComparation}
                onChange={checked => onAddComparation(checked, item)}
              />
            </View>
          </>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  brand: {
    width: scale(40),
    height: scale(40)
  },
  brandContainer: {
    position: 'absolute',
    left: scale(12),
    top: scale(80),
    zIndex: 999,
    width: scale(48),
    height: scale(48),
    backgroundColor: BACKGROUND_COLOR.Primary,
    borderRadius: BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardContainer: {
    backgroundColor: CUSTOM_COLOR.White,
    marginHorizontal: scale(16),
    marginBottom: scale(24),
    borderRadius: 8,
    ...Shadow
  },
  img: {
    width: '100%',
    height: scale(140),
    borderTopLeftRadius: scale(8),
    borderTopRightRadius: scale(8)
  },
  icNew: {
    position: 'absolute',
    zIndex: 999,
    top: scale(12),
    right: -scale(4)
  },
  contentContainer: {
    paddingTop: SPACING.Medium,
    paddingHorizontal: SPACING.XNormal,
    paddingBottom: SPACING.Medium
  },
  textTitle: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  textDetail: {
    fontSize: FONT_SIZE.SubHead,
    marginTop: SPACING.Small,
    lineHeight: LINE_HEIGHT.SubHead
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.XNormal
  },
  currencyText: {
    marginLeft: scale(6),
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  currencyIC: {
    width: scale(16),
    height: scale(16)
  },
  btnContainer: {
    marginTop: scale(16),
    marginBottom: scale(16),
    width: '93%',
    alignSelf: 'center'
    // marginHorizontal: scale(12)
  },
  statusContainer: {
    justifyContent: 'center',
    marginVertical: scale(16)
  },
  comparationContainer: {
    paddingVertical: SPACING.Medium,
    paddingHorizontal: SPACING.Medium,
    alignItems: 'center'
  }
});
