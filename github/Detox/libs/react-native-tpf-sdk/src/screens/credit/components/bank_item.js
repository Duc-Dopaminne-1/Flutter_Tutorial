import { useNavigation } from '@react-navigation/native';
import { PrimaryButton } from '../../../components/';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { CUSTOM_COLOR } from '../../../constants/colors';
import SCREENS_NAME from '../../../constants/screens';
import { BORDER_RADIUS, MULTIE_BORDER_RADIUS, SPACING } from '../../../constants/size';
import { Shadow } from '../../../constants/stylesCSS';
import React, { useContext } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { PRODUCT_CATEGORY_TYPE } from '../../../global/app';
import { scale } from '../../../utils/responsive';
import { partnerItemSelector } from '../../../redux/selectors/partner';
import { useSelector } from 'react-redux';
import themeContext from '../../../constants/theme/themeContext';
import { t } from 'i18n-js';

const BankItem = props => {
  const { item, type } = props;
  const partner = useSelector(state => partnerItemSelector(state, item?.partnerId));
  const navigation = useNavigation();
  const theme = useContext(themeContext);
  const onPress = () => {
    type === PRODUCT_CATEGORY_TYPE.CREDIT
      ? navigation.navigate(SCREENS_NAME.CREDIT_PRODUCT_DETAIL_SCREEN, { item })
      : navigation.navigate(SCREENS_NAME.INSURANCE_DETAIL_SCREEN, { item });
  };
  return (
    <View style={styles.bankItemCover}>
      <Image
        source={{
          uri: item?.image || ''
        }}
        style={styles.bankLogo}
      />
      <Image
        source={{
          uri: partner?.imageLink || ''
        }}
        style={styles.partnerImage}
      />
      <Text
        style={[
          styles.bankName,
          { color: theme?.text?.primary, fontFamily: theme?.fonts?.SEMIBOLD }
        ]}
        numberOfLines={2}>
        {item?.name || ''}
      </Text>
      <View style={styles.action}>
        <PrimaryButton
          translate
          title={type === PRODUCT_CATEGORY_TYPE.CREDIT ? 'other.fin_now' : 'other.buy_now'}
          style={styles.customBtn}
          titleStyle={styles.titleStyle}
          onPress={onPress}
        />
      </View>
    </View>
  );
};
export default React.memo(BankItem);

const styles = StyleSheet.create({
  bankItemCover: {
    ...Shadow,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS,
    backgroundColor: CUSTOM_COLOR.White,
    marginBottom: SPACING.Normal,
    flex: 1
  },
  bankLogo: {
    borderTopLeftRadius: MULTIE_BORDER_RADIUS.MEDIUM,
    borderTopRightRadius: MULTIE_BORDER_RADIUS.MEDIUM,
    width: '100%',
    height: scale(94)
  },
  bankName: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    marginVertical: SPACING.XNormal,
    paddingHorizontal: SPACING.XNormal,
    width: '100%',
    textAlign: 'center',
    height: scale(40)
  },
  action: {
    width: '100%',
    padding: SPACING.Normal
  },
  customBtn: {
    height: scale(40)
  },
  titleStyle: {
    fontSize: FONT_SIZE.SubHead
  },
  partnerImage: {
    position: 'absolute',
    width: scale(30),
    height: scale(30),
    left: 8,
    top: 56,
    borderRadius: 4
  }
});
