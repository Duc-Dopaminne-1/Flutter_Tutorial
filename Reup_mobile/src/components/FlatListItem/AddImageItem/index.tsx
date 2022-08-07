import React from 'react';
import { View, Image } from "react-native";
import FastImage from "react-native-fast-image";
import { CANCEL } from '@src/constants/icons';
import { styles } from './styles';
import { CustomTouchable } from '@src/components/CustomTouchable';
import RectangleAvatar from '@src/components/RectangleAvatar';

interface Props {
  item: any;
  index: number;
  deleteOnpress?: (index: number) => void;
}

const AddImageItem = (props: Props) => {

  const { item, index, deleteOnpress } = props;

  return (
    <View>
      <RectangleAvatar width={80} height={80} avatar={item} styleContainer={styles.imageImage} />
      {deleteOnpress && <CustomTouchable style={styles.removeIcon} onPress={() => deleteOnpress(index)}>
        <Image resizeMode={'contain'} style={styles.removeIcon} source={CANCEL} />
      </CustomTouchable>}
    </View >
  );
};

export default React.memo(AddImageItem);
