import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  content: {
    backgroundColor: Theme.apartments.backgroundColorSectionHeader,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    borderColor: Theme.apartments.border,
    margin: 20
  },
  sectionHeader: {
    backgroundColor: Theme.apartments.backgroundColorSectionHeader
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  closeContainer: {
    width: 40,
    height: '100%',
    alignItems: 'flex-end'
  },
  oldOwnerContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 15
  },
  titleContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  title: {
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
    color: Theme.apartments.text,
    marginRight: 16,
    textAlign: 'left'
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  text: {
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
    color: Theme.apartments.bgButton,
    textAlign: 'left'
  },
  textClose: {
    fontSize: 12,
    fontFamily: fonts.MontserratMedium,
    lineHeight: 15,
    color: Theme.apartments.text
  },
  inputFormSubContainer: {
    width: '100%',
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  buttonContainer: {
    paddingTop: 8,
    paddingBottom: 29,
    backgroundColor: Theme.apartments.backgroundColorSectionHeader,
  },
  button: {
    width: '100%',
    backgroundColor: Theme.apartments.bgButton,
    paddingHorizontal: 0
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleContainer: {
  },
  filter: {
    height: 35,
    width: '100%',
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: 'black',
  },
  touchableStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  viewContain: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20
  }
});

export default styles;
