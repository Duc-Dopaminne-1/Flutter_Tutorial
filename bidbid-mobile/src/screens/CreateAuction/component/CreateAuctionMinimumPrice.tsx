import React, { ReactElement, useState, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { language } from '@/i18n';
import { TextInputComponent } from '@/components/TextInput';
import { colors, fonts } from '@/vars';
import { FormikValues } from 'formik';
import { CreateAuctionTitle } from '@/screens/CreateAuction/component/CreateAuctionTitle';

function CreateAuctionMinimumPrice({ setFieldValue, errors, setFieldError }: FormikValues): ReactElement {
  const [minimumPrice, setMinimumPrice] = useState('');

  const onChangeText = (text: string) => {
    if (text === '0.00') {
      setMinimumPrice('');
      setFieldValue('minimumPrice', '');
      return;
    }
    setMinimumPrice(text);
    setFieldValue('minimumPrice', text);
  };

  const onBlur = () => {
    setFieldError('minimumPrice', '');
  };

  return (
    <View style={styles.container}>
      <CreateAuctionTitle title={language('minimumPrice')} subTitle={language('bidbidChargeMinimum')} />
      <TextInputComponent
        inputId={'MinimumPrice'}
        styleContainerConfig={styles.wrapInput}
        value={minimumPrice}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholderTextColor={colors.bg_tab}
        styleConfig={styles.textInput}
        styleFormConfig={styles.wrapFromInput}
        keyboardType={'number-pad'}
        placeholder={language('inputPrice')}
        isError={!!errors.minimumPrice}
        errorText={errors.minimumPrice}
        isMasked
        isPrefix
      />
    </View>
  );
}

export default memo(CreateAuctionMinimumPrice);

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
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
    borderWidth: 1,
    marginTop: 14,
    borderRadius: 10,
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    borderColor: colors.placeholder_gray,
    borderBottomColor: colors.placeholder_gray,
  },
});
