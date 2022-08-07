import { StyleSheet } from 'react-native';
import { HEADER_COLOR } from '../../constants/colors';
import { HEADER_HEIGHT, ICON_SIZE, SPACING, STATUS_BAR_HEIGHT } from '../../constants/size';
import { Shadow } from '../../constants/stylesCSS';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    height: HEADER_HEIGHT,
    paddingHorizontal: 10,
    backgroundColor: HEADER_COLOR
  },
  shadow: {
    ...Shadow
  },
  wrapper: {
    width: '100%',
    marginTop: STATUS_BAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  leftButton: {
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  right: {
    right: SPACING.Medium,
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    backgroundColor: 'transparent'
  },
  title: {
    alignSelf: 'center',
    flex: 1,
    paddingRight: ICON_SIZE.MEDIUM
  }
});
