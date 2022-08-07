import React, { useState } from 'react';
import Container from '@src/components/Container';
import { View } from 'react-native';
import CustomSectionHeader from '@src/components/CustomSection';
import SearchBar from '@src/components/SearchBar';
import translate from '@src/localize';
import styles from './styles';
import { IC_EVENT_TTPE, ADD_PLUS } from '@src/constants/icons';
import { CustomFlatList } from '@src/components/FlatList';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { CustomText } from '@src/components/CustomText';
import { CustomButton } from '@src/components/CustomButton';
import NavigationActionsService from '@src/navigation/navigation';
import { NEW_EVENT_TYPE } from '@src/constants/screenKeys';

interface EventTypeProps {
  title: string;
}

const EventType = () => {
  const dummyData = [
    { title: "Swimming Pool" },
    { title: "BBQ" },
    { title: "Nullam quis risus nisl" },
    { title: "Orci varius natoque" },
    { title: "Nullam quis risus nisl" },
    { title: "Orci varius natoque" }
  ];
  const [searchText, setSearchText] = useState<string>('');

  const onChangeSearchText = (text: string) => {
    setSearchText(text);
  };

  const onPressEventType = () => {
    // TODO: Handle on press event type item
  };

  const onPressAddEventType = () => {
    NavigationActionsService.push(NEW_EVENT_TYPE);
  };

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {

  };

  const _itemSeparator = () => {
    return (
      <View style={styles.lineContainer} />
    );
  };

  const _renderItem = (item: EventTypeProps) => {
    return (
      <CustomTouchable onPress={onPressEventType} style={styles.containerItem} >
        <CustomText text={item.title} style={styles.itemText} />
      </CustomTouchable>
    );
  };

  return (
    <Container title={translate('event_type.navigation_title')} isShowHeader={true}>
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={translate('event_type.section_title').toUpperCase()}
        icon={IC_EVENT_TTPE}
      />
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchText}
          onChangeText={onChangeSearchText}
          placeholder={translate('event_type.search_placeholder')} />
      </View>
      <View style={styles.listContainer}>
        <CustomFlatList
          onLoad={onLoad}
          ItemSeparatorComponent={_itemSeparator}
          data={dummyData}
          renderItem={_renderItem} />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={onPressAddEventType}
          iconLeft={ADD_PLUS}
          text={translate('event_type.add_new_button')}
          style={styles.button} />
      </View>
    </Container>
  );
};

export default EventType;
