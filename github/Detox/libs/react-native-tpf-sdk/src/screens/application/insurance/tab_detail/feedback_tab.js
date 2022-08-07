import { getListInsuranceResponsesHandle } from '../../../../redux/actions/insurance';
import { TextView } from '../../../../components/';
import { BACKGROUND_COLOR } from '../../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../../constants/size';
import { Shadow } from '../../../../constants/stylesCSS';
import moment from 'moment';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { EmptyContent } from '../../../../components/';
import { empty_info } from '../../../../assets/images';

const FeedbackTab = ({ itemDetail, onChange }) => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.insurance.insuranceListResponses);

  useEffect(() => {
    dispatch(
      getListInsuranceResponsesHandle({
        params: {
          id: itemDetail?.orderId
        }
      })
    );
  }, [dispatch, itemDetail]);

  useEffect(() => {
    onChange([null, data?.length > 0 ? data?.length : null]);
  }, [dispatch, data, onChange]);

  return data?.length > 0 ? (
    data.map((item, index) => (
      <View style={styles.infoContainer} key={(item?.id || index).toString()}>
        <TextView
          translate
          title={'feedback.response_date'}
          value={item?.creationTime ? moment(item?.creationTime).format('DD/MM/YYYY') : ''}
          multiline={true}
        />
        <TextView translate title={'feedback.content'} value={item.reason} multiline={true} />
      </View>
    ))
  ) : (
    <EmptyContent translate title={'feedback.message'} image={empty_info} />
  );
};

export default FeedbackTab;
export const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  itemTab: {
    alignItems: 'center'
  },
  infoContainer: {
    ...Shadow,
    paddingBottom: SPACING.Medium,
    paddingHorizontal: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.Primary,
    borderRadius: BORDER_RADIUS,
    marginBottom: SPACING.Medium
  },

  title: {
    marginBottom: SPACING.Fit
  },
  switchArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
