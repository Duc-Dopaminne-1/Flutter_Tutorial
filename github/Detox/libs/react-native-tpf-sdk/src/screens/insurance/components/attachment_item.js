import { ICFile } from '../../../assets/icons';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { CUSTOM_COLOR } from '../../../constants/colors';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { scale } from '../../../utils/responsive';
import themeContext from '../../../constants/theme/themeContext';

const AttachmentItem = props => {
  const { fonts } = useContext(themeContext) || {};
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <ICFile />
        <View style={styles.fileInfo}>
          <Text style={[styles.fileName, { fontFamily: fonts?.BOLD }]}>
            C{'hitra1lantrongvong30ngaysautainan.PDF'}
          </Text>
          <Text style={[styles.size, { fontFamily: fonts?.REGULAR }]}>{'123MB'}</Text>
        </View>
      </View>
      <Text>{'21/12/2021'}</Text>
    </View>
  );
};

export default AttachmentItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  leftContent: {
    flexDirection: 'row',
    flex: 1
  },
  fileInfo: {
    marginHorizontal: scale(12),
    flex: 1
  },
  fileName: {
    flex: 1,
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    color: CUSTOM_COLOR.GreenPea
  },
  size: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    color: CUSTOM_COLOR.GreenPea
  }
});
