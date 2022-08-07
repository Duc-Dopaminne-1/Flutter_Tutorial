import { StyleSheet } from 'react-native';
import { Theme } from '@components/Theme';
import { fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingHorizontal: 15
  },
  viewContain: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  textView: {
    marginLeft: 15,
    marginRight: 10,
    flex: 1,
  },
  title: {
    fontSize: 13,
    textAlign: 'left',
    fontFamily: fonts.MontserratMedium,
    alignSelf: 'flex-start',
    color: Theme.apartments.text
  },
  apartmentOwner: {
    marginTop: 11,
    fontSize: 13,
    textAlign: 'left',
    fontFamily: fonts.MontserratLight,
    alignSelf: 'flex-start',
    color: Theme.apartments.text
  },
  viewMore: {
    marginTop: 11,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  viewMoreContainer: {
    flexDirection: 'row',
  },
  subTitle: {
    flex: 1,
    marginLeft: 5,
    fontSize: 13,
    textAlign: 'left',
    fontFamily: fonts.MontserratMedium,
    alignSelf: 'flex-start',
    color: Theme.apartments.text
  }
});

export default styles;
