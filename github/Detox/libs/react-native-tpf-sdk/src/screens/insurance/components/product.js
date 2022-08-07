import { ICCoin, ICNewProduct } from '../../../assets/icons';
import { BodyText, CheckBox, Divider, RowSpace } from '../../../components/';
import AppText from '../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/size';
import { Shadow } from '../../../constants/stylesCSS';
import { formatNumber } from '../../../helpers/formatNumber';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { partnerItemSelector } from '../../../redux/selectors/partner';
import { scale } from '../../../utils/responsive';
import themeContext from '../../../constants/theme/themeContext';

const InsuranceProduct = props => {
  const {
    item,
    containerStyle,
    style,
    fullWidth,
    onPress,
    hasComparation,
    checkedComparation,
    onAddComparation
  } = props;

  const theme = useContext(themeContext);
  const partner = useSelector(state => partnerItemSelector(state, item?.partnerId));
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={event => onPress(event, item)}
      style={[Shadow, styles.shadowContainer, fullWidth && styles.fullWidth, containerStyle]}>
      <>
        {item?.statusNew ? (
          <ICNewProduct
            color1={theme?.icon?.color1}
            translate
            style={styles.newContainer}
            title={'product_screen.is_new'}
          />
        ) : null}
      </>

      <View style={[styles.container, fullWidth && styles.fullWidth, style]}>
        <>
          <View style={styles.imageContainer}>
            <FastImage
              source={{
                uri: item?.image || ''
              }}
              style={styles.image}
            />

            <View style={styles.brandContainer}>
              <FastImage
                source={{
                  uri: partner?.imageLink || ''
                }}
                style={styles.brand}
                resizeMode={'cover'}
              />
            </View>
          </View>
        </>

        <View style={styles.contentContainer}>
          <BodyText numberOfLines={1} style={{ fontFamily: theme?.fonts?.SEMIBOLD }}>
            {item?.name || ''}
          </BodyText>
          <Text
            style={[
              styles.description,
              { color: theme.text.secondary, fontFamily: theme?.fonts.REGULAR }
            ]}
            numberOfLines={2}>
            {item?.description || ''}
          </Text>
          <View style={styles.priceContainer}>
            <ICCoin color1={theme?.icon?.color2} />
            <AppText
              translate
              style={[
                styles.price,
                { color: theme.app.primaryColor2, fontFamily: theme?.fonts?.SEMIBOLD }
              ]}
              numberOfLines={1}>
              {'insurance_screen.only_from'}
              {formatNumber(item?.price || '0')}
              {'common.currency'}
            </AppText>
          </View>
        </View>
        {hasComparation ? (
          <>
            <RowSpace height={SPACING.Medium} />
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

export default InsuranceProduct;

const styles = StyleSheet.create({
  shadowContainer: {
    backgroundColor: BACKGROUND_COLOR.White,
    borderRadius: BORDER_RADIUS,
    width: scale(280),
    minHeight: scale(280)
  },
  container: {
    backgroundColor: BACKGROUND_COLOR.White,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS
  },
  fullWidth: {
    width: '100%'
  },
  newContainer: {
    position: 'absolute',
    zIndex: 100,
    right: -scale(4),
    top: scale(12),
    justifyContent: 'center',
    paddingBottom: scale(4)
  },
  brandContainer: {
    position: 'absolute',
    left: scale(12),
    bottom: scale(12),
    width: scale(48),
    height: scale(48),
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS,
    backgroundColor: BACKGROUND_COLOR.White
  },
  brand: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS
  },
  comparationContainer: {
    paddingVertical: SPACING.Medium,
    paddingHorizontal: SPACING.Medium,
    alignItems: 'center'
  },
  image: {
    height: scale(140),
    width: '100%',
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS
  },

  contentContainer: {
    marginTop: SPACING.Medium,
    paddingHorizontal: SPACING.XNormal
  },
  description: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    marginTop: SPACING.Normal
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.XNormal
  },
  price: {
    fontSize: FONT_SIZE.BodyText,
    marginLeft: SPACING.Normal,
    lineHeight: LINE_HEIGHT.BodyText
  },
  comparationButton: {}
});
