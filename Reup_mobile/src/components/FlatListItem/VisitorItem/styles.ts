import { StyleSheet } from 'react-native';
import { fonts, WIDTH } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const paddingHorizontal = 16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.tenant_detail.contentBackground,
    paddingTop: 21,
    paddingBottom: 16,
    paddingHorizontal: paddingHorizontal,
  },
  checkInButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 15,
  },
  idRoomText: {
    color: Theme.visitor_list.id_room_text,
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
  },
  idRoomContainer: {
    width: (WIDTH - paddingHorizontal * 2) / 3,
    alignItems: 'flex-start',
  },
  buttonText: {
    color: Theme.visitor_list.text_button,
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
  },
  buttonContainer: {
    width: (WIDTH - paddingHorizontal * 2) / 3,
    height: 35,
    justifyContent: 'center',
  },
  titleStyle: {
    color: Theme.visitor_list.name_text,
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
  },
  valueStyle: {
    color: Theme.visitor_list.name_text,
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
  },
  titleContainerStyle: {
    width: (WIDTH - paddingHorizontal * 2) / 3,
    alignItems: 'flex-start',
  },
  valueContainerStyle: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statusContainer: {
    height: 25,
    flex: 1 / 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    fontFamily: fonts.MontserratMedium,
  },
});

export default styles;
