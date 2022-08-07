import React from 'react';
import { View, Image, FlatList } from 'react-native';
import styles from './styles';
import RIGHT_ARROW from '@res/icons/icon_arrow_right.png';
import { CustomFlatList } from '../FlatList';
import { CustomText } from '../CustomText';
import translate from '@src/localize';
import AddImageItem from '../FlatListItem/AddImageItem';

interface Props {
  images: any[];
  title: string;
  useBottomLine?: boolean;
  bottomLineStyle?: object;
}

const CustomInfoImage = (props: Props) => {
  const {
    images = [],
    title,
    useBottomLine = true,
    bottomLineStyle = {},
  } = props;

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
  };
  const renderImageItem = (item: any, index: number) => {
    return <AddImageItem item={item} index={index} />;
  };

  const renderImages = () => {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <CustomText style={styles.leftText} text={title}></CustomText>
        <CustomFlatList
          data={images}
          contentContainerStyle={styles.listContainer}
          renderItem={(item: any, index: number) => renderImageItem(item, index)}
          horizontal={true}
          onLoad={onLoad} />
      </View>
    );
  };

  const renderBottomLine = () => {
    if (!useBottomLine) return null;
    return <View style={[styles.bottomLine, bottomLineStyle]} />;
  };

  return (
    <View style={styles.container}>
      {renderImages()}
      {renderBottomLine()}
    </View>
  );
};

export default React.memo(CustomInfoImage);
