import moment from 'moment';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../constants/appFonts';
import { CUSTOM_COLOR, TEXT_COLOR } from '../constants/colors';
import { SPACING } from '../constants/size';
import { ATTRIBUTE_TYPE, DATE_FORMAT } from '../global/entity_type';
import { parseLocationToString } from '../helpers/entityData';
import { formatNumber } from '../helpers/formatNumber';
import { scale } from '../utils/responsive';
import AppText from './app_text';
import CustomFilePicker from './custom_file_picker';
import CustomWebview from './custom_webview';
import themeContext from '../constants/theme/themeContext';

const TextView = ({
  value,
  item,
  title,
  style,
  type = ATTRIBUTE_TYPE.text,
  selectOptions = [],
  location,
  bold = false,
  translate = false,
  suffix = ''
}) => {
  const { text, fonts } = useContext(themeContext) || {};
  let displayValue = value;
  if ([ATTRIBUTE_TYPE.text, ATTRIBUTE_TYPE.textarea].includes(type)) {
    displayValue = value;
  } else if ([ATTRIBUTE_TYPE.date, ATTRIBUTE_TYPE.datetime, ATTRIBUTE_TYPE.time].includes(type)) {
    const date = moment(value);
    displayValue = date.isValid() ? date.format(DATE_FORMAT[type]) : '';
  } else if ([ATTRIBUTE_TYPE.number, ATTRIBUTE_TYPE.price].includes(type)) {
    displayValue = formatNumber(value || '0');
  } else if ([ATTRIBUTE_TYPE.select].includes(type)) {
    displayValue = selectOptions.find(t => t.code == value)?.displayName;
  } else if ([ATTRIBUTE_TYPE.address].includes(type)) {
    displayValue = parseLocationToString(location);
  } else if ([ATTRIBUTE_TYPE.image].includes(type)) {
    displayValue = (
      <View style={styles.imgContainer}>
        <FastImage source={value && { uri: value }} resizeMode="contain" style={styles.img} />
      </View>
    );
  } else if ([ATTRIBUTE_TYPE.boolean].includes(type)) {
    displayValue = (
      <View style={styles.imgContainer}>
        {value === '0' ? (
          <AppText translate>{'common.no'}</AppText>
        ) : (
          <AppText translate>{'common.yes'}</AppText>
        )}
      </View>
    );
  }
  return [ATTRIBUTE_TYPE.media].includes(type) ? (
    <CustomFilePicker title={title} style={[styles.container, style]} itemRef={item} onlyView />
  ) : [ATTRIBUTE_TYPE.texteditor].includes(type) ? (
    <View style={[styles.container, style]}>
      {title ? (
        <AppText bold translate={translate} style={styles.title}>
          {title}
        </AppText>
      ) : null}
      {value ? (
        <CustomWebview
          content={value}
          padding={SPACING.Medium * 2}
          style={{ paddingTop: SPACING.Medium, paddingBottom: 0 }}
        />
      ) : (
        <Text
          style={[
            styles.textValue,
            { color: text?.primary, fontFamily: fonts?.MEDIUM },
            bold && { fontFamily: fonts?.BOLD }
          ]}>
          {/* {displayValue} */}
        </Text>
      )}
    </View>
  ) : (
    <View style={[styles.container, style]}>
      {!!title && (
        <AppText bold translate={translate} style={[styles.title]}>
          {title}
        </AppText>
      )}
      <Text
        translate
        style={[styles.textValue, { color: text?.primary }, bold && { fontFamily: fonts?.BOLD }]}>
        {displayValue}
      </Text>
    </View>
  );
};

export default TextView;

const styles = StyleSheet.create({
  container: {
    paddingTop: SPACING.XNormal
  },
  title: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    minHeight: LINE_HEIGHT.SubHead,
    paddingBottom: SPACING.Small
  },
  textValue: {
    lineHeight: LINE_HEIGHT.BodyText,
    minHeight: LINE_HEIGHT.BodyText,
    fontSize: FONT_SIZE.BodyText,
    paddingLeft: 0
  },
  webView: {
    minHeight: LINE_HEIGHT.BodyText
  },
  imgContainer: {
    paddingTop: scale(14)
  },
  img: {
    width: scale(343),
    height: scale(140)
  }
});
