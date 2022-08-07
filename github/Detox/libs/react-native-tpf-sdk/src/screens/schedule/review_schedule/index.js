import { updateScheduleStatusHandle } from '../../../redux/actions/schedule';
import { getShowAlertError } from '../../../redux/actions/system';
import { SecondaryButton } from '../../../components/';
import { PrimaryButton } from '../../../components/';
import { CustomInput } from '../../../components/';
import AppText from '../../../components/app_text';
import { CUSTOM_COLOR } from '../../../constants/colors';
import { CALL_API_ERROR } from '../../../constants/errors';
import { REVIEW_SCHEDULE_SUCCESSFULLY } from '../../../constants/success';
import React, { useState } from 'react';
import { useCallback } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { ScheduleStatus } from '../../../global/schedule_state';
import styles from './styles';
import RNCalendarEvents from 'react-native-calendar-events';
import { ATTRIBUTE_TYPE } from '../../../global/entity_type';

const ReviewSchedule = ({ navigation, route }) => {
  const { scheduleId, callback } = route.params || {};
  const dispatch = useDispatch();
  const [content, setContent] = useState('');
  const onChangeContent = useCallback(value => {
    setContent(value);
  }, []);
  const dispatchCompleteSchedule = useCallback(
    permission => {
      dispatch(
        updateScheduleStatusHandle({
          permission,
          params: {
            id: scheduleId,
            status: ScheduleStatus.COMPLETED,
            feedback: content
          },
          callback: (err, res) => {
            if (!err) {
              navigation.goBack();
              callback();
              dispatch(getShowAlertError(REVIEW_SCHEDULE_SUCCESSFULLY));
            } else {
              dispatch(getShowAlertError(CALL_API_ERROR));
            }
          }
        })
      );
    },
    [dispatch, content, navigation, callback, scheduleId]
  );

  const onCompleteSchedule = useCallback(() => {
    RNCalendarEvents.checkPermissions()
      .then(status => {
        if (status !== 'authorized') {
          RNCalendarEvents.requestPermissions().then(res => {
            dispatchCompleteSchedule(res);
          });
        } else {
          dispatchCompleteSchedule(status);
        }
      })
      .catch(err => {});
  }, [dispatchCompleteSchedule]);

  return (
    <View style={styles.container}>
      <AppText translate medium style={styles.desc}>
        {'schedule.review_schedule_desc'}
      </AppText>
      <KeyboardAwareScrollView>
        <CustomInput
          translateTitle
          translatePlaceholder
          title={'schedule.content'}
          style={styles.textValue}
          placeholder={'schedule.review_content'}
          onChangeText={onChangeContent}
          value={content}
          hasExtend
          multiline
          type={ATTRIBUTE_TYPE.textarea}
        />
      </KeyboardAwareScrollView>

      <View style={styles.btnView}>
        <PrimaryButton
          translate
          title={'common.completed'}
          style={styles.btn}
          onPress={onCompleteSchedule}
        />
        <SecondaryButton
          translate
          title={'common.skip'}
          style={[styles.btn, styles.cancelBtn]}
          backgroundColor={CUSTOM_COLOR.White}
          onPress={onCompleteSchedule}
        />
      </View>
    </View>
  );
};

export default React.memo(ReviewSchedule);
