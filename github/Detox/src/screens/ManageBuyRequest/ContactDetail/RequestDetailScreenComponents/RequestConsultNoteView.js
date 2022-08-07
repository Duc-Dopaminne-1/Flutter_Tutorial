import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import TextView from '../../../../components/TextView';

const styles = StyleSheet.create({
  textHeader1: {
    ...FONTS.bold,
    ...FONTS.fontSize18,
  },
  consultNoteInput: {
    width: '100%',
    height: 80,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_E4,
    ...METRICS.smallPadding,
  },
});

const RequestConsultNoteView = ({onChangeText}) => {
  const [notes, setNotes] = useState('');

  const SYMBOL_COLON = ':';
  const onChangeTextNotes = text => {
    setNotes(text);
    onChangeText(text);
  };

  return (
    <>
      <TextView title={translate(STRINGS.CONSULT_NOTE) + SYMBOL_COLON} value="" />
      <View style={commonStyles.separatorRow8} />
      <TextInput
        style={styles.consultNoteInput}
        multiline
        onChangeText={onChangeTextNotes}
        value={notes}
      />
    </>
  );
};

export default RequestConsultNoteView;
