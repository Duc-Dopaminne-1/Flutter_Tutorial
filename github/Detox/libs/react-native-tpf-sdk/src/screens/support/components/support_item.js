import { useNavigation } from '@react-navigation/native';
import { ICNext } from '../../../assets/icons';
import AppText from '../../../components/app_text';
import Divider from '../../../components/divider';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { CUSTOM_COLOR } from '../../../constants/colors';
import SCREENS_NAME from '../../../constants/screens';
import { SPACING } from '../../../constants/size';
import { handleTouchItem } from '../../../helpers/handleTouchItem';
import React, { useCallback, useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { scale } from '../../../utils/responsive';
import themeContext from '../../../constants/theme/themeContext';

const SupportItem = ({ item, onClose, route, ...props }) => {
  const theme = useContext(themeContext);
  const navigation = useNavigation();
  const { topenId } = useSelector(state => state.auth);
  const onPress = useCallback(
    event => {
      handleTouchItem(event, 'FAQSupportItem', route, item, topenId);
      navigation.navigate(SCREENS_NAME.SUPPORT_DETAIL_SCREEN, { item });
    },
    [item, navigation, route, topenId]
  );

  return (
    <>
      <TouchableOpacity style={[styles.container]} activeOpacity={0.8} onPress={onPress}>
        <View>
          <View style={styles.row}>
            <AppText translate semiBold style={[styles.title]}>
              {'support.request_code'}
              {item?.id || ''}
            </AppText>
            <View style={styles.dot} />
            <Text style={[styles.time, { color: theme.text.secondary }]}>{item?.date}</Text>
          </View>
          <AppText translate style={[styles.description]}>
            {item?.requestType}
          </AppText>
        </View>
        <ICNext />
      </TouchableOpacity>
      <Divider />
    </>
  );
};

export default React.memo(SupportItem);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.Medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(8)
  },
  dot: {
    height: scale(4),
    width: scale(4),
    backgroundColor: CUSTOM_COLOR.OsloGray,
    borderRadius: scale(2),
    marginHorizontal: scale(6)
  },
  title: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  description: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  time: {
    fontSize: FONT_SIZE.Small,
    lineHeight: LINE_HEIGHT.Small
  },
  close: {
    color: CUSTOM_COLOR.PersianGreen,
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  }
});
