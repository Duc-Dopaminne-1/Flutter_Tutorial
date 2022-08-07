import React from 'react';
import { View, FlatList } from 'react-native';
import styles from './styles';
import CustomInfoRow from '@src/components/CustomInfoRow';
import CustomSectionHeader from '../CustomSection';
import { ImageButton } from '../CustomButton';
import { IC_EDIT_SESSION } from '@src/constants/icons';
import CustomInfoImage from '../CustomInfoImage';
import AddImageItem from '../FlatListItem/AddImageItem';

export enum ItemType {
  TEXT,
  IMAGE
}

interface Props {
  titleText: string;
  titleTextStyle?: object;
  containerStyle?: object;
  listData?: any[];
  titleImage?: any;
  onPressEdit?: () => void
  isShowEdit?: boolean;
}

const CustomInfoList = (props: Props) => {
  const {
    titleTextStyle,
    titleText,
    containerStyle = {},
    listData,
    onPressEdit,
    titleImage,
    isShowEdit = false,
  } = props;

  const renderTitleView = () => {
    return (
      <CustomSectionHeader
        style={styles.sectionHeader}
        styleTitle={titleTextStyle}
        title={titleText}
        icon={titleImage}
        rightComponent={isShowEdit ?
          <ImageButton
            onPress={onPressEdit!}
            icon={IC_EDIT_SESSION}
            styleContainer={styles.containerImageBtn}
            styleIcon={styles.iconImageBtn}
          /> : undefined
        }
        styleRightComponent={styles.imageBtnHeader}
      />
    );
  };


  const renderListItem = ({ item, index }: { item: any; index: number }) => {
    return (
      item.itemType === ItemType.IMAGE ?
        <CustomInfoImage
          images={item && item.right}
          title={item && item.left}
          useBottomLine={listData && index < listData.length - 1}
        ></CustomInfoImage>
        :
        <CustomInfoRow
          leftText={item && item.left}
          rightText={item && item.right}
          showRightIcon={item && item.hasRightIcon}
          useBottomLine={listData && index < listData.length - 1}
        />
    );
  };

  const renderListInfo = () => {
    return <FlatList
      bounces={false}
      keyExtractor={(_, index) => index.toString()}
      data={listData}
      renderItem={renderListItem}
    />;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {listData && listData.length > 0 ? renderTitleView() : null}
      {renderListInfo()}
    </View>
  );
};

export default React.memo(CustomInfoList);
