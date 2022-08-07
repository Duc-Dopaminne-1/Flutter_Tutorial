import React from 'react';
import styles from './styles';
import { View } from 'react-native';
import CheckBox from '../../../../components/check_box';

const FilterStatus = props => {
  const [isPayment01, setPayment01] = React.useState(false);
  const [isPayment02, setPayment02] = React.useState(false);

  return (
    <View style={styles.filterstatuswrapper}>
      <CheckBox
        translate
        checked={isPayment01}
        onChange={setPayment01}
        labelStyle={styles.labelStyle}
        label={'additional_service_profiles.waiting_for_deposit_payment'}
      />
      <CheckBox
        translate
        checked={isPayment02}
        onChange={setPayment02}
        labelStyle={styles.labelStyle}
        label={'additional_service_profiles.waiting_for_remaining_payment'}
      />
    </View>
  );
};

FilterStatus.propTypes = {
  // bla: PropTypes.string,
};

FilterStatus.defaultProps = {
  // bla: 'test',
};

export default FilterStatus;
