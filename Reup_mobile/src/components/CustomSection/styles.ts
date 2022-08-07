import { StyleSheet } from 'react-native';
import { Theme } from '../Theme';
import { fonts, colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 50,
    borderBottomColor: colors.GRAY400,
    borderBottomWidth: 1
  },
  titleContain: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingStart: 15,
  },
  title: {
    color: Theme.sectionHeader.title,
    fontSize: 13,
    textAlign: 'left',
    fontFamily: fonts.MontserratSemiBold
  },
  icon: {
    width: 20,
    height: 20,
    marginEnd: 10
  },
  rightComponent: {
    marginTop: 8,
    marginBottom: 8,
    marginEnd: 15,
  },
  containerFilter: {
    marginTop: 8,
    marginBottom: 8,
    marginEnd: 15,
  },
  filter: {
    height: 32,
    width: 32,
  },
  containerCustomText: {
    flex: 1,
    alignItems: 'flex-start'
  }
});

export default styles;
