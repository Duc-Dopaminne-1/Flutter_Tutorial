import React, { ReactElement, useEffect, useState, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { language } from '@/i18n';
import { TextInputComponent } from '@/components/TextInput';
import { colors, fonts } from '@/vars';
import { FormikValues } from 'formik';
import { CreateAuctionTitle } from '@/screens/CreateAuction/component/CreateAuctionTitle';
import { useSelector } from 'react-redux';
import { AppInit } from '@/redux/app/reducer';

function CreateAuctionStartPrice({ setFieldValue }: FormikValues): ReactElement {
  const { AUCTION_START_PRICE, AUCTION_START_PRICE_BY_COUNTRY } = useSelector((state: AppInit) => state.app.setting);
  const locale = useSelector((state: AppInit) => state.app.locale);

  const [startPrice, setStartPrice] = useState('');

  const foundStartPriceByCountry = AUCTION_START_PRICE_BY_COUNTRY?.find(item => item.code === locale);
  const startPriceDefault = foundStartPriceByCountry ? foundStartPriceByCountry.value : AUCTION_START_PRICE;

  useEffect(() => {
    const startPrice = `${startPriceDefault}.00`;
    setStartPrice(startPrice);
    setFieldValue('startPrice', startPrice);
  }, []);

  const startPriceValue = `${startPrice} ${language('currency')}`;
  const startPriceDefaultValue = `${language('startAuctionPrice', { price: startPriceDefault })} ${language('currency')}`;

  return (
    <View style={styles.container}>
      <CreateAuctionTitle title={language('startingPrice')} subTitle={startPriceDefaultValue} />
      <TextInputComponent
        styleContainerConfig={styles.wrapInput}
        value={startPriceValue}
        placeholderTextColor={colors.bg_tab}
        styleConfig={styles.textInput}
        styleFormConfig={styles.wrapFromInput}
        keyboardType={'number-pad'}
        editable={false}
        isPrefix
      />
    </View>
  );
}

export default memo(CreateAuctionStartPrice);

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    justifyContent: 'space-between',
  },
  textInput: {
    color: colors.black,
    fontSize: fonts.size.s17,
  },
  wrapInput: {
    width: '100%',
  },

  wrapFromInput: {
    height: 42,
    paddingBottom: 0,
    borderBottomWidth: 0,
    borderRadius: 10,
    marginTop: 14,
    paddingHorizontal: 12,
    backgroundColor: colors.gray_line_beta,
    borderBottomColor: colors.placeholder_gray,
  },
});
