import React from 'react';
import { View, Image, ViewStyle, ImageStyle } from 'react-native';

import styles from './styles';
// import IconSection from '@src/res//icons/icon-section/icon-section.png';
import { CustomText } from '../CustomText';
import { IC_FILTER_SECTION_HEADER, IC_EDIT_SESSION } from '@src/constants/icons';
import { CustomTouchable } from '../CustomTouchable';

interface Props {
  style?: any;
  title?: string;
  icon?: any;
  isShowIcon?: boolean,
  styleIcon?: any;
  styleTitle?: any;
  styleTitleContain?: ViewStyle;
  rightComponent?: any;
  styleRightComponent?: ViewStyle | ViewStyle[];
  styleContainerFilter?: ViewStyle | ViewStyle[];
  styleFilter?: ImageStyle | ImageStyle[];
  isShowFilter?: boolean;
  isShowEdit?: boolean;
  onPressFilter?: () => void;
}

const CustomSectionHeader = (props: Props) => {
  const {
    title,
    icon,
    style,
    isShowIcon = true,
    styleIcon, styleTitle,
    rightComponent,
    styleRightComponent,
    styleTitleContain,
    styleContainerFilter,
    styleFilter,
    isShowFilter,
    isShowEdit,
    onPressFilter,
  } = props;

  const renderRightButton = (icon: any) => {
    return (
      <CustomTouchable onPress={onPressFilter} style={[styles.containerFilter, styleContainerFilter]} >
        <Image source={icon} resizeMode={'contain'} style={[styles.filter, styleFilter]} />
      </CustomTouchable>
    )
  }

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.titleContain, styleTitleContain]}>
        {isShowIcon ? < Image source={icon ? icon : null} resizeMode={'contain'} style={[styles.icon, styleIcon]} /> : null}
        <CustomText
          style={[styles.title, styleTitle]}
          numberOfLines={1}
          text={title ?? ''}
          styleContainer={styles.containerCustomText} />
      </View>
      <View style={{ flexDirection: 'row' }}>
        {rightComponent ?
          <View style={[styles.rightComponent, styleRightComponent]}>
            {rightComponent}
          </View>
          : null}
        {isShowFilter ?
          renderRightButton(IC_FILTER_SECTION_HEADER)
          : null}
        {isShowEdit ?
          renderRightButton(IC_EDIT_SESSION)
          : null}
      </View>
    </View>
  );
};

export default React.memo(CustomSectionHeader);
