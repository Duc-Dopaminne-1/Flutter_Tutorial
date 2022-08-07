import { NextIconGrey } from '../../../assets/icons';
import { BodyText } from '../../../components/';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { ICON_SIZE, SPACING } from '../../../constants/size';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scale } from '../../../utils/responsive';
import themeContext from '../../../constants/theme/themeContext';

const MenuCard = props => {
  const {
    title,
    icon,
    onPress,
    rightComponent,
    content,
    titleStyles,
    style,
    translate,
    onIconPress,
    extraIcon
  } = props;
  const theme = useContext(themeContext);
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <View style={styles.titleContainer}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <BodyText translate={translate} style={[titleStyles]}>
          {title}
        </BodyText>
        {extraIcon}
      </View>
      <TouchableOpacity onPress={onIconPress}>
        {rightComponent ? (
          rightComponent
        ) : content ? (
          <Text style={{ color: theme?.text?.primary }}>{content}</Text>
        ) : (
          <NextIconGrey height={ICON_SIZE.NORMAL} width={ICON_SIZE.NORMAL} />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
export default MenuCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR.White,
    paddingHorizontal: SPACING.Medium,
    paddingVertical: SPACING.Medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  icon: {
    width: scale(36)
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
});
