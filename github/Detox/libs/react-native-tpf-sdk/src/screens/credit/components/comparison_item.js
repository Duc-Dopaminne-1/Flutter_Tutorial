import { HTMLView } from '../../../components/';
import Divider from '../../../components/divider';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { BORDER_RADIUS, DEVICE_WIDTH, SPACING } from '../../../constants/size';
import { Shadow } from '../../../constants/stylesCSS';
import { formatNumber } from '../../../helpers/formatNumber';
import moment from 'moment';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ATTRIBUTE_TYPE, DATE_FORMAT } from '../../../global/entity_type';
import { scale } from '../../../utils/responsive';

import themeContext from '../../../constants/theme/themeContext';

const ComparisonItem = props => {
  const { item, isFirst, isLast } = props;
  const theme = useContext(themeContext);

  const type = item?.frontendInput;
  let displayItem = item;
  let value1 = '';
  let value2 = '';
  if (
    [
      ATTRIBUTE_TYPE.text,
      ATTRIBUTE_TYPE.textarea,
      ATTRIBUTE_TYPE.select,
      ATTRIBUTE_TYPE.texteditor
    ].includes(type)
  ) {
    value1 = displayItem?.value?.product1;
    value2 = displayItem?.value?.product2;
  } else if ([ATTRIBUTE_TYPE.price, ATTRIBUTE_TYPE.number].includes(type)) {
    value1 = formatNumber(displayItem.value?.product1 || '0');
    value2 = formatNumber(displayItem.value?.product2 || '0');
  } else if ([ATTRIBUTE_TYPE.date, ATTRIBUTE_TYPE.datetime, ATTRIBUTE_TYPE.time].includes(type)) {
    const date1 = moment(displayItem.value?.product1);
    value1 = date1.isValid() ? date1.format(DATE_FORMAT[type]) : '';
    const date2 = moment(displayItem.value?.product2);
    value2 = date2.isValid() ? date2.format(DATE_FORMAT[type]) : '';
  }
  let width = (DEVICE_WIDTH - SPACING.Medium * 2 - SPACING.XNormal * 4) / 2;

  return (
    <View
      style={[
        styles.container,
        isFirst
          ? {
              borderTopLeftRadius: BORDER_RADIUS,
              borderTopRightRadius: BORDER_RADIUS
            }
          : {},
        isLast
          ? {
              borderBottomLeftRadius: BORDER_RADIUS,
              borderBottomRightRadius: BORDER_RADIUS
            }
          : {}
      ]}>
      <Text
        style={[styles.title, { color: theme?.text?.primary, fontFamily: theme?.fonts?.SEMIBOLD }]}>
        {displayItem?.attributeName}
      </Text>
      <Divider />
      <View style={styles.itemBackground}>
        <View style={styles.itemContainer}>
          {[ATTRIBUTE_TYPE.texteditor].includes(type) ? (
            <HTMLView content={value1} width={width} />
          ) : (
            <Text
              style={[
                styles.textTitle,
                { color: theme?.text?.primary, fontFamily: theme?.fonts?.REGULAR }
              ]}>
              {value1}
            </Text>
          )}
        </View>
        <View style={styles.divider} />
        <View style={styles.itemContainer}>
          {[ATTRIBUTE_TYPE.texteditor].includes(type) ? (
            <HTMLView content={value2} width={width} />
          ) : (
            <Text style={[styles.textTitle, { color: theme?.text?.primary }]}>{value2}</Text>
          )}
        </View>
      </View>
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Shadow,
    marginHorizontal: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  title: {
    textAlign: 'center',
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    paddingTop: SPACING.Large,
    paddingBottom: SPACING.XNormal
  },
  itemBackground: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemContainer: {
    flex: 1,
    padding: SPACING.XNormal,

    alignItems: 'center'
  },
  textTitle: {
    width: '100%',
    textAlign: 'center',
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  divider: {
    width: scale(1),
    backgroundColor: CUSTOM_COLOR.GreyDivider
  }
});

export default React.memo(ComparisonItem);
