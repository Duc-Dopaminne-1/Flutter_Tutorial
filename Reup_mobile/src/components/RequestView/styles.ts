import { StyleSheet } from 'react-native';
import { Theme } from '../Theme';
import { WIDTH, fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: Theme.maintenanceRequest.backgroundColor,
    paddingTop: 30,
    paddingBottom: 50,
  },

  item: {
    width: WIDTH / 2,
    height: WIDTH / 2,
  },
  headers: {
    height: 47,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  headersLeft: {
    flex: 1,
    marginLeft: 15,
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
  search: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.staff.staff_add_position,
    borderRadius: 2
  },
  iconSearch: {
    width: 20,
    height: 20
  },
  textSearch: {
    fontSize: 12,
    lineHeight: 24,
    fontFamily: fonts.MontserratLight,
    color: 'white'
  },
  line: {
    backgroundColor: '#DBDBDB',
    width: WIDTH,
    height: 1,
  },
});

export default styles;
