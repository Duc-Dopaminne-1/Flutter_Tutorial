import React, { ReactElement, useState, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { language } from '@/i18n';
import { TextInputComponent } from '@/components/TextInput';
import { colors, fonts } from '@/vars';
import { FormikValues } from 'formik';
import { CreateAuctionTitle } from '@/screens/CreateAuction/component/CreateAuctionTitle';

function CreateAuctionEndPrice({ setFieldValue, errors, setFieldError }: FormikValues): ReactElement {
  const [endPrice, setEndPrice] = useState('');

  const onChangeTextEndPrice = (text: string) => {
    if (text === '0.00') {
      setEndPrice('');
      setFieldValue('endPrice', '');
      return;
    }
    setEndPrice(text);
    setFieldValue('endPrice', text);
  };

  const onBlur = () => {
    setFieldError('endPrice', '');
  };

  return (
    <View style={styles.container}>
      <CreateAuctionTitle title={language('endPrice')} subTitle={language('bidbidCharge')} />
      <TextInputComponent
        styleContainerConfig={styles.wrapInput}
        value={endPrice}
        onChangeText={onChangeTextEndPrice}
        placeholderTextColor={colors.bg_tab}
        styleConfig={styles.textInput}
        onBlur={onBlur}
        styleFormConfig={styles.wrapFromInput}
        keyboardType={'number-pad'}
        placeholder={language('inputPrice')}
        isError={!!errors.endPrice}
        errorText={errors.endPrice}
        isMasked
        isPrefix
      />
    </View>
  );
}

export default memo(CreateAuctionEndPrice);

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
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
    borderRadius: 10,
    marginTop: 14,
    borderWidth: 1,
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    borderColor: colors.placeholder_gray,
    borderBottomColor: colors.placeholder_gray,
  },
});
