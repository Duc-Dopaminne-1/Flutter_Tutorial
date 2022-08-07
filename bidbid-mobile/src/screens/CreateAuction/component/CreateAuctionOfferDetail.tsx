import React, { ReactElement, memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { language } from '@/i18n';
import { CreateAuctionTitle } from '@/screens/CreateAuction/component/CreateAuctionTitle';
import { TextInputComponent } from '@/components/TextInput';
import { colors, fonts } from '@/vars';
import { FormikValues } from 'formik';
import ErrorMessage from '@/components/ErrorMessage';
import { isAndroid } from '@/shared/devices';

function CreateAuctionOfferDetail({ setFieldValue, errors, setFieldError, onFocusInput }: FormikValues): ReactElement {
  const onChangeText = (text: string) => {
    setFieldValue('offerDetail', text);
    if (errors.offerDetail) {
      setFieldError('offerDetail', '');
    }
  };

  return (
    <View style={styles.container}>
      <CreateAuctionTitle title={language('ExplainOfferDetail')} />

      <View style={styles.wrapTopDuration}>
        <TextInputComponent
          onChangeText={onChangeText}
          maxLength={500}
          styleConfig={styles.input}
          styleContainerConfig={styles.wrapContainerInput}
          multiline
          onFocus={onFocusInput}
          numberOfLines={4}
          placeholder={language('placeHolderOfferDetail')}
          textContentType={'telephoneNumber'}
          styleFormConfig={styles.wrapInput}
          returnKeyType="done"
          placeholderTextColor={colors.gray_500}
        />
        <Text style={styles.textLimitCharacter}>{language('limitCharacter500')}</Text>
      </View>
      <ErrorMessage errorValue={errors?.offerDetail} />
    </View>
  );
}

export default memo(CreateAuctionOfferDetail);

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  wrapTopDuration: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.gray_400,
    borderRadius: 10,
    padding: 10,
    paddingTop: isAndroid ? 0 : null,
  },
  textLimitCharacter: {
    textAlign: 'right',
    marginTop: 10,
    fontFamily: fonts.family.RobotoRegular,
    fontSize: fonts.size.s13,
    color: colors.gray_500,
  },
  wrapContainerInput: {
    flex: 1,
  },
  wrapInput: {
    borderBottomWidth: 0,
  },
  input: {
    minHeight: 50,
    maxHeight: 120,
    paddingTop: 0,
    padding: 0,
    flex: 1,
    height: isAndroid ? 60 : null,
  },
});
