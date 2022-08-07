import * as React from 'react';
import Svg, { Rect, Path, Circle, Ellipse } from 'react-native-svg';
import themeContext from '../../constants/theme/themeContext';

function SvgComponent(props) {
  const theme = React.useContext(themeContext);
  const color1 = theme?.icon?.color1 ?? '#FF951F';
  return (
    <Svg
      width={54}
      height={56}
      viewBox="0 0 54 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M34.183 15.777a3.09 3.09 0 01-3.088-3.087V2.545h-15.79a4.857 4.857 0 00-4.852 4.852v35.462a4.857 4.857 0 004.852 4.851h18.999a9.5 9.5 0 01-1.47-5.09 9.545 9.545 0 0112.022-9.22V15.776H34.183zM17.687 34.302h6.415a1.323 1.323 0 010 2.646h-6.415a1.323 1.323 0 110-2.646zm-1.324-5.734c0-.73.593-1.323 1.324-1.323h19.407a1.323 1.323 0 010 2.646H17.687c-.731 0-1.324-.592-1.324-1.323zm20.73-8.38a1.323 1.323 0 110 2.646H17.688a1.323 1.323 0 110-2.646h19.407zm-3.352-7.499c0 .244.198.441.44.441h10.085a4.837 4.837 0 00-.928-1.21l-8.505-8.048a4.865 4.865 0 00-1.092-.778v9.595z"
        fill={color1}
      />
      <Path
        d="M47.783 37.219c-2.98-2.98-7.825-2.98-10.805 0-2.978 2.979-2.978 7.826 0 10.805a7.619 7.619 0 005.403 2.233 7.617 7.617 0 005.402-2.233c2.979-2.98 2.979-7.826 0-10.805zm-2.251 7.653a.636.636 0 11-.9.9l-2.251-2.25-2.25 2.25a.637.637 0 11-.9-.9l2.25-2.251-2.251-2.25a.636.636 0 11.9-.901l2.25 2.25 2.251-2.25a.636.636 0 11.9.9l-2.25 2.25 2.25 2.252z"
        fill="#EE2624"
      />
      <Rect
        x={46.8184}
        y={1.10156}
        width={1.66493}
        height={6.65973}
        rx={0.832467}
        transform="rotate(26.198 46.818 1.102)"
        fill={color1}
      />
      <Rect
        x={42.7402}
        y={3.73438}
        width={1.66493}
        height={6.65973}
        rx={0.832467}
        transform="rotate(-63.802 42.74 3.734)"
        fill={color1}
      />
      <Rect
        x={5.50391}
        y={41.5703}
        width={1.27273}
        height={5.09091}
        rx={0.636364}
        transform="rotate(26.198 5.504 41.57)"
        fill={color1}
      />
      <Rect
        x={2.38672}
        y={43.584}
        width={1.27273}
        height={5.09091}
        rx={0.636364}
        transform="rotate(-63.802 2.387 43.584)"
        fill={color1}
      />
      <Circle cx={52.771} cy={12.4096} r={0.954545} fill={color1} />
      <Circle cx={0.907848} cy={38.1813} r={0.636364} fill={color1} />
      <Ellipse opacity={0.1} cx={29.2255} cy={53.1371} rx={19.4091} ry={2.86364} fill={color1} />
    </Svg>
  );
}

export default SvgComponent;
