import React from 'react';
import { View, ViewStyle } from 'react-native';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import { CustomText } from '@src/components/CustomText';
import { CustomButton } from '@src/components/CustomButton';
import translate from '@src/localize';
import RectangleAvatar from '@src/components/RectangleAvatar';
import { AVATAR_DEFAULT_RECTANGLE } from '@src/constants/icons';

interface Props {
  thumbnail: any,
  name: string,
  content: string,
  onPressLike?: (item: any) => void,
  onPressReply?: (item: any) => void,
}

const ItemComment = (prop: Props) => {
  const { thumbnail, name, content, onPressLike, onPressReply } = prop;
  return (
    <View style={styles.container} >
      <RectangleAvatar styleContainer={styles.thumbnail}
        imageDefault={AVATAR_DEFAULT_RECTANGLE} avatar={thumbnail} />
      <View style={styles.contents}>
        <CustomText styleContainer={styles.styleContainer} style={styles.name} text={name} />
        <CustomText styleContainer={styles.styleContainer} style={styles.content} text={content} />
        <View style={{ flexDirection: 'row' }}>
          <CustomButton
            onPress={onPressLike && onPressLike.bind(undefined, name)}
            style={styles.buttonContainer}
            textStyle={styles.textAction}
            text={translate('requests.like')} />
          <CustomButton
            onPress={onPressReply && onPressReply.bind(undefined, name)}
            style={styles.buttonContainer}
            textStyle={styles.textAction}
            text={translate('requests.reply')} />
        </View>
      </View>
    </View>
  );
};

export default React.memo(ItemComment);
