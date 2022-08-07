import { StyleSheet } from 'react-native';
import { WIDTH, HEIGHT, fonts, colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  sideMenuStyle: {
    marginHorizontal: 0,
    marginVertical: 0,
    margin: 0,
    backgroundColor: colors.WHITE,
  },
  sideMenuContainerStyle: {
    marginHorizontal: 0,
    marginVertical: 0,
    margin: 0,
    backgroundColor: colors.SIDE_MENU.HEADER_BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemMenu: {
    flex: 1,
    flexDirection: 'row',
  },
  itemMenuTextContainer: {
    width: '80%',
  },
  itemMenuExpandContainer: {
    width: '80%',
    margin: 0,
    padding: 0,
  },
  itemRightArrowContainer: {
    width: 30,
    marginLeft: 0,
    marginRight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemMenuText: {
    width: '100%',
    paddingTop: 18,
    paddingBottom: 18,
    color: '#333333',
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
  },
  itemSubMenu: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 18,
    marginBottom: 18,
    padding: 0,
  },
  itemSubMenuText: {
    marginTop: 18,
    marginBottom: 18,
    marginLeft: 25,
    color: '#333333',
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
  },
  itemSubMenuContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemSubMenuDot: {
    width: 6,
    height: 6,
    backgroundColor: '#666666',
  },
  itemRightArrow: {
    marginLeft: 15,
    alignItems: 'center',
  },
  headerView: {
    flex: 1,
    height: 165,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: colors.SIDE_MENU.HEADER_BACKGROUND_COLOR
  },
  headerAvatar: {
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
    resizeMode: 'cover',
    backgroundColor: '#393F4E',
  },
  headerName: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerNameText: {
    color: colors.WHITE,
  },
  headerNameTextSpan: {
    color: '#90CBFF'
  },
  headerPositionName: {
    marginTop: 8,
    color: colors.WHITE,
    width: 'auto',
    alignItems: 'center'
  },
  arrowImage: {
    marginTop: 5,
    width: 9,
    height: 5,
    marginLeft: 7,
    tintColor: colors.WHITE,
  },
  rightImageStyle: {
    marginTop: 20,
  },
  buildingText: {
    color: colors.WHITE,
    fontFamily: fonts.MontserratMedium,
    fontSize: 13
  },
  menuList: {
    flex: 1,
    width: '100%',
    height: HEIGHT - 200,
    paddingTop: 5,
    paddingLeft: 33,
    paddingRight: 33,
    backgroundColor: colors.WHITE
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: colors.BORDER_LINE,
  }
});

export default styles;
