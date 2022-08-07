import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

function SvgComponent(props) {
  const { icon } = props;

  return (
    <Svg
      width={46}
      height={46}
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Circle cx={23} cy={23} r={23} fill="#F5F6F8" />

      <View style={styles.icon}>{icon}</View>
    </Svg>
  );
}

const styles = StyleSheet.create({
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent'
  }
});

export default SvgComponent;
