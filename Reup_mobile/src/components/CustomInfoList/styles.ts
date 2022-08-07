import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '../Theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  imageStyle: {
    width: 16,
    height: 16,
    marginRight: 7,
    marginTop: 3,
  },
  iconImageBtn: {
    width: 34,
    height: 30,
  },
  imageBtnHeader: {
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    width: 34,
    height: 30,
  },
  containerImageBtn: {
    alignSelf: 'center',
  },
  sectionHeader: {
    backgroundColor: Theme.category_details.backgroundColorSectionHeader,
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#DBDBDB',
  },
  titleStyle: {
    fontSize: 13,
    color: '#1B72BF',
    fontFamily: fonts.MontserratSemiBold,
  },
});

export default styles;
