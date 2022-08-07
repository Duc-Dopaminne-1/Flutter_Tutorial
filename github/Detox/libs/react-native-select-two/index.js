/* eslint-disable react-native/no-color-literals */
/* eslint-disable max-lines-per-function */
//import liraries
import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  Dimensions,
  Animated,
  Platform,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DebounceInput from '../../src/components/DebounceInput';
import Modal from 'react-native-modal';
import Button from './lib/Button';
import TagItem from './lib/TagItem';
import utilities from './lib/utilities';
import PropTypes from 'prop-types';
import { COLORS } from '../../src/assets/theme/colors';

// define your styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 45,
    borderRadius: 2,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cacaca',
    paddingVertical: 4,
  },
  modalContainer: {
    paddingTop: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    fontSize: 16,
    marginBottom: 16,
    width: '100%',
    textAlign: 'center',
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#cacaca',
  },
  inputKeyword: {
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#cacaca',
    paddingLeft: 8,
    marginHorizontal: 24,
    marginTop: 16,
  },
  buttonWrapper: {
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  button: {
    height: 36,
    flex: 1,
  },
  selectedTitlte: {
    fontSize: 14,
    color: 'gray',
    flex: 1,
  },
  tagWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  listOption: {
    paddingHorizontal: 24,
    paddingTop: 1,
    marginTop: 16,
  },
  itemWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  itemIcon: {
    width: 30,
    textAlign: 'right',
  },
  empty: {
    fontSize: 16,
    color: 'gray',
    alignSelf: 'center',
    textAlign: 'center',
    paddingTop: 16,
  },
  buttonLeft: {marginRight: 5, marginLeft: 5, borderWidth: 1},
  buttonRight: {marginLeft: 5, marginRight: 5},
  placeholder: {
    fontSize: 14,
    color: COLORS.TEXT_DARK_40,
    flex: 1,
  },
});

const {height} = Dimensions.get('window');
const SELECT_ALL_ID = -1;
const INIT_HEIGHT = height * 0.6;
// create a component
class Select2 extends Component {
  static defaultProps = {
    cancelButtonText: 'Hủy',
    selectButtonText: 'Chọn',
    searchPlaceHolderText: 'Nhập vào từ khóa',
    listEmptyTitle: 'Không tìm thấy lựa chọn phù hợp',
    colorTheme: '#16a45f',
    buttonTextStyle: {},
    buttonStyle: {},
    showSearchBox: true,
  };
  state = {
    show: false,
    preSelectedItem: [],
    selectedItem: [],
    data: [],
    keyword: '',
  };
  animatedHeight = new Animated.Value(INIT_HEIGHT);
  filterTextInputRef = null;

  componentDidMount() {
    this.init();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.init(newProps);
  }

  init(newProps) {
    let preSelectedItem = [];
    //Canhdd fix remember old selected item before <<<
    let selectedItem = [];
    //Canhdd fix remember old selected item before >>>
    let {data} = newProps || this.props;
    data.map(item => {
      if (item.checked) {
        preSelectedItem.push(item);
        selectedItem.push(item);
      }
    });
    // this.setState({data, preSelectedItem});
    //Canhdd fix remember old selected item before <<<  selectedItem will be similar to preSelectedItem when re-render
    this.setState({data, preSelectedItem, selectedItem});
    //Canhdd fix remember old selected item before >>>
  }

  get dataRender() {
    let {data, keyword} = this.state;
    let listMappingKeyword = [];
    data.map(item => {
      if (utilities.changeAlias(item.name).includes(utilities.changeAlias(keyword))) {
        listMappingKeyword.push(item);
      }
    });
    return listMappingKeyword;
  }

  get defaultFont() {
    let {defaultFontName} = this.props;
    return defaultFontName ? {fontFamily: defaultFontName} : {};
  }

  cancelSelection() {
    let {data, preSelectedItem} = this.state;
    data.map(item => {
      item.checked = false;
      for (let _selectedItem of preSelectedItem) {
        if (item.id === _selectedItem.id) {
          item.checked = true;
          break;
        }
      }
    });
    this.filterTextInputRef?.blur(); //to reset popup height
    this.setState({data, show: false, keyword: '', selectedItem: preSelectedItem});
  }

  onItemSelected = (item, isSelectSingle) => {
    //Canhdd add feature hide dropdown when done choosing item: only when isSelectSingle = true <<<
    const {isRequiredAtLeastOne, onSelect, isHaveAll} = this.props;
    if (isSelectSingle && isRequiredAtLeastOne) {
      const selectedItems = [item];
      const {data} = this.state;
      const newData = data.map(oldItem => {
        let newItem = oldItem;
        newItem.checked = oldItem.id === item.id;
        return newItem;
      });
      onSelect && onSelect([item.id], [item]);
      this.filterTextInputRef?.blur(); //to reset popup height
      this.setState({
        data: newData,
        show: false,
        keyword: '',
        selectedItem: selectedItems,
        preSelectedItem: selectedItems,
      });
      return;
    }
    //Canhdd add feature hide dropdown when done choosing item: only when isSelectSingle = true >>>

    //Canhdd add required atleast 1 item <<<
    if (isRequiredAtLeastOne) {
      const oldSelectedItems = this.state.selectedItem;
      const oldPreSelectedItems = this.state.preSelectedItem;
      let checkedItem = null;
      if (oldSelectedItems.length === 1) {
        checkedItem = oldSelectedItems[0];
      } else if (oldSelectedItems.length === 0 && oldPreSelectedItems.length === 1) {
        checkedItem = oldPreSelectedItems[0];
      }
      if (checkedItem && checkedItem.id === item.id) {
        return;
      }
    }
    //Canhdd add required atleast 1 item >>>

    //Canhdd refactor is have all <<<
    // Duc add is have all

    if (isHaveAll) {
      const {data} = this.state;
      if (item.id === SELECT_ALL_ID) {
        const selectedItem = [item];
        const newData = data.map(oldItem => {
          const newItem = oldItem;
          newItem.checked = oldItem.id === SELECT_ALL_ID;
          return newItem;
        });
        onSelect && onSelect([item.id], [item]);
        this.filterTextInputRef?.blur(); //to reset popup height
        this.setState({
          data: newData,
          show: false,
          keyword: '',
          selectedItem: selectedItem,
          preSelectedItem: selectedItem,
        });
      } else {
        const selectedItem = [];
        const newData = data.map(oldItem => {
          const newItem = oldItem;
          if (oldItem.id === item.id) {
            newItem.checked = !item.checked;
          } else if (oldItem.id === SELECT_ALL_ID) {
            newItem.checked = false;
          } else if (isSelectSingle) {
            newItem.checked = false;
          }
          if (newItem.checked) {
            selectedItem.push(newItem);
          }
          return newItem;
        });
        this.setState({data: newData, selectedItem: selectedItem});
      }
      return;
    }
    //Canhdd refactor is have all >>>

    let selectedItem = [];
    let {data} = this.state;
    item.checked = !item.checked;
    for (let index in data) {
      if (data[index].id === item.id) {
        data[index] = item;
      } else if (isSelectSingle) {
        data[index].checked = false;
      }
    }
    data.map(item => {
      if (item.checked) selectedItem.push(item);
    });
    this.setState({data, selectedItem});
  };

  keyExtractor = (item, idx) => idx.toString();

  renderItem = ({item, idx}) => {
    let {colorTheme, isSelectSingle} = this.props;
    return (
      <TouchableOpacity
        key={idx}
        onPress={() => this.onItemSelected(item, isSelectSingle)}
        activeOpacity={0.7}
        style={styles.itemWrapper}>
        <Text style={[styles.itemText, this.defaultFont]}>{item.name}</Text>
        <Icon
          style={styles.itemIcon}
          name={item.checked ? 'check-circle-outline' : 'radiobox-blank'}
          color={item.checked ? colorTheme : '#777777'}
          size={20}
        />
      </TouchableOpacity>
    );
  };
  renderEmpty = () => {
    let {listEmptyTitle} = this.props;
    return <Text style={[styles.empty, this.defaultFont]}>{listEmptyTitle}</Text>;
  };
  closeModal = () => {
    // this.setState({show: false});
    this.cancelSelection();
  };
  showModal = () => {
    this.setState({show: true});
    Keyboard.dismiss();
  };

  onFocusInput = () => {
    Animated.spring(this.animatedHeight, {
      toValue: Platform.OS === 'ios' ? height - 370 : INIT_HEIGHT,
      friction: 7,
      useNativeDriver: false
    }).start();
  }

  onBlurInput = () => {
    Animated.spring(this.animatedHeight, {
      toValue: INIT_HEIGHT,
      friction: 7,
      useNativeDriver: false
    }).start();
  }

  render() {
    let {
      style,
      modalStyle,
      title,
      onSelect,
      onRemoveItem,
      popupTitle,
      colorTheme,
      isSelectSingle,
      cancelButtonText,
      selectButtonText,
      searchPlaceHolderText,
      selectedTitleStyle,
      buttonTextStyle,
      buttonStyle,
      showSearchBox,
      removeDelete,
      isRequiredAtLeastOne,
      value,
      onChangeText,
      canSearchServer,
      showLabel = true,
      placeholder,
      stylePlaceholder
    } = this.props;
    let {show, selectedItem, preSelectedItem} = this.state;
    return (
      <TouchableOpacity
        onPress={this.showModal}
        activeOpacity={0.7}
        style={[styles.container, style]}
        >
        <Modal
          onBackdropPress={this.closeModal}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          useNativeDriver={true}
          animationInTiming={300}
          animationOutTiming={300}
          hideModalContentWhileAnimating
          isVisible={show}
          avoidKeyboard={true}>
          <Animated.View style={[styles.modalContainer, modalStyle, {height: this.animatedHeight}]}>
            <View>
              <Text style={[styles.title, this.defaultFont, {color: colorTheme}]}>
                {popupTitle || title}
              </Text>
            </View>
            <View style={styles.line} />
            {showSearchBox ? (
              <TextInput
                ref={textInputRef => (this.filterTextInputRef = textInputRef)}
                underlineColorAndroid="transparent"
                returnKeyType="done"
                style={[styles.inputKeyword, this.defaultFont]}
                placeholder={searchPlaceHolderText}
                selectionColor={colorTheme}
                onChangeText={keyword => this.setState({keyword})}
                onFocus={this.onFocusInput}
                onBlur={this.onBlurInput}
              />
            ) : null}

            {canSearchServer ? (
              <DebounceInput
                underlineColorAndroid="transparent"
                returnKeyType="done"
                style={[styles.inputKeyword, this.defaultFont]}
                placeholder={searchPlaceHolderText}
                selectionColor={colorTheme}
                onChangeText={keyword => onChangeText(keyword)}
                onFocus={this.onFocusInput}
                onBlur={this.onBlurInput}
              />
            ) : null}
            <FlatList
              style={styles.listOption}
              data={this.dataRender || []}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
              ListEmptyComponent={this.renderEmpty}
              keyboardShouldPersistTaps="handled" //to allow select while displaying keyboard
            />

            <View style={styles.buttonWrapper}>
              <Button
                defaultFont={this.defaultFont}
                onPress={() => {
                  this.cancelSelection();
                }}
                title={cancelButtonText}
                textColor={colorTheme}
                backgroundColor="#fff"
                textStyle={buttonTextStyle}
                style={[styles.button, buttonStyle, styles.buttonLeft, {borderColor: colorTheme}]}
              />
              {!(isSelectSingle && isRequiredAtLeastOne) && (
                <Button
                  defaultFont={this.defaultFont}
                  onPress={() => {
                    let selectedIds = [],
                      selectedObjectItems = [];
                    selectedItem.map(item => {
                      selectedIds.push(item.id);
                      selectedObjectItems.push(item);
                    });
                    onSelect && onSelect(selectedIds, selectedObjectItems);
                    this.filterTextInputRef?.blur(); //to reset popup height
                    this.setState({show: false, keyword: '', preSelectedItem: selectedItem});
                  }}
                  title={selectButtonText}
                  backgroundColor={colorTheme}
                  textStyle={buttonTextStyle}
                  style={[styles.button, buttonStyle, styles.buttonRight]}
                />
              )}
            </View>
          </Animated.View>
        </Modal>
       {!this.state.selectedItem?.length && placeholder && <Text style={[styles.placeholder,stylePlaceholder]}>
         {placeholder}
       </Text>}
        {value ? <Text style={[styles.selectedTitlte,{color: '#333'}, this.defaultFont, selectedTitleStyle]}>{value}</Text> : preSelectedItem.length > 0 ? (
          isSelectSingle ? (
            <Text
              style={[
                styles.selectedTitlte,
                this.defaultFont,
                {color: '#333'},
                selectedTitleStyle,
              ]}>
              {showLabel ? preSelectedItem[0].name : ""}
            </Text>
          ) : (
            <View style={styles.tagWrapper}>
              {preSelectedItem.map((tag, index) => {
                return (
                  <TagItem
                    key={index}
                    removeDelete={removeDelete}
                    onRemoveTag={() => {
                      let preSelectedItem = [];
                      let selectedIds = [],
                        selectedObjectItems = [];
                      let {data} = this.state;
                      data.map(item => {
                        if (item.id === tag.id) {
                          item.checked = false;
                        }
                        if (item.checked) {
                          preSelectedItem.push(item);
                          selectedIds.push(item.id);
                          selectedObjectItems.push(item);
                        }
                      });
                      this.setState({data, preSelectedItem, selectedItem: preSelectedItem});
                      onRemoveItem && onRemoveItem(selectedIds, selectedObjectItems);
                    }}
                    tagName={tag.name}
                  />
                );
              })}
            </View>
          )
        ) : (
          <Text style={[styles.selectedTitlte, this.defaultFont, selectedTitleStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }
}

Select2.propTypes = {
  data: PropTypes.array.isRequired,
  style: PropTypes.object,
  defaultFontName: PropTypes.string,
  selectedTitleStyle: PropTypes.object,
  buttonTextStyle: PropTypes.object,
  buttonStyle: PropTypes.object,
  title: PropTypes.string,
  onSelect: PropTypes.func,
  onRemoveItem: PropTypes.func,
  popupTitle: PropTypes.string,
  colorTheme: PropTypes.string,
  isSelectSingle: PropTypes.bool,
  showSearchBox: PropTypes.bool,
  cancelButtonText: PropTypes.string,
  selectButtonText: PropTypes.string,
  isRequiredAtLeastOne: PropTypes.bool,
  isHaveAll: PropTypes.bool,
  removeDelete: PropTypes.bool,
  placeholder: PropTypes.string,
  stylePlaceholder: PropTypes.object,
};

//make this component available to the app
export default Select2;
