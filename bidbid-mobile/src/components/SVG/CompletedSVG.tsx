import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const CompletedSVG = () => (
  <Svg width={20} height={18} fill="none">
    <Path
      d="M19.06 11.378a3.01 3.01 0 0 0-1.445-.536 6.71 6.71 0 0 0 .022-.499c0-3-1.742-5.597-4.265-6.844.206-.469.319-.977.262-1.52C13.51.79 12.666.022 11.48.022c-.515 0-1.04.15-1.48.412A2.923 2.923 0 0 0 8.522.021C7.337.02 6.49.789 6.367 1.979c-.057.543.056 1.05.262 1.52-2.524 1.247-4.266 3.843-4.266 6.844 0 .168.01.335.022.5-.548.062-1.034.237-1.445.535-.713.517-1.038 1.236-.914 2.027.12.77.668 1.496 1.393 1.895-.01.649.21 1.323.608 1.814.407.502.966.779 1.575.779.318 0 .644-.075.972-.221.499-.222.883-.576 1.186-.989a7.58 7.58 0 0 0 8.481 0c.303.413.687.765 1.185.989.328.146.655.22.973.22.61 0 1.168-.276 1.575-.777.399-.492.617-1.166.607-1.815.725-.4 1.273-1.126 1.393-1.894.124-.79-.2-1.51-.914-2.028ZM7.558 2.103c.061-.587.385-.885.963-.885.39 0 .803.154 1.079.401l.4.36.4-.36c.275-.247.688-.4 1.08-.4.578 0 .902.296.962.884.139 1.338-1.519 2.638-2.443 3.198-.924-.557-2.58-1.853-2.441-3.198ZM4.086 16.578a1.198 1.198 0 0 1-.483.116c-.249 0-.465-.112-.646-.335a1.668 1.668 0 0 1-.31-1.308l.11-.527-.511-.166c-.507-.166-.963-.667-1.036-1.14-.053-.336.09-.621.434-.87.309-.224.707-.338 1.185-.338 1.09 0 2.278.57 2.805.857-.024 1.082-.321 3.163-1.548 3.711Zm5.914.204a6.394 6.394 0 0 1-3.67-1.158c.552-1.434.503-3.023.499-3.128l-.012-.316-.268-.168c-.066-.041-1.438-.893-2.961-1.134a6.096 6.096 0 0 1-.026-.536c0-2.57 1.518-4.784 3.701-5.815C8.23 5.72 9.628 6.47 9.721 6.52l.279.148.279-.147c.093-.05 1.492-.8 2.458-1.992 2.184 1.03 3.702 3.245 3.702 5.815 0 .18-.011.359-.026.535-1.524.24-2.896 1.093-2.962 1.135l-.268.168-.011.316c-.004.104-.053 1.694.497 3.128A6.396 6.396 0 0 1 10 16.782Zm8.79-3.563c-.074.474-.529.974-1.035 1.14l-.511.166.11.526a1.67 1.67 0 0 1-.311 1.31c-.287.352-.665.423-1.128.216-1.227-.547-1.524-2.63-1.548-3.71.525-.287 1.71-.857 2.805-.857.477 0 .876.114 1.185.338.345.25.487.535.434.871Z"
      fill="#fff"
    />
  </Svg>
);

export default CompletedSVG;