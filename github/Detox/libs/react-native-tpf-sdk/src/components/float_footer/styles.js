import { StyleSheet } from 'react-native';
import { DEVICE_WIDTH, SPACING } from '../../constants/size';
import { isIphoneX } from '../../helpers/device';
import { CUSTOM_COLOR } from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: SPACING.Medium,
    paddingBottom: isIphoneX ? 0 : SPACING.BottomButton,
    borderTopWidth: 1,
    borderColor: CUSTOM_COLOR.GalleryDark,
    paddingHorizontal: SPACING.Medium,
    bottom: 0,
    width: DEVICE_WIDTH
  }
});

export default styles;
