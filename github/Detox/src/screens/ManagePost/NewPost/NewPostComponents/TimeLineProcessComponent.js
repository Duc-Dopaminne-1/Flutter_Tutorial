import React from 'react';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {NEW_POST_STEP} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {COLORS} from '../../../../assets/theme/colors';
import {HELPERS} from '../../../../assets/theme/helpers';
import TimeLineList, {
  TimeLineDirection,
  TimeLineType,
} from '../../../../components/List/TimeLineList';

const styles = StyleSheet.create({
  container: {
    ...HELPERS.row,
    ...HELPERS.fill,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  timelineContainer: {
    ...HELPERS.rowSpaceBetweenCenter,
    ...HELPERS.fill,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
});

const timelineProps = {
  done: {
    type: TimeLineType.Done,
    iconStyle: {
      tintColor: COLORS.PRIMARY_A100,
    },
  },
  active: {
    type: TimeLineType.Waiting,
    iconStyle: {
      tintColor: COLORS.PRIMARY_A100,
      backgroundColor: COLORS.PRIMARY_A100,
    },
  },
  inactive: {
    type: TimeLineType.InActive,
    iconStyle: {
      borderWidth: SIZES.BORDER_WIDTH_2,
    },
  },
  fail: {
    type: TimeLineType.Fail,
  },
};

export const getListViews = ({data, onPressStep1, onPressStep2, onPressStep3, onPressStep4}) => {
  const stepProcess = data?.stepProcess || NEW_POST_STEP.STEP1;
  let step1Props = {
    ...timelineProps.active,
    iconText: '1',
    iconTextStyle: {color: COLORS.NEUTRAL_WHITE},
  };
  let step2Props = {...timelineProps.inactive, iconText: '2'};
  let step3Props = {...timelineProps.inactive, iconText: '3'};
  let step4Props = {...timelineProps.inactive, iconText: '4'};
  let enabledStep1 = data?.step1Valid || false;
  let enabledStep2 = data?.step2Valid || false;
  let enabledStep3 = data?.step3Valid || false;
  const enabledStep4 = data?.step4Valid || false;

  switch (stepProcess) {
    case NEW_POST_STEP.STEP2:
      enabledStep1 = data?.step1Valid || true;
      step1Props = {...step1Props, iconText: null, ...timelineProps.done};
      step2Props = {
        ...step2Props,
        ...timelineProps.active,
        iconTextStyle: {color: COLORS.NEUTRAL_WHITE},
      };
      break;
    case NEW_POST_STEP.STEP3:
      enabledStep1 = data?.step1Valid || true;
      enabledStep2 = data?.step2Valid || true;
      step1Props = {...step1Props, ...timelineProps.done, iconText: null};
      step2Props = {...step2Props, ...timelineProps.done, iconText: null};
      step3Props = {
        ...step3Props,
        ...timelineProps.active,
        iconTextStyle: {color: COLORS.NEUTRAL_WHITE},
      };
      break;
    case NEW_POST_STEP.STEP4:
      enabledStep1 = data?.step1Valid || true;
      enabledStep2 = data?.step2Valid || true;
      enabledStep3 = data?.step3Valid || true;
      step1Props = {...step1Props, ...timelineProps.done, iconText: null};
      step2Props = {...step2Props, ...timelineProps.done, iconText: null};
      step3Props = {...step3Props, ...timelineProps.done, iconText: null};
      step4Props = {
        ...step4Props,
        ...timelineProps.active,
        iconTextStyle: {color: COLORS.NEUTRAL_WHITE},
      };
      break;
  }

  return [
    {
      ...step1Props,
      disabled: !enabledStep1,
      onPress: onPressStep1,
    },
    {
      ...step2Props,
      disabled: !enabledStep2,
      onPress: onPressStep2,
    },
    {
      ...step3Props,
      disabled: !enabledStep3,
      onPress: onPressStep3,
    },
    {
      ...step4Props,
      disabled: !enabledStep4,
      hideLine: true,
      onPress: onPressStep4,
    },
  ];
};

const TimeLineProcessComponent = ({
  data,
  style,
  containerStyle,
  onPressStep1,
  onPressStep2,
  onPressStep3,
  onPressStep4,
}) => {
  return (
    <KeyboardAwareScrollView scrollEnabled={false} contentContainerStyle={containerStyle}>
      <View style={[styles.container, style]}>
        <TimeLineList
          direction={TimeLineDirection.ROW}
          mainColor={COLORS.PRIMARY_A100}
          style={styles.timelineContainer}
          views={getListViews({data, onPressStep1, onPressStep2, onPressStep3, onPressStep4})}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default TimeLineProcessComponent;
