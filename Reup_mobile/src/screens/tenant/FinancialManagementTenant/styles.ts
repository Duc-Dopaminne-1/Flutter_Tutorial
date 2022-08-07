import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { fonts, WIDTH, colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerCardInfo: {
    flex: 1,
    marginTop: 7,
  },
  separator: {
    flex: 1,
    height: 1,
    paddingHorizontal: 15,
    backgroundColor: Theme.myProfile.container,
  },
  rightComponentHeader: {
    flexDirection: 'row',
  },
  containerImageBtn: {
    alignSelf: 'center',
    width: 34,
    height: 30,
  },
  iconImageBtn: {
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    backgroundColor: Theme.myProfile.imageBtnHeader,
    width: 34,
    height: 30,
    tintColor: Theme.myProfile.iconImageBtn,
  },
  sectionHeader: {
    backgroundColor: Theme.new_member.backgroundColorSectionHeader,
    marginTop: 7,
  },
  iconSectionHeader: {
    tintColor: Theme.new_member.tintColorIconSectionHeader,
    width: 15,
    height: 15,
  },
  titleSectionHeader: {
    fontFamily: fonts.MontserratRegular,
    fontSize: 13,
    color: Theme.new_member.textColorTitleSectionHeader,
  },
  buttonContainer: {
    height: 80,
    backgroundColor: Theme.new_member.backgroundColorContainerSubmitBtn,
  },
  button: {
    width: '88%',
    height: 40,
    marginTop: 13,
    backgroundColor: colors.GREEN_BUTTON,
  },
  buttonDelete: {
    width: '88%',
    height: 40,
    marginTop: 13,
    backgroundColor: Theme.new_member.backgroundColorSubmitBtn,
  },
  containerScrollView: {
    flex: 1,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  contentContainerScrollView: {},
  listContainer: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  contentContainerFlatlist: {
    flexGrow: 1,
  },
  iconArrowStyles: {
    width: 80,
    height: 80,
    alignSelf: 'center',
  },
  textNameBank: {
    alignSelf: 'center',
    fontSize: 11,
    color: '#707070',
    fontFamily: fonts.MontserratLight,
    textAlign: 'center',
  },
  viewItem: {
    width: WIDTH / 3,
    height: WIDTH / 3,
    justifyContent: 'space-between',
    flexDirection: 'column',
    paddingTop: 8,
  },
  viewUnderline: {
    height: 2,
    width: WIDTH / 3,
  },
  viewBankInfo: {
    flex: 1,
    backgroundColor: colors.WHITE,
    marginTop: 7,
  },
  containerEmpty: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textEmpty: {
    fontSize: 15,
    fontFamily: fonts.MontserratSemiBold,
    textAlign: 'center',
    color: 'grey',
  },
  viewEmpty: {
    width: 80,
    height: 100,
  },
});

export default styles;
