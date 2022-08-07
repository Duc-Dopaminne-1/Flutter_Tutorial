import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme/index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 7,
  },
  listContainer: {
    flex: 1,
  },
  containerScrollView: {
    flex: 1,
    backgroundColor: Theme.new_delivery.background,
    marginBottom: 6,
  },
  headerTitle: {
    backgroundColor: Theme.new_delivery.header_title,
    marginTop: 7,
  },
  content: {
    width: '100%',
    marginTop: 12,
    paddingHorizontal: 15,
    backgroundColor: Theme.new_delivery.background,
    borderRadius: 1,
  },
  fieldInput: {
    height: 35,
    width: '100%',
  },
  country: {
    marginTop: 10,
  },
  textStyle: {
    width: '90%',
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: Theme.new_delivery.text,
  },
  buttonContainer: {
    padding: 15,
    flexDirection: 'column',
    height: 66,
    backgroundColor: Theme.new_delivery.background,
    borderRadius: 1,
  },
  button: {
    backgroundColor: Theme.new_delivery.button,
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default styles;
