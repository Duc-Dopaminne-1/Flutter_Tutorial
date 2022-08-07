import AppText from '../../components/app_text';
import { FONT_FAMILY, FONT_SIZE } from '../../constants/appFonts';
import { TEXT_COLOR } from '../../constants/colors';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { scale } from '../../utils/responsive';

function SvgComponent(props, svgRef) {
  const { title, color1 = '#FF951F', translate = false } = props;

  return (
    <Svg
      width={48}
      height={28}
      viewBox="0 0 48 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 23.855L11 12 0 .145V0h48v24H0v-.145z"
        fill={color1}
      />
      <Path d="M44 28l4-4h-4v4z" fill="#8F510B" />
      <View
        style={[styles.titleContainer, { width: props.width || 48, height: props.height || 24 }]}>
        <AppText bold={true} translate={translate} style={styles.value}>
          {title}
        </AppText>
      </View>
    </Svg>
  );
}
const styles = StyleSheet.create({
  titleContainer: {
    justifyContent: 'center',
    paddingTop: scale(4),
    paddingRight: scale(4)
  },
  value: {
    fontSize: FONT_SIZE.SubHead,
    color: TEXT_COLOR.White,
    flex: 1,
    textAlign: 'right'
  }
});
const ForwardRef = React.forwardRef(SvgComponent);
export default ForwardRef;
