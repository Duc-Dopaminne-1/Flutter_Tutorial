import {useNavigation} from '@react-navigation/native';
import {groupBy, toArray} from 'lodash';
import React from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Highlighter from 'react-native-highlight-words';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {SEARCH_TYPE_INDEX, SUGGEST_TYPE} from '../../assets/constants';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {medium, METRICS, normal, small} from '../../assets/theme/metric';
import Avatar from '../../components/Avatar';
import useKeyboard from '../../hooks/useKeyboard';
import {SCREEN_SIZE} from '../../utils/ImageUtil';
import SearchDataUtils from '../../utils/SearchDataUtils';
import ScreenIds from '../ScreenIds';

const AVATAR_SIZE = 45;
const HEADER_SIZE = 150;
const enumTypeString = {
  AGENCY: 'Đại Lý',
  PROJECT: 'Dự Án',
  AREA: 'Nhà lẻ',
};

const styles = StyleSheet.create({
  tabTitleEnabled: {
    fontSize: 16,
    flex: 1,
    ...FONTS.semiBold,
  },
  titleItem: {
    ...FONTS.regular,
    color: COLORS.TEXT_DARK_10,
    marginRight: small,
    fontSize: 14,
    marginBottom: small,
  },
  descriptionItem: {
    ...FONTS.regular,
    fontSize: 12,
    marginBottom: small,
  },
  imageAgency: {
    marginRight: -10,
    marginLeft: 24,
  },
  hightLightStyle: {
    ...FONTS.bold,
    color: COLORS.TEXT_DARK_10,
  },
  message: {
    ...HELPERS.selfCenter,
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.TEXT_DARK_40,
  },
  textViewMore: {marginRight: 16, color: COLORS.PRIMARY_A100, ...FONTS.bold},
  historyKeyword: {marginTop: 16, fontSize: 16, ...FONTS.regular, marginLeft: medium},
  containText: {paddingVertical: small, marginLeft: 24},
});

const titleStyle = type => {
  switch (type) {
    case SUGGEST_TYPE.property:
      return {
        name: enumTypeString.AREA,
        icon: IMAGES.IC_SEARCH_AREA,
      };
    case SUGGEST_TYPE.agency:
      return {
        name: enumTypeString.AGENCY,
        icon: IMAGES.IC_SEARCH_AGENCY,
      };
    default:
      return {
        name: enumTypeString.PROJECT,
        icon: IMAGES.IC_SEARCH_PROJECT,
      };
  }
};

const SearchSuggestComponent = ({
  data,
  isLoading,
  historyKeyword,
  pressItemHistory,
  isSearching,
  keyword,
  onPressItemSuggest,
}) => {
  const navigation = useNavigation();
  const dataSearch = toArray(groupBy(data, 'type'));
  const [keyboardHeight] = useKeyboard();
  const onPressMore = type => {
    let tabIndex = '';
    switch (type) {
      case SUGGEST_TYPE.agency:
        tabIndex = SEARCH_TYPE_INDEX.AGENT;
        break;
      case SUGGEST_TYPE.project:
        tabIndex = SEARCH_TYPE_INDEX.B2C;
        break;
      case SUGGEST_TYPE.property:
        tabIndex = SEARCH_TYPE_INDEX.C2C;
        break;
      default:
        break;
    }
    Keyboard.dismiss();
    navigation.navigate(ScreenIds.Search, {
      tabIndex: tabIndex,
      keyword: keyword,
    });
  };

  const renderSuggestTitle = ({item}) => {
    const type = titleStyle(item[0].type);
    return (
      <View style={[HELPERS.rowStartCenter, METRICS.smallVerticalMargin]}>
        <Image style={METRICS.horizontalMargin} source={type.icon} />
        <Text style={styles.tabTitleEnabled}>{type.name}</Text>
        <TouchableOpacity onPress={() => onPressMore(item[0].type)}>
          <Text style={styles.textViewMore}>Xem thêm</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSuggestItem = item => {
    return (
      <TouchableOpacity
        onPress={() => onPressItemSuggest(item)}
        key={item.id}
        style={[METRICS.mediumMarginStart, METRICS.smallVecalMargin, HELPERS.rowStartCenter]}>
        {item.type === SUGGEST_TYPE.agency && (
          <Avatar containerStyle={styles.imageAgency} url={item.avatar} size={AVATAR_SIZE} />
        )}
        <View style={styles.containText}>
          <Highlighter
            highlightStyle={styles.hightLightStyle}
            style={styles.titleItem}
            autoEscape
            searchWords={[keyword]}
            textToHighlight={item.title.trim()}
            sanitize={text => SearchDataUtils.removeAccents(text)}
          />
          <Text style={styles.descriptionItem}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSuggestGroup = ({item}) => {
    return (
      <>
        {renderSuggestTitle({item})}
        {item.map(it => renderSuggestItem(it))}
      </>
    );
  };

  const renderFooter = () => {
    return <View style={{height: keyboardHeight}} />;
  };

  const renderEmptyList = () => {
    if (keyword.length > 0 && isSearching) {
      return (
        <View
          style={{
            ...HELPERS.fillCenter,
            height: SCREEN_SIZE.HEIGHT - keyboardHeight - HEADER_SIZE,
          }}>
          <Text style={styles.message}>{'Không có dữ liệu tìm kiếm ...'}</Text>
        </View>
      );
    } else {
      return (
        <View style={{padding: normal}}>
          <View style={HELPERS.rowStartCenter}>
            <Icon size={24} style={{marginRight: normal}} name={'clock-outline'} />
            <Text style={{...FONTS.bold, fontSize: normal}}>{'Tìm kiếm gần đây'}</Text>
          </View>
          <ScrollView>
            {historyKeyword &&
              historyKeyword
                .filter(e => !!e.keyWord)
                .map((item, index) => (
                  <TouchableOpacity
                    key={index.toString()}
                    onPress={() => pressItemHistory(item.keyWord)}>
                    <Text style={styles.historyKeyword}>{item.keyWord}</Text>
                  </TouchableOpacity>
                ))}
          </ScrollView>
        </View>
      );
    }
  };

  if (isLoading) {
    return (
      <View style={HELPERS.fillCenter}>
        <Text style={styles.message}>{translate(STRINGS.LOADING)}</Text>
      </View>
    );
  }
  return (
    <FlatList
      style={{backgroundColor: COLORS.NEUTRAL_WHITE}}
      contentContainerStyle={{backgroundColor: COLORS.NEUTRAL_WHITE}}
      ListEmptyComponent={renderEmptyList}
      ListFooterComponent={renderFooter}
      renderItem={({item, index}) => renderSuggestGroup({item, index})}
      keyExtractor={(item, index) => index.toString()}
      data={dataSearch}
    />
  );
};

export default SearchSuggestComponent;
