import { View, ViewStyle } from "react-native";
import { styles } from "./styles";
import React from "react";
import { ObjDropdown } from "../Dropdown/DropdownNative";
import SearchBar from "../SearchBar";
import { FilterButton } from "../CustomFilterButton";

interface Props {
  styleContainer?: ViewStyle | ViewStyle[];
  styleDropDown?: ViewStyle | ViewStyle[];
  styleSearch?: ViewStyle | ViewStyle[];
  dataDropDown: ObjDropdown[];
  onChangeDropDown: (obj: ObjDropdown,) => void;
  onChangeText: (text: string) => void;
  value: string
}

const SearchFilterbar = (props: Props) => {
  const { styleContainer, styleDropDown, styleSearch,
    dataDropDown, onChangeDropDown, onChangeText, value = '' } = props;

  return (
    <View style={[styles.container, styleContainer]}>
      <View style={[styles.filterContainer, styleDropDown]}>
        <FilterButton
          selected={0}
          lineBottom={false}
          arrData={dataDropDown}
          textTitle={"Choose"}
          isHideTitle={true}
          containerStyle={styles.containerStyleDropdown}
          textStyle={styles.textStyleDropDown}
          onChangeDropDown={onChangeDropDown} />
      </View>
      <View style={[styles.searchContainer, styleSearch]}>
        <SearchBar
          value={value}
          styleContainer={styles.searchInnerContainer}
          placeholder={"Select building"}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

export default SearchFilterbar;
