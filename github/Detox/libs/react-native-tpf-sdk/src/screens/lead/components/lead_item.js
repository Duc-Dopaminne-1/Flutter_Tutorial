import { useNavigation } from '@react-navigation/native';
import { ICTelephone } from '../../../assets/icons';
import { default_avatar_gray } from '../../../assets/images';
import { BodyText, SubHead, CheckBox } from '../../../components/';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../../constants/colors';
import SCREENS_NAME from '../../../constants/screens';
import { BORDER_RADIUS, ICON_SIZE, SPACING } from '../../../constants/size';
import { handleTouchItem } from '../../../helpers/handleTouchItem';
import React, { useContext } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { scale } from '../../../utils/responsive';
import themeContext from '../../../constants/theme/themeContext';

const LeadItem = ({ item, deleteMode, checked, onCheckItem, route }) => {
  const navigation = useNavigation();
  const theme = useContext(themeContext);
  const { topenId } = useSelector(state => state.auth);
  const onPress = event => {
    handleTouchItem(event, 'LeadDetail', route, item, topenId);
    navigation.navigate(SCREENS_NAME.LEAD_DETAIL_SCREEN, {
      item
    });
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          <View style={styles.itemContent}>
            <View style={styles.avatar}>
              {item?.image ? (
                <FastImage source={{ uri: item?.image }} style={styles.image} />
              ) : (
                <FastImage source={default_avatar_gray} style={styles.image} />
              )}
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.row}>
                {item?.name ? <BodyText semiBold>{item?.name}</BodyText> : null}
                {item?.status === 'N' ? (
                  <View style={styles.viewNew}>
                    <SubHead translate semiBold style={styles.subHead}>
                      {'common.new'}
                    </SubHead>
                  </View>
                ) : null}
              </View>
              {item?.phone ? (
                <View style={styles.contactValue}>
                  <ICTelephone
                    style={styles.contactIcons}
                    width={ICON_SIZE.SMALL}
                    height={ICON_SIZE.SMALL}
                  />
                  <SubHead color={theme?.text?.secondary} medium>
                    {item.phone}
                  </SubHead>
                </View>
              ) : null}
              {item?.notes ? (
                <View style={styles.contactValue}>
                  <SubHead
                    numberOfLines={2}
                    medium
                    style={styles.note}
                    color={theme?.text?.secondary}>
                    {item?.notes}
                  </SubHead>
                </View>
              ) : null}
            </View>
          </View>
          {deleteMode ? (
            <CheckBox
              style={{
                paddingVertical: SPACING.Normal,
                paddingLeft: SPACING.Medium
              }}
              checked={checked}
              onChange={value => onCheckItem(value, item)}
            />
          ) : null}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LeadItem;

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: SPACING.Medium
  },
  infoContainer: {
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  avatar: {
    paddingRight: scale(12)
  },
  image: {
    width: scale(48),
    height: scale(48)
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center'
  },
  contactValue: {
    marginTop: scale(2),
    flexDirection: 'row',
    alignContent: 'center'
  },
  contactIcons: { marginRight: SPACING.XSmall, marginTop: scale(2) },
  contactButton: {
    width: scale(85),
    height: scale(32),
    borderRadius: BORDER_RADIUS
  },
  buttonLabel: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  sendBtn: {
    width: scale(50),
    alignItems: 'center',
    height: scale(20, false),
    justifyContent: 'center'
  },
  subHead: {
    fontSize: FONT_SIZE.Small,
    color: TEXT_COLOR.White
  },
  viewNew: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: SPACING.Normal,
    paddingVertical: scale(3),
    backgroundColor: BACKGROUND_COLOR.GreenLight,
    marginStart: SPACING.Small
  },
  note: {
    width: scale(278)
  }
});
