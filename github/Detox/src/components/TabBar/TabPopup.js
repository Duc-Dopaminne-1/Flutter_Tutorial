import React from 'react';
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SEARCH_TYPE_INDEX} from '../../assets/constants';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {normal, tiny} from '../../assets/theme/metric';
import {useLogin} from '../../screens/Auth/useLogin';
import {rootNavigationRef} from '../../screens/navigate';
import ScreenIds from '../../screens/ScreenIds';
import {IMAGE_RATIO} from '../../utils/ImageUtil';
import CustomIconButton from '../CustomIconButton';

const {height, width} = Dimensions.get('window');
const itemButtonWidth = width / 4 - (normal + 2);
const itemBottonHeight = itemButtonWidth / IMAGE_RATIO.R4x3;
const marginCloseIcon = width / 2 - 25;

const styles = StyleSheet.create({
  containerIcon: {
    flex: 1,
    marginLeft: 7,
    borderRadius: 5,
    height: itemBottonHeight,
    backgroundColor: COLORS.BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleIcon: {...FONTS.regular, fontSize: 10, marginTop: tiny},
  viewContainer: {
    position: 'absolute',
    width: '100%',
    height: height,
    bottom: 0,
    backgroundColor: COLORS.BLACK_05,
    justifyContent: 'flex-end',
  },
  viewMenu: {
    height: 178,
    width: '100%',
    backgroundColor: COLORS.NEUTRAL_WHITE,
    padding: 16,
  },
  closeBtn: {marginTop: 30, marginLeft: marginCloseIcon},
  viewBtn: {justifyContent: 'space-around', flexDirection: 'row'},
});

const TitleMenu = {
  SELL: translate('home.bottomMenu.sell'),
  BUY: translate('home.bottomMenu.buy'),
  TOPENER: translate('home.bottomMenu.topener'),
};

export const TabPopup = ({closeMenu, onPressItem}) => {
  return (
    <View style={styles.viewContainer}>
      <TouchableOpacity onPress={closeMenu} style={{...HELPERS.fill}} />
      <View style={styles.viewMenu}>
        <View style={styles.viewBtn}>
          <MenuItem onPress={onPressItem} title={TitleMenu.SELL} icon={IMAGES.IC_MENU_MODAL_1} />
          <MenuItem onPress={onPressItem} title={TitleMenu.BUY} icon={IMAGES.IC_MENU_MODAL_2} />
          <MenuItem onPress={onPressItem} title={TitleMenu.TOPENER} icon={IMAGES.IC_MENU_MODAL_3} />
        </View>
        <CustomIconButton
          image={IMAGES.IC_CLOSE_MODAL_HOME}
          iconColor={COLORS.RED_57}
          onPress={closeMenu}
          style={styles.closeBtn}
        />
      </View>
    </View>
  );
};

const MenuItem = ({icon, title, onPress}) => {
  return (
    <TouchableOpacity onPress={() => onPress(title)} style={styles.containerIcon}>
      <Image style={{tintColor: COLORS.PRIMARY_A100}} source={icon} />
      <Text style={styles.titleIcon}>{title}</Text>
    </TouchableOpacity>
  );
};

const TabPopupContainer = ({showMenu}) => {
  const {showLogin} = useLogin();
  const closeMenu = () => {
    showMenu(false);
  };

  const onPressItem = type => {
    showMenu(false);
    switch (type) {
      case TitleMenu.SELL:
        showLogin(() => {
          rootNavigationRef.current?.navigate(ScreenIds.GeneralDescription);
        });
        break;
      case TitleMenu.BUY:
        rootNavigationRef.current?.navigate(ScreenIds.Search, {
          tabIndex: SEARCH_TYPE_INDEX.C2C,
        });
        break;
      case TitleMenu.TOPENER:
        showLogin(() => {
          rootNavigationRef.current?.navigate(ScreenIds.PlusService, {createServicesQuickly: true});
        });
        break;
    }
  };

  return <TabPopup closeMenu={closeMenu} onPressItem={onPressItem} />;
};

export default TabPopupContainer;
