import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const IconPendingReviewSVG = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      d="M23 12c0-.818-.41-1.54-1.038-1.972a1.039 1.039 0 0 1-.348-1.301 2.39 2.39 0 0 0-.088-2.227 2.39 2.39 0 0 0-1.884-1.19 1.039 1.039 0 0 1-.953-.952A2.39 2.39 0 0 0 17.5 2.474a2.39 2.39 0 0 0-2.227-.088 1.039 1.039 0 0 1-1.3-.348 2.39 2.39 0 0 0-3.945 0c-.29.42-.841.567-1.301.348a2.39 2.39 0 0 0-2.227.088 2.39 2.39 0 0 0-1.19 1.884c-.04.508-.444.913-.952.953A2.39 2.39 0 0 0 2.474 6.5a2.39 2.39 0 0 0-.088 2.227c.22.46.071 1.012-.348 1.3A2.39 2.39 0 0 0 1 12c0 .818.41 1.54 1.038 1.972.42.29.567.841.348 1.301a2.39 2.39 0 0 0 .088 2.227 2.39 2.39 0 0 0 1.884 1.19c.508.04.913.444.953.952A2.39 2.39 0 0 0 6.5 21.526a2.39 2.39 0 0 0 2.227.088 1.039 1.039 0 0 1 1.3.348A2.39 2.39 0 0 0 12 23c.818 0 1.54-.41 1.972-1.038.29-.42.841-.567 1.301-.348a2.39 2.39 0 0 0 2.227-.088 2.39 2.39 0 0 0 1.19-1.884c.04-.508.444-.912.952-.953a2.39 2.39 0 0 0 1.884-1.189 2.39 2.39 0 0 0 .088-2.227 1.039 1.039 0 0 1 .348-1.3A2.39 2.39 0 0 0 23 12Z"
      fill="#FA6861"
    />
    <Path d="m7.5 13 3 3 7-7" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default IconPendingReviewSVG;
