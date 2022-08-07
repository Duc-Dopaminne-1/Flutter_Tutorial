import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInput: {
    flex: 1,
  },
  containerScrollView: {
    flex: 1,
    backgroundColor: Theme.new_building.background,
  },
  headerTitle: {
    backgroundColor: Theme.new_building.header_title,
    marginTop: 7,
  },
  content: {
    paddingHorizontal: 15,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: Theme.new_building.background,
    borderRadius: 1,
  },
  buttonContainer: {
    padding: 20,
    flexDirection: 'column',
    marginTop: 10,
    backgroundColor: Theme.new_building.button_background,
    borderRadius: 1,
  },
  button: {
    backgroundColor: Theme.new_building.button,
    width: '90%',
  },
  buttonText: {
    fontSize: 13,
  },
  description: {
    height: 75,
  },
  imagesList: {
    marginTop: 15,
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default styles;
