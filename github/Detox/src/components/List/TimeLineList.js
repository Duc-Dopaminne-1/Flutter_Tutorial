import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {IMAGES} from '../../assets/images';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {micro, tiny} from '../../assets/theme/metric';

export const TimeLineType = {
  Done: 'Done',
  Waiting: 'Waiting',
  InActive: 'InActive',
  Fail: 'Fail',
};

const IconType = {
  Done: IMAGES.IC_SUCCESS_FILL,
  Waiting: IMAGES.IC_TL_WAITING,
  InActive: IMAGES.IC_TL_INACTIVE,
  Fail: IMAGES.IC_TL_FAIL,
};

export const TimeLineDirection = {
  COLUMN: 'COLUMN',
  ROW: 'ROW',
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  textStep: {
    marginRight: tiny,
    marginTop: 2,
    ...FONTS.bold,
    minWidth: 60,
    maxWidth: 60,
  },
  textStepRow: {
    marginTop: 2,
    ...FONTS.bold,
    minWidth: 60,
    textAlign: 'center',
  },
});

const mileStoneStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderColor: COLORS.GRAY_C9,
    overflow: 'hidden',
  },
  line: {
    width: 2,
    flex: 1,
  },
  lineRow: {
    flex: 1,
    marginHorizontal: tiny,
    height: 2,
  },
  text: {
    position: 'absolute',
    paddingTop: micro,
    top: 4,
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    ...FONTS.fontSize14,
    ...FONTS.bold,
    color: COLORS.TEXT_DARK_10,
    overflow: 'hidden',
  },
});

const MileStoneView = ({
  type,
  stepName,
  hideLine,
  iconSource,
  iconStyle,
  lineColor = COLORS.PRIMARY_A100,
  disabled = true,
  onPress,
  iconText,
  iconTextStyle,
  direction = TimeLineDirection.COLUMN,
}) => {
  const lineBackgroundColor = {backgroundColor: lineColor};
  if (direction === TimeLineDirection.ROW) {
    return (
      <View style={[HELPERS.colCenter]}>
        <View style={HELPERS.fillRowCross}>
          <TouchableOpacity disabled={disabled} onPress={onPress}>
            <Image
              source={iconSource ?? IconType[type]}
              style={[mileStoneStyles.icon, iconStyle]}
            />
            {!!iconText && <Text style={[mileStoneStyles.text, iconTextStyle]}>{iconText}</Text>}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View style={HELPERS.row}>
      {stepName && <Text style={styles.textStep}>{stepName}</Text>}
      <View style={mileStoneStyles.container}>
        <TouchableOpacity disabled={disabled} onPress={onPress}>
          <Image source={iconSource ?? IconType[type]} style={[mileStoneStyles.icon, iconStyle]} />
          {!!iconText && <Text style={[mileStoneStyles.text, iconTextStyle]}>{iconText}</Text>}
        </TouchableOpacity>
        {!hideLine && <View style={[mileStoneStyles.line, lineBackgroundColor]} />}
      </View>
    </View>
  );
};

const generateListViews = (data, mainColor, direction = TimeLineDirection.COLUMN) => {
  const list = [];
  const themeColor = mainColor ?? COLORS.PRIMARY_A100;
  for (let index = 0; index < data.length; index++) {
    let lineColor = null;
    const item = data[index];
    if (index < data.length - 1) {
      /**
       * update logic: next step done, line color is Man color, skip check current done
       * if next step not last index & type = TimeLineType.Waiting, line color is not Man color
       **/
      if (index + 1 < data.length - 1) {
        lineColor =
          data[index + 1].type === TimeLineType.Done ||
          data[index + 1].type === TimeLineType.Fail ||
          data[index + 1].type === TimeLineType.Waiting
            ? themeColor
            : COLORS.GRAY_C9;
      } else {
        lineColor =
          data[index + 1].type === TimeLineType.Done || data[index + 1].type === TimeLineType.Fail
            ? themeColor
            : COLORS.GRAY_C9;
        if (
          direction === TimeLineDirection.ROW &&
          (data[index + 1].type === TimeLineType.Done ||
            data[index + 1].type === TimeLineType.Fail ||
            data[index + 1].type === TimeLineType.Waiting)
        ) {
          lineColor = themeColor;
        }
      }
    } else {
      lineColor = item.type === TimeLineType.Done ? themeColor : COLORS.GRAY_C9;
    }
    const view =
      direction === TimeLineDirection.ROW ? (
        <View style={HELPERS.colCenter} key={index.toString()}>
          <View style={styles.container} key={(index + 1) * 5}>
            <MileStoneView
              type={item.type}
              stepName={item.stepName}
              hideLine={item.hideLine}
              lineColor={lineColor}
              iconStyle={item.iconStyle}
              iconSource={item.iconSource}
              disabled={item.disabled}
              onPress={item.onPress}
              iconText={item.iconText}
              iconTextStyle={item.iconTextStyle}
              direction={direction}
            />
          </View>
        </View>
      ) : (
        <View style={styles.container} key={index.toString()}>
          <MileStoneView
            type={item.type}
            stepName={item.stepName}
            hideLine={item.hideLine}
            lineColor={lineColor}
            iconStyle={item.iconStyle}
            iconSource={item.iconSource}
            disabled={item.disabled}
            onPress={item.onPress}
            iconText={item.iconText}
            iconTextStyle={item.iconTextStyle}
            direction={direction}
          />
          {item.view}
        </View>
      );

    list.push(view);

    if (direction === TimeLineDirection.ROW && !item.hideLine) {
      list.push(
        <View
          key={(index + 1) * 1.7}
          style={[mileStoneStyles.lineRow, {backgroundColor: lineColor}]}
        />,
      );
    }
  }
  return list;
};

const generateStepViews = data => {
  const list = [];
  for (let index = 0; index < data.length; index++) {
    const item = data[index];
    list.push(
      item.stepName ? (
        <Text key={(index + 2) * 1.1} style={styles.textStepRow}>
          {item.stepName}
        </Text>
      ) : (
        <View key={(index + 2) * 1.1} style={styles.textStepRow} />
      ),
    );
  }
  return list;
};
const generateChildViews = data => {
  const list = [];
  for (let index = 0; index < data.length; index++) {
    const item = data[index];
    list.push(
      item.view ? (
        <View key={(index + 1) * 1.99} style={[HELPERS.center, {flex: 1 / data.length}]}>
          {item.view}
        </View>
      ) : (
        <View key={(index + 1) * 1.99} style={[{flex: 1 / data.length}]} />
      ),
    );
  }
  return list;
};

const TimeLineList = ({
  views,
  style,
  mainColor = COLORS.PRIMARY_A100,
  direction = TimeLineDirection.COLUMN,
}) => {
  if (direction === TimeLineDirection.ROW) {
    return (
      <View style={HELPERS.fill}>
        <View style={style}>{generateListViews(views, mainColor, direction)}</View>
        <View style={HELPERS.rowSpaceBetween}>{generateStepViews(views)}</View>
        <View style={[HELPERS.rowSpaceBetween, style]}>{generateChildViews(views)}</View>
      </View>
    );
  }
  return <View style={style}>{generateListViews(views, mainColor, direction)}</View>;
};

export default TimeLineList;
