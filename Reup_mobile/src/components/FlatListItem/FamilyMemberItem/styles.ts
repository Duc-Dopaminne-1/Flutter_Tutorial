import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.tenant_detail.contentBackground,
    paddingHorizontal: 17,
    paddingTop: 17,
    paddingBottom: 16,
  },
  checkBoxView: {
    width: 35,
    height: 35,
    justifyContent: 'center',
  },
  checkBox: {
    height: 22,
    width: 22,
    marginRight: 11,
  },
  image: {
    marginRight: 15,
  },
  contentContainer: {
    flexShrink: 1,
    justifyContent: 'space-around',
    alignItems: 'flex-start'
  },
  name: {
    height: 25,
    color: Theme.tenant_detail.nameText,
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
  },
  description: {
    textAlignVertical: 'bottom',
    height: 20,
    color: Theme.tenant_detail.descriptionText,
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
  },
});

export default styles;
