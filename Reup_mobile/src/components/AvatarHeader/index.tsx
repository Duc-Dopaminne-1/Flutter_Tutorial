import React, { useState } from 'react';
import { View, ImageBackground, Image, } from 'react-native';
import { CustomHeader } from '../CustomHeader';
import { HEADER_BACKGROUND, BACK, IC_EDIT_AVATAR } from '@src/constants/icons';
import styles from './styles'
import { DefaultAvatar } from '../DefaultAvatar';
import { CustomText } from '../CustomText';
import NavigationActionsService from '@src/navigation/navigation';
import { CustomTouchable } from '../CustomTouchable';
import CircleAvatar from '../CircleAvatar';
import { HEIGHT } from '@src/constants/vars';
import DropdownNative, { ObjDropdown } from '../Dropdown/DropdownNative';

interface Props {
  source?: any,
  name?: string,
  description?: string,
  isShowEditAvatar?: boolean,
  avatar?: string,
  onPress?: () => void,
  hasDropDown?: boolean,
  dataDropDown?: ObjDropdown[]
}
const AvatarHeader = (props: Props) => {
  const { source, description, name, isShowEditAvatar,
    onPress, avatar, hasDropDown = false, dataDropDown } = props;
  const [building, setBuilding] = useState<number>(0);

  const renderMainHeader = () => {
    const heightAvatar = (HEIGHT * 0.2053) * 0.4640
    return (
      <View style={styles.mainHeaderContainer}>
        {isShowEditAvatar ? <CustomTouchable onPress={onPress}>
          <CircleAvatar
            name={name ?? ''}
            size={heightAvatar}
            avatar={avatar} />
          <Image source={IC_EDIT_AVATAR} resizeMode={'contain'} style={styles.logoEdit} />
        </CustomTouchable> : <DefaultAvatar avatar={avatar} size={heightAvatar} name={name ?? ''} />}
        <CustomText style={styles.title} text={name ?? ''} />
        {hasDropDown ? <DropdownNative
          arrData={dataDropDown}
          containerStyle={styles.headerPositionName}
          selected={building}
          lineBottom={true}
          onChangeDropDown={(obj) => {
            setBuilding(obj && obj._index ? obj._index : 0)
          }}
          linearGradientColors={["transparent", "transparent"]}
          textStyle={styles.buildingText}
          iconRightStyle={styles.arrowImage}
          isHideTitle={true}
          textTitle={'Choose Building'}
        /> : <CustomText style={styles.des} text={description ?? ''} />}
      </View >
    );
  };

  const onPressLeftAction = () => {
    NavigationActionsService.pop()
  }

  return (
    <ImageBackground source={source ? source : HEADER_BACKGROUND} style={styles.imageBackground} >
      <CustomHeader
        customComponent={renderMainHeader()}
        styleHeader={styles.containerHeader}
        leftImage={BACK}
        leftImageStyle={styles.leftImageStyle}
        leftAction={onPressLeftAction} />
    </ImageBackground>
  )
};

export default React.memo(AvatarHeader);
