
import { StyleProp, TextStyle, ViewStyle, View, Text, Image } from 'react-native';
import styles from './styles';
import React, { useState } from 'react';
import { CustomFlatList } from '../FlatList';
import { CustomCheckBox } from '../CustomCheckBox';
import { CustomButton } from '../CustomButton';
import translate from '@src/localize';
import { CustomText } from '../CustomText';
import { clone } from 'lodash';
import SearchBar from '../SearchBar';
import { CustomTouchable } from '../CustomTouchable';

interface CustomSelectProps {
  checkListData: MultiSelectData[];
  selectedList: string[];
  onDone: (selectedList: string[]) => void;
  onCloseModal: () => void;
  type: CustomSelectType;
  title?: string;
  titleStyles?: TextStyle;
  headerStyle?: ViewStyle;
  searchPlaceHolder?: string;
}

export enum CustomSelectType {
  SingleSelect,
  MultiSelect
}

export type MultiSelectData = {
  _key: string,
  _value: string,
}


const CustomSelect = (props: CustomSelectProps) => {
  const [selectedData, setSelecetedData] = useState<string[]>(props.selectedList);
  const [displayData, setDisplayData] = useState<MultiSelectData[]>(props.checkListData);
  const [text, setText] = useState('');
  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {

  };
  const isShowCloseButton = props.type === CustomSelectType.SingleSelect && props.checkListData.length < 1;

  const onSearchTextChange = (text: string) => {
    setText(text);
    let cloneData: MultiSelectData[] = clone(props.checkListData);
    const searchText = text.toLocaleLowerCase();
    cloneData = props.checkListData.filter((item: MultiSelectData) => {
      return item._value.toLocaleLowerCase().match(searchText);
    });
    if (!text || text === '') {
      setDisplayData(props.checkListData);
    } else if (cloneData.length <= 0) {
      setDisplayData([]);
    } else if (cloneData.length > 0) {
      setDisplayData(cloneData);
    }

  };

  const onPressCheckBox = (item: MultiSelectData, index: number) => {
    let cloneData = clone(selectedData);

    if (cloneData.some(selectedItem => selectedItem === item._key)) {
      cloneData = cloneData.filter((selecteItem) => {
        return selecteItem !== item._key;
      });
    } else {
      cloneData.push(item._key);
    }
    setSelecetedData(cloneData);

  };

  const onDone = () => {
    props.onDone(selectedData);
  };

  const onPressSingleItem = (item: any, index: number) => {
    let cloneData = clone(selectedData);
    cloneData = [item._key];
    setSelecetedData(cloneData);

    props.onDone([item._key]);
  };

  const _renderMultiItem = (item: any, index: number) => {
    return (
      <View style={styles.checkBoxContainer}>
        <CustomCheckBox
          text={item._value}
          textStyle={styles.checkboxText}
          isCheck={selectedData.some((selectedItem) => { return selectedItem === item._key; })}
          onPress={() => onPressCheckBox(item, index)}
          stylesContainer={styles.checkbox}
        />
      </View>
    );
  };

  const _renderSingleItem = (item: any, index: number) => {
    const isSelected = selectedData.some((selectedItem) => { return selectedItem === item._key; });
    return (
      <CustomTouchable
        style={[styles.singleItemContainer, isSelected ? styles.selectedSignleItem : {}]}
        onPress={() => onPressSingleItem(item, index)}>
        <CustomText
          text={item._value}
          style={[styles.checkboxText, isSelected ? styles.selectedText : {}]}
        />
      </CustomTouchable>
    );
  };

  const renderSearchBar = () => {
    return (
      <SearchBar
        value={text}
        placeholder={props.searchPlaceHolder ? props.searchPlaceHolder : translate("staff.search_default")}
        onChangeText={onSearchTextChange}
      />
    );
  };

  const _itemSeparator = () => {
    return (
      <View style={styles.lineContainer}>
      </View>
    );
  };

  const renderFlatList = () => {
    return (
      <View style={styles.listContainer}>
        <CustomFlatList
          contentContainerStyle={{ flexGrow: 1 }}
          onLoad={onLoad}
          ItemSeparatorComponent={_itemSeparator}
          data={displayData}
          renderItem={props.type === CustomSelectType.MultiSelect ? _renderMultiItem : _renderSingleItem} />
      </View>
    );
  };


  return (
    < View style={styles.container} >
      <View style={[styles.titleContainer, props.headerStyle ? props.headerStyle : {}]}>
        <CustomText
          text={props.title ? props.title : translate("staff.select_defaul")}
          style={[styles.textButton, props.titleStyles ? props.titleStyles : {}]}
        />
      </View>
      {renderSearchBar()
      }
      {renderFlatList()}
      {/* {props.checkListData.length > 0 ?
        <View style={styles.list}>
          {renderFlatList()}
        </View> :
        <CustomText
          styleContainer={{ flex: 1, backgroundColor: 'white', }}
          style={styles.noDataText}
          text='No data'
        />} */}

      {
        props.type === (CustomSelectType.MultiSelect || isShowCloseButton) &&
        (<View style={styles.wrapButton}>
          <CustomButton
            onPress={isShowCloseButton ? props.onCloseModal : onDone}
            text={isShowCloseButton ? translate('staff.close') : translate('staff.done')}
            style={styles.button}
            textStyle={styles.textButton}
          />
        </View>)
      }
    </View>
  );
};

export default React.memo(CustomSelect);
