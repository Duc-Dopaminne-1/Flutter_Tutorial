import { CustomInput } from '../../../components/';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { SPACING } from '../../../constants/size';
import React, { Fragment } from 'react';
import { StyleSheet } from 'react-native';

const InputExtend = ({ value, onChangeValue }) => {
  return (
    <Fragment>
      <CustomInput
        type={'textarea'}
        required
        translate
        translateTitle
        title={'common.content'}
        placeholder={'common.content'}
        value={value}
        onChangeText={text => {
          onChangeValue(text);
        }}
        hasExtend
        multiline
        maxLength={256}
      />
    </Fragment>
  );
};

export default InputExtend;
