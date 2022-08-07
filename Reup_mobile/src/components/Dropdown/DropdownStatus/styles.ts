import { StyleSheet } from 'react-native';
import { fonts, colors } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {

  },
  title: {
    fontSize: 13,
    color: '#333333',
    fontFamily: fonts.MontserratMedium,
    marginBottom: 15
  },
  formBar: {
    backgroundColor: colors.INPUT_BG,
    height: 35,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 2,
    borderColor: 'rgba(219,219,219,0.8)',
    borderWidth: 1,
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 15
  },
  arrowImage: {
    marginTop: 3,
    width: 10,
    height: 10,
    marginRight: 15,
    tintColor: '#707070',
  },
  titleStatus: {
    flex: 1,
    marginStart: 8,
    color: Theme.sectionHeader.title,
    fontSize: 13,
    textAlign: 'left',
    fontFamily: fonts.MontserratRegular
  },
  dropdownContainer: {
    flex: 1
  },
});

export default styles;
