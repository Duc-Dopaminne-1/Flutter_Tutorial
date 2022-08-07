import { ICCoin } from '../../../../assets/icons';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../../constants/colors';
import { SPACING } from '../../../../constants/size';
import { formatNumber } from '../../../../helpers/formatNumber';
import React, { useMemo, useContext } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { scale } from '../../../../utils/responsive';
import { TextView } from '../../../../components/';
import AppText from '../../../../components/app_text';
import CustomWebview from '../../../../components/custom_webview';
import { useSelector } from 'react-redux';
import { partnerItemSelector } from '../../../../redux/selectors/partner';
import themeContext from '../../../../constants/theme/themeContext';

const InfoSection = ({ item, ...rest }) => {
  const { fonts, text, app } = useContext(themeContext) || {};
  const listGroup = useMemo(() => {
    const tempListCategoryName = item?.listCategoryInfo?.map(cate => cate?.categoryName);
    return (
      <Text style={[styles.valueField, { fontFamily: fonts?.MEDIUM }]}>
        {tempListCategoryName?.join(', ')}
      </Text>
    );
  }, [item?.listCategoryInfo]);

  const partner = useSelector(state => partnerItemSelector(state, item?.partnerId));

  return (
    <View style={styles.productInfoContainer}>
      <Image
        source={
          item?.image && {
            uri: item?.image
          }
        }
        style={[styles.image]}
        resizeMode={'cover'}
      />
      <View style={styles.productInfo}>
        <Text style={[styles.title, { color: text.primary, fontFamily: fonts?.BOLD }]}>
          {item?.name}
        </Text>
        <View style={styles.priceContainer}>
          <ICCoin />
          <AppText numberOfLines={2} translate style={[styles.price, { color: app.primaryColor2 }]}>
            {formatNumber(item.price || '0')}
            {'common.currency'}
          </AppText>
        </View>
        <TextView translate title={'product_detail_type.group'} value={listGroup} />
        <TextView translate title={'product_detail_type.supplier'} value={partner?.name} />
        <AppText translate medium style={styles.descriptionTitle}>
          {'home_screen.profit'}
        </AppText>
        <CustomWebview
          content={item?.fullDescription || ''}
          style={{ paddingTop: SPACING.Small, paddingBottom: 0 }}
        />
      </View>
    </View>
  );
};

export default InfoSection;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: scale(210)
    // backgroundColor: BACKGROUND_COLOR.Secondary
  },
  productInfo: {
    paddingHorizontal: SPACING.Medium,
    paddingBottom: SPACING.Medium,
    marginTop: scale(24)
  },
  title: {
    lineHeight: LINE_HEIGHT.Title3,
    fontSize: FONT_SIZE.Title3
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.Normal,
    marginBottom: SPACING.Small
  },
  price: {
    fontSize: FONT_SIZE.BodyText,
    marginLeft: SPACING.Normal,
    lineHeight: LINE_HEIGHT.BodyText
  },
  rowContainer: {
    justifyContent: 'space-between',
    // alignItems: 'center',
    marginVertical: SPACING.Small,
    flex: 1
  },
  titleField: {
    fontSize: FONT_SIZE.BodyText,
    color: CUSTOM_COLOR.GreenPea,
    lineHeight: LINE_HEIGHT.BodyText
  },
  valueField: {
    fontSize: FONT_SIZE.BodyText,
    color: CUSTOM_COLOR.GreenBold,
    lineHeight: LINE_HEIGHT.BodyText,
    flex: 1
  },
  description: {
    fontSize: FONT_SIZE.BodyText,
    color: CUSTOM_COLOR.GreenBold,
    lineHeight: LINE_HEIGHT.BodyText,
    textAlign: 'justify'
  },
  productInfoContainer: {
    backgroundColor: BACKGROUND_COLOR.White
  },
  groupContainer: {
    flex: 1,
    marginLeft: SPACING.Normal,
    alignItems: 'flex-end'
  },

  descriptionTitle: {
    color: TEXT_COLOR.GreenBold,
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    minHeight: LINE_HEIGHT.SubHead,
    paddingTop: SPACING.XNormal
  }
});
