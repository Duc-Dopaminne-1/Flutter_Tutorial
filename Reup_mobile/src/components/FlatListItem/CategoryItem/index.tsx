import React from "react";
import { View } from "react-native";
import { CustomText } from "@src/components/CustomText";
import { styles } from "@src/components/FlatListItem/CategoryItem/styles";
import IMAGE_DOT_LINE from "src/res/icons/ForLeaseForSale/image-line-dot.png";

interface Props {
  data: ItemFlatList,
}

export interface ItemFlatList {
  name: string;
}

const CategoryItem = (props: Props) => {
  const { data } = props;

  const renderNameCategory = () => {
    return <CustomText
      numberOfLines={1}
      text={data.name}
      style={styles.textCategory}
      styleContainer={styles.containerTextCategory} />;
  };

  return (
    <View style={styles.container}>
      {renderNameCategory()}
    </View>
  );
};

export default React.memo(CategoryItem);
