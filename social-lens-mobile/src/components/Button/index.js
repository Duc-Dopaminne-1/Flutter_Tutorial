import React, { Component } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import PropTypes from 'prop-types';

class Button extends Component {
  render() {
    const { containerStyle, icon, text, iconStyle, textStyle, disabled, onPress } = this.props;
    return (
      <TouchableOpacity
        disabled={disabled}
        style={[containerStyle, styles.btnContainer]}
        onPress={onPress}
      >
        {icon && <Icon name={icon} style={[iconStyle, styles.icon]} />}
        <Text style={textStyle}>{text}</Text>
      </TouchableOpacity>
    );
  }
}

Button.propTypes = {
  containerStyle: PropTypes.object,
  text: PropTypes.string,
  textStyle: PropTypes.object,
  icon: PropTypes.string,
  iconStyle: PropTypes.object,
  disabled: PropTypes.bool,
  onPress: PropTypes.func
};

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    marginRight: 5
  }
});

export default Button;
