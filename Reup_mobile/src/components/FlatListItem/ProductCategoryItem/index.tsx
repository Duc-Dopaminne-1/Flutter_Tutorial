import React from 'react';
import { View, Image } from 'react-native';
import styles from './styles';
import { CustomText } from '@src/components/CustomText';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { ProductCategoryModel } from './Models';
import { CHECKBOX_UNSELECT } from '@src/constants/icons';
import CHECKBOX from '@res/img/checkbox.png';
import { CustomCheckBox } from '@src/components/CustomCheckBox';
import { IProductCategoryGetResponse } from '@reup/reup-api-sdk/libs/api/shopping_store/models';
type Props = {
  onPressItem: (item: IProductCategoryGetResponse & { isActive: boolean }) => void;
  onPressItemCheck?: (index: number) => void;
  item: IProductCategoryGetResponse & { isActive: boolean };
  index: number;
};

const ProductCategoryItem = (props: Props) => {
  const { item, onPressItem, onPressItemCheck, index } = props;

  return (
    <CustomTouchable onPress={() => onPressItem(item)} style={styles.itemContainer}>
      {onPressItemCheck && <CustomCheckBox
        stylesContainer={styles.checkbox}
        isCheck={item.isActive}
        onPress={() => onPressItemCheck(index)}
      />}
      <CustomText
        numberOfLines={1}
        text={item.name}
        styleContainer={styles.containerText}
        style={styles.itemText} />
    </CustomTouchable>
  );
};

export default React.memo(ProductCategoryItem);
