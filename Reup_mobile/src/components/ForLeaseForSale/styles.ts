import { StyleSheet } from 'react-native';
import { fonts } from '@constants/vars';
import { Theme } from '../Theme';
// styles
const styles = StyleSheet.create({
  containers: { flex: 1 },
  headers: {
    height: 47,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  lineContainer: {
    flexDirection: 'row',
    marginHorizontal: 15
  },
  headersLeft: {
    flex: 1,
    marginLeft: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginHorizontal: 7,
    fontSize: 13,
    lineHeight: 16,
    fontFamily: fonts.MontserratSemiBold,
    color: '#1B72BF',
  },
  filter: {
    width: 84,
    height: 30,
    marginRight: 15,
    alignItems: 'center',
  },
  textFilter: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts.MontserratLight,
    color: Theme.for_lease_for_sale.texColor,
  },
  iconArrow: {},
  line: {
    width: '100%',
    height: 1,
  },
  viewMore: {
    backgroundColor: '#D0E9FF',
    width: 130,
    marginVertical: 20
  },
  textViewMore: {
    color: '#1B72BF',
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts.MontserratLight,
  },
  iconViewMore: {
    width: 8,
    height: 7,
  },
});

export default styles;
