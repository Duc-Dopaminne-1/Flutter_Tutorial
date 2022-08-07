import Container from "@src/components/Container";
import React, { useState } from "react";
import translate from "@src/localize";
import { View } from "react-native-animatable";
import { styles } from "../CategoryDetails/styles";
import SearchBar from "@src/components/SearchBar";
import { FilterButton } from "@src/components/CustomFilterButton";
import { ObjDropdown } from "@src/components/Dropdown/DropdownNative";
import { CustomFlatList } from "@src/components/FlatList";
import CategoryDetailsItem from "@src/components/FlatListItem/CategoryDetailsItem";
import CustomSectionHeader from "@src/components/CustomSection";
import { ICON_CATEGORY, ICON_DELETE } from "@src/constants/icons";
import { ImageButton, CustomButton } from "@src/components/CustomButton";

export interface ItemFlatList {
  name: string;
  image: string;
  isChecked: boolean;
  description: string;
  isActive: boolean;
}

const CategoryDetails = () => {
  const [text, setText] = useState('');
  const onChangeText = (text: string) => {
    setText(text);
  };

  const onChangeDropDownBuilding = (obj: ObjDropdown) => {

  };

  const onChangeDropDownStatus = (obj: ObjDropdown) => {

  };

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
  };

  const onPress = (obj: ItemFlatList) => {

  };

  const onPressActiveBtn = (obj: ItemFlatList) => {

  };

  const onPressDeleteBtn = () => {

  };

  const onPressDeleteCategoryBtn = () => {

  };

  const dataBuilding: ObjDropdown[] = [
    { _key: "building_1", _value: "Building (S.A)" },
    { _key: "building_2", _value: "Building (A.A)" },
    { _key: "building_3", _value: "Building (C.A)" },
    { _key: "building_4", _value: "Building (D.A)" },
    { _key: "building_5", _value: "Building (E.A)" },
  ];

  const dataStatus: ObjDropdown[] = [
    { _key: "status_1", _value: "All status" },
    { _key: "status_2", _value: "Sold" },
    { _key: "status_3", _value: "Ready for sale" },
  ];

  const dataFlatlist: ItemFlatList[] = [
    {
      name: "Sam Direction",
      description: "Air Conditioner",
      image: "https://www.energy.gov/sites/prod/files/HomeHVACb_0.jpg",
      isChecked: false,
      isActive: true,
    },
    {
      name: "Maecenas Augue",
      description: "Electrical System",
      image: "https://www.dienphatdat.com/files/upload/TIN-TUC/quy-trinh-lap-dat-tu-dien-an-toan-01.jpg",
      isChecked: false,
      isActive: false,
    },
    {
      name: "Donec Interdum",
      description: "Fire Pump",
      image: "https://lh3.googleusercontent.com/proxy/dVH06ip3bK45jrR3xvcY6117RwrWuW8uGJyHYLOFtmptzgYFKy_S1UJ3PsYUQOwrDA9--fCrdwO0NEUkos2XHkBkEqZAVqFSb094FUvcDy8mDgEFyk8BRbYh3YSXQCuLr0FIilitLTa9oPJOsLfXY0YHNBafVvv4Zhp-ETgUzVGU3DLCqQs47-jKV7pp7DnsXCEpbvg",
      isChecked: false,
      isActive: true,
    },
    {
      name: "Nulla Facilisi",
      description: "Lift",
      image: "https://wwwcibesliftcom.cdn.triggerfish.cloud/uploads/sites/7/2018/08/lift-in-university-building-front-1170x700.jpg",
      isChecked: false,
      isActive: true,
    },
    {
      name: "Donec Diam",
      description: "Sewages & Plumbing",
      image: "https://4.imimg.com/data4/GE/IC/MY-31032383/plumbing-work-service-500x500.jpg",
      isChecked: false,
      isActive: false,
    },
  ];

  return (
    <Container isShowHeader={true} title={translate("category_details.title_header")}>
      <View style={styles.container}>
        <View style={styles.searchFilterBar}>
          <SearchBar
            value={text}
            styleContainer={styles.searchContainer}
            placeholder={"Search item..."}
            onChangeText={onChangeText}
          />
          <View style={styles.groupFilters}>
            <FilterButton
              mainContainerStyle={styles.mainContainerFilterBuilding}
              textStyle={styles.textStyleFilterBuilding}
              arrData={dataBuilding}
              onChangeDropDown={onChangeDropDownBuilding}
              lineBottom={false}
              textTitle={'Choose'}
              isHideTitle={true}
              selected={0}
            />
            <FilterButton
              mainContainerStyle={styles.mainContainerFilterStatus}
              textStyle={styles.textStyleFilterStatus}
              arrData={dataStatus}
              onChangeDropDown={onChangeDropDownStatus}
              lineBottom={false}
              textTitle={'Choose'}
              isHideTitle={true}
              selected={0}
            />
          </View>
        </View>
        <View style={styles.body}>
          <CustomSectionHeader
            style={styles.sectionHeader}
            styleTitle={styles.titleSectionHeader}
            title={translate("category_details.title_section_header")}
            icon={ICON_CATEGORY}
            rightComponent={
              <ImageButton
                onPress={onPressDeleteBtn}
                icon={ICON_DELETE}
                styleContainer={styles.containerImageBtn}
                styleIcon={styles.iconImageBtn}
              />
            }
            styleRightComponent={styles.imageBtnHeafer}
          />
          <CustomFlatList
            onLoad={onLoad}
            style={styles.customFlatlist}
            contentContainerStyle={styles.contentContainerFlatlist}
            data={dataFlatlist}
            renderItem={(item: ItemFlatList) => {
              return <CategoryDetailsItem
                object={item}
                onPress={onPress}
                onPressActiveBtn={onPressActiveBtn}
              />;
            }}
          />
        </View>
        <View style={styles.containerDeleteCategoryBtn}>
          <CustomButton
            style={styles.deleteCategoryBtn}
            text={translate("category_details.delete_category")}
            textStyle={styles.textDeleteCategoryBtn}
            onPress={onPressDeleteCategoryBtn}
          />
        </View>
      </View>
    </Container>
  );
};

export default CategoryDetails;
