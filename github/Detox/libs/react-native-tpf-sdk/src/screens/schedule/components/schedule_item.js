import {
  ICAccountSchedule,
  ICMapSchedule,
  ICCalendarSchedule,
  ICWhiteCheck
} from '../../../assets/icons';
import AppText from '../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScheduleState } from '../../../global/schedule_state';
import { scale } from '../../../utils/responsive';
import themeContext from '../../../constants/theme/themeContext';

const RowItem = React.memo(({ icon, label }) => {
  return (
    <View style={styles.rowContent}>
      {icon}
      <Text style={styles.text}>{label}</Text>
    </View>
  );
});

const ApplicationItem = props => {
  const { item, checkBoxVisible, deleteItems, onSelectItem, onPressItem } = props;
  const { fromDate, fromTime, toDate, toTime, location, referenceName, status } = item || {};
  const { fonts } = useContext(themeContext) || {};
  const time = useMemo(() => {
    let _time = '';
    if (fromDate === toDate) {
      _time = fromTime + ' - ' + toTime + ' | ' + toDate;
    } else {
      _time = fromTime + ' | ' + fromDate + ' - ' + toTime + ' | ' + toDate;
    }
    return _time;
  }, [fromDate, toDate, fromTime, toTime]);

  const _onPressItem = useCallback(
    event => {
      return typeof onPressItem === 'function' && onPressItem(item, event);
    },
    [onPressItem, item]
  );

  const _onSelectItem = useCallback(() => {
    return typeof onSelectItem === 'function' && onSelectItem(item);
  }, [onSelectItem, item]);

  let stateSchedule = ScheduleState.find(t => t.status === status);

  const isSelectToDelete = useMemo(() => {
    return deleteItems.includes(item?.id);
  }, [deleteItems, item]);

  const checkBoxStyle = useMemo(() => {
    return [styles.checkBox, isSelectToDelete && styles.checkedBox];
  }, [isSelectToDelete]);

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={_onPressItem}>
      <View style={styles.groupContent}>
        <View style={styles.leftContent}>
          <RowItem icon={<ICAccountSchedule style={styles.icon} />} label={referenceName} />
          <RowItem icon={<ICCalendarSchedule style={styles.icon} />} label={time} />
          <RowItem icon={<ICMapSchedule style={styles.icon} />} label={location} />
        </View>
        <View style={styles.right}>
          <View style={[styles.groupState, { backgroundColor: stateSchedule.backgroundColor }]}>
            <AppText translate semiBold style={styles.stateText}>
              {stateSchedule.title}
            </AppText>
          </View>
          {checkBoxVisible && (
            <>
              <TouchableOpacity onPress={_onSelectItem}>
                <View style={checkBoxStyle} />
              </TouchableOpacity>
              {isSelectToDelete && <ICWhiteCheck style={styles.checkIcon} />}
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ApplicationItem;

const styles = StyleSheet.create({
  right: {
    alignItems: 'flex-end'
  },
  checkIcon: {
    position: 'absolute',
    right: scale(2),
    top: scale(50)
  },
  checkBox: {
    width: scale(20),
    height: scale(20, false),
    borderWidth: scale(2),
    borderRadius: scale(4),
    borderColor: CUSTOM_COLOR.OsloGray,
    marginTop: scale(18)
  },
  checkedBox: {
    backgroundColor: CUSTOM_COLOR.PersianGreen,
    borderColor: CUSTOM_COLOR.PersianGreen
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: SPACING.Small
  },
  groupContent: {
    flexDirection: 'row',
    height: '100%',
    flex: 1,
    justifyContent: 'space-between'
  },
  groupInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  icon: {
    marginTop: scale(2)
  },
  textFromTo: {
    fontSize: FONT_SIZE.Heading,
    flex: 1
  },
  groupState: {
    borderRadius: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: scale(6)
  },
  groupAddress: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  textAddress: {
    color: TEXT_COLOR.GreenBold
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.Normal
  },
  customRowContent: { flexDirection: 'row' },
  dateArea: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: -scale(25)
  },
  leftContent: { width: '60%', justifyContent: 'space-between' },
  text: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    color: CUSTOM_COLOR.GreenBold,
    marginLeft: scale(6)
  },
  stateText: {
    fontSize: FONT_SIZE.Small,
    lineHeight: LINE_HEIGHT.Small,
    color: TEXT_COLOR.White
  }
});
