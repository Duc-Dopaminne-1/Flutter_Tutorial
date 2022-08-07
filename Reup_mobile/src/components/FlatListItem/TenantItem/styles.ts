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
    paddingHorizontal: 14,
    paddingTop: 17,
    paddingBottom: 16,
  },
  status: {
    textAlignVertical: 'bottom',
    height: 20,
    color: Theme.staff.button,
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
    alignSelf: 'flex-end',
    textAlign: 'right',
    right: 0
  },
  image: {
    marginRight: 15
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  name: {
    height: 25,
    color: Theme.tenant_detail.nameText,
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
    alignSelf: 'flex-start'
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
