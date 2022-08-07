import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const InstagramSVG = (props: SvgProps) => (
  <Svg width={16} height={16} fill="none" {...props}>
    <Path
      d="M8 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0-1.334a3.333 3.333 0 1 1 0 6.667 3.333 3.333 0 0 1 0-6.667Zm4.333-.166a.833.833 0 1 1-1.667 0 .833.833 0 0 1 1.667 0ZM8 2.666c-1.65 0-1.919.005-2.686.039-.523.025-.874.095-1.199.221-.29.112-.498.246-.72.469-.209.202-.37.448-.47.72-.126.327-.196.677-.22 1.199-.035.736-.039.993-.039 2.686 0 1.649.005 1.918.039 2.686.025.522.095.873.22 1.198.114.29.247.498.469.72.224.224.433.358.72.468.329.128.68.198 1.2.222.736.035.993.039 2.686.039 1.649 0 1.918-.005 2.686-.039.521-.024.872-.094 1.198-.22a1.95 1.95 0 0 0 .72-.468 1.93 1.93 0 0 0 .469-.72c.127-.329.197-.68.221-1.2.035-.736.039-.994.039-2.686 0-1.65-.005-1.919-.039-2.686-.024-.522-.094-.874-.221-1.199a1.94 1.94 0 0 0-.469-.72 1.922 1.922 0 0 0-.72-.47c-.326-.126-.677-.196-1.198-.22C9.95 2.67 9.692 2.666 8 2.666Zm0-1.333c1.811 0 2.037.007 2.748.04.71.033 1.193.145 1.618.31.44.17.811.399 1.182.769.339.333.601.736.768 1.181.165.425.277.909.31 1.619.032.71.04.936.04 2.748 0 1.811-.006 2.037-.04 2.748-.033.71-.145 1.193-.31 1.618-.167.446-.429.849-.768 1.182a3.277 3.277 0 0 1-1.182.768c-.424.165-.908.277-1.618.31-.711.032-.937.04-2.748.04-1.812 0-2.038-.006-2.748-.04-.71-.033-1.194-.145-1.619-.31a3.26 3.26 0 0 1-1.181-.768 3.27 3.27 0 0 1-.769-1.182c-.165-.424-.277-.908-.31-1.618-.031-.711-.04-.937-.04-2.748 0-1.812.007-2.038.04-2.748.033-.711.145-1.194.31-1.619.167-.445.43-.848.769-1.181.333-.34.736-.602 1.181-.769.425-.165.908-.277 1.619-.31.71-.031.936-.04 2.748-.04Z"
      fill="#F9423A"
    />
  </Svg>
);

export default InstagramSVG;
