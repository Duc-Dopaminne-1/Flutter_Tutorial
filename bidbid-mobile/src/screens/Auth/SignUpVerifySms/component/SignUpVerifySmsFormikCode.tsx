import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { colors, fonts } from '@/vars';
import { isAndroid, isIOS } from '@/shared/devices';
import { SignUpVerifySmsContext } from '@/screens/Auth/SignUpVerifySms/SignUpVerifySmsContext';
import { FormikValues } from 'formik';
import SmsRetriever from 'react-native-sms-retriever';

const CELL_COUNT = 6;

function SignUpVerifySmsForMikCode({ forMikProps }: FormikValues): ReactElement {
  const [value, setValue] = useState('');
  const { onSetCode } = useContext(SignUpVerifySmsContext);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    onSetCode(value);
  }, [value]);

  const getCode = message => {
    const code = message.match(/\d{6}/) || [false];
    if (code && code[0]) {
      forMikProps.setValues({
        code: code[0],
      });
      setValue(code[0]);
    }
  };

  useEffect(() => {
    if (isAndroid) {
      const getOtp = async () => {
        try {
          const registered = await SmsRetriever.startSmsRetriever();
          if (registered) {
            await SmsRetriever.addSmsListener(event => {
              event.message && getCode(event.message);
              SmsRetriever.removeSmsListener();
            });
          }
        } catch (error) {}
      };
      getOtp().then(_r => {});
    }
  }, []);

  const onChangeText = (text: string) => {
    setValue(text);
  };

  const onBlur = () => {
    forMikProps.setValues({
      code: value,
    });
  };

  return (
    <CodeField
      ref={ref}
      {...props}
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={forMikProps.handleSubmit}
      onBlur={onBlur}
      caretHidden={false}
      cellCount={CELL_COUNT}
      rootStyle={styles.root}
      keyboardType={isIOS ? 'number-pad' : 'numeric'}
      textContentType="oneTimeCode"
      renderCell={({ index, symbol, isFocused }) => {
        const hasValue = Boolean(symbol);
        return (
          <View key={index} style={styles.cellContainer} onLayout={getCellOnLayoutHandler(index)}>
            {hasValue || isFocused ? (
              <Text style={styles.cellContent}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
            ) : (
              <View style={styles.defaultCellContent} />
            )}
          </View>
        );
      }}
      autoFocus
    />
  );
}

export default React.memo(SignUpVerifySmsForMikCode);

const styles = StyleSheet.create({
  root: {
    marginBottom: 5,
    marginTop: 20,
    justifyContent: 'center',
  },
  cellContainer: {
    height: 40,
    width: 40,
    alignContent: 'center',
    justifyContent: 'center',
  },
  defaultCellContent: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.gray_300,
    alignSelf: 'center',
  },
  cellContent: {
    fontFamily: fonts.family.PoppinsMedium,
    fontSize: fonts.size.s24,
    textAlign: 'center',
    alignSelf: 'center',
    color: colors.red_700,
    lineHeight: 33,
  },
});
