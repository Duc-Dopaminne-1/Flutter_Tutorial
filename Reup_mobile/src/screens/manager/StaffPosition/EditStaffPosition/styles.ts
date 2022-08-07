import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  addStaffPositionContainer: {
    backgroundColor: 'white',
    marginTop: 7,
  },
  bottomButtonContainer: {
    paddingHorizontal: 22,
    backgroundColor: 'white',
    paddingVertical: 13,
    marginTop: 7,
  },
  sectionIconStyle: {
    tintColor: '#1B72BF',
  },
  inputFormSubContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 25,
  },
  contentContainer: {
    flex: 1,
  },
  createButton: {
    backgroundColor: Theme.staff.staff_create_position,
  },
  containerMain: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  containerScrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 13,
  },
});

export default styles;
