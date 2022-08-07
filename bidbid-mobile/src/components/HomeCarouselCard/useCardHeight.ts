import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { screenHeight } from '@/vars';

const useCardHeight = () => {
  const insets = useSafeAreaInsets();

  return screenHeight - 115 - (insets.top + insets.bottom);
};

export default useCardHeight;
