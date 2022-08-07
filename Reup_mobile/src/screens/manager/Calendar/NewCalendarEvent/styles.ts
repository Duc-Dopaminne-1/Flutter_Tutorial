import { StyleSheet } from "react-native";
import { Theme } from "@src/components/Theme";
import { fonts, WIDTH } from "@src/constants/vars";

export const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: 6,
    backgroundColor: Theme.calendar.whiteBackground
  },
  sectionHeaderIcon: {
    width: 15, height: 15,
    tintColor: Theme.sectionHeader.title,
  },
  containerScrollView: {
    flex: 1,
    marginBottom: 6,
    paddingHorizontal: 16,
    backgroundColor: Theme.calendar.whiteBackground
  },
  bottomText: {
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    color: Theme.calendar.textColorSubmit,
  },
  bottomButton: {
    width: "88%",
    height: 40,
    marginVertical: 13,
    backgroundColor: Theme.calendar.submitButton,
  },
  bottomButtonContainer: {
    backgroundColor: Theme.calendar.whiteBackground,
  },
  inputStyle: {
    color: Theme.transfer_apartment.inputStyle,
    fontSize: 11
  },
  commentInput: {
    height: 75,
    alignItems: "baseline"
  },
  filter: {
    height: 35,
    width: "100%",
  },
  dateTimePickerStyle: {
    width: "100%"
  },
  dateTimePickerText: {
    width: '100%',
    marginBottom: 15,
    fontSize: 13, fontFamily: fonts.MontserratMedium,
  },
  descriptionsContainer: {
    height: 75,
    alignSelf: 'baseline'
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: 'black',
  },
});
