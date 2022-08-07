import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';

const SubmitComponent = ({onPress, text}) => {
  return (
    <View style={commonStyles.footerContainer}>
      <CustomButton style={commonStyles.buttonConfirm} title={text} onPress={onPress} />
    </View>
  );
};

SubmitComponent.propTypes = {
  onPress: PropTypes.func,
  text: PropTypes.string,
};

SubmitComponent.defaultProps = {
  onPress: () => {},
  text: translate(STRINGS.SEND_REQUEST),
};

export default SubmitComponent;
