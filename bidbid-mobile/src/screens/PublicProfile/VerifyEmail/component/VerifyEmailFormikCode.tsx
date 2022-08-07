import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { colors, fonts } from '@/vars';
import { isIOS } from '@/shared/devices';
import { VerifyEmailContext } from '../VerifyEmailContext';

const CELL_COUNT = 6;

function VerifyEmailForMikCode({ forMikProps }: any) {
  const [value, setValue] = useState('');
  const { onSetCode } = useContext(VerifyEmailContext);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    onSetCode(value);
  }, [value]);

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
      cellCount={CELL_COUNT}
      rootStyle={styles.codeFieldRoot}
      keyboardType={isIOS ? 'number-pad' : 'numeric'}
      textContentType="oneTimeCode"
      renderCell={({ index, symbol, isFocused }) => (
        <View key={index} style={[styles.wrapText, isFocused && styles.focusCell]} onLayout={getCellOnLayoutHandler(index)}>
          <Text style={styles.cell}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
        </View>
      )}
      autoFocus
    />
  );
}

export default React.memo(VerifyEmailForMikCode);

const styles = StyleSheet.create({
  cell: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.s30,
    height: 40,
    lineHeight: 38,
    textAlign: 'center',
    width: 35,
  },
  codeFieldRoot: {
    marginBottom: 5,
    marginTop: 20,
  },
  focusCell: {
    borderBottomColor: colors.pink_red,
  },
  wrapText: {
    borderBottomWidth: 2,
  },
});
