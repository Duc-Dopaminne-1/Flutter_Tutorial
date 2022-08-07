import * as React from 'react';
import Svg, { SvgProps, Circle, Path } from 'react-native-svg';

const ContactSVG = (props: SvgProps) => (
  <Svg width={40} height={40} fill="none" {...props}>
    <Circle cx={20} cy={20} r={20} fill="#F9423A" />
    <Circle cx={19.822} cy={16.222} stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" r={3.822} />
    <Path
      clipRule="evenodd"
      d="M13.6 25.361a1.77 1.77 0 0 1 .176-.776c.366-.732 1.398-1.12 2.255-1.296.618-.132 1.244-.22 1.875-.264a20.043 20.043 0 0 1 3.507 0c.63.044 1.257.132 1.875.264.857.175 1.889.527 2.255 1.296a1.816 1.816 0 0 1 0 1.56c-.366.768-1.398 1.12-2.255 1.288a12.58 12.58 0 0 1-1.875.271c-.95.08-1.904.095-2.856.044-.22 0-.432 0-.651-.044a12.342 12.342 0 0 1-1.868-.27c-.864-.17-1.889-.52-2.262-1.29a1.823 1.823 0 0 1-.176-.783Z"
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ContactSVG;
