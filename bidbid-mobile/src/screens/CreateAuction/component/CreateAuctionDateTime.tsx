import React, { ReactElement, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { language } from '@/i18n';
import { CustomDatePicker } from '@/components/CustomDatePicker';
import { FormikValues } from 'formik';
import ErrorMessage from '@/components/ErrorMessage';
import { CreateAuctionTitle } from '@/screens/CreateAuction/component/CreateAuctionTitle';
import IconCalendarSVG from '@/components/SVG/IconCalendarSVG';
import TimeCircleSVG from '@/components/SVG/TimeCircleSVG';

function CreateAuctionDateTime({ setFieldValue, errors, setFieldError }: FormikValues): ReactElement {
  return (
    <View style={styles.container}>
      <CreateAuctionTitle isRequire title={language('dateMeet')} subTitle={language('allowBiddeeSelect')} />

      <View style={styles.wrapRow}>
        <CustomDatePicker
          icon={<IconCalendarSVG />}
          mode={'date'}
          errorText={errors.date}
          setFieldValue={setFieldValue}
          onDatePicked={date => {
            setFieldValue('date', date);
            setFieldError('date', '');
            setFieldError('time', '');
          }}
        />
        <CustomDatePicker
          icon={<TimeCircleSVG />}
          mode={'time'}
          errorText={errors.time}
          setFieldValue={setFieldValue}
          onDatePicked={time => {
            setFieldValue('time', time);
            setFieldError('date', '');
            setFieldError('time', '');
          }}
        />
      </View>
      <ErrorMessage errorValue={errors.date || errors.time} />
    </View>
  );
}

export default memo(CreateAuctionDateTime);

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  wrapRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
