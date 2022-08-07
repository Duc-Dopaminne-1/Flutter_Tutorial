import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle, Text, Image, TouchableOpacity, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { BORDER_COLOR_DEFAULT, fonts } from '@constants/vars';
//@ts-ignore
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';

import styles from './styles';
import ReactNativePickerModule from 'react-native-picker-module';

import { ICON_ARROW_DOWN, ARROW_UP, ARROW_DOWN } from '@src/constants/icons';
import { ImageStyle } from 'react-native-fast-image';

import ICON_ACTIVE_UP from '@res/img/icon_active_up_arrow_keyboard.png';
import ICON_ACTIVE_DOWN from '@res/img/icon_active_down_arrow_keyboard.png';
import ICON_INACTIVE_UP from '@res/img/icon_inactive_up_arrow_keyboard.png';
import ICON_INACTIVE_DOWN from '@res/img/icon_inactive_down_arrow_keyboard.png';
import { isAndroid } from '@src/utils';
import { find } from 'lodash';
import { Theme } from '@src/components/Theme';

export interface Props {
  textTitle?: string;
  placeholder?: string;
  selected?: number;
  arrData?: ObjDropdown[];
  lineBottom?: boolean;
  containerStyle?: ViewStyle | ViewStyle[];
  onChangeDropDown: (obj: ObjDropdown) => void;
  onUpArrow?: () => void;
  onDownArrow?: () => void;
  errorText?: string;
  showError?: boolean;
  listInstitution?: string[];
  isDisablePicker?: boolean;
  limitLineError?: boolean;
  onRef?: (ref: DropdownNative) => void;
  onUpdateCurrentPicker?: () => void;
  isFirstComponentInList?: boolean;
  isLastComponentInList?: boolean;
  linearGradientColors?: any;
  contentDropdownStyle?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  iconRightStyle?: ImageStyle;
  isHideTitle?: boolean;
  buttonContainer?: ViewStyle | ViewStyle[];
  numberOfInput?: number;
  currentInputIndex?: number;
  onFocus?: () => void;
  onPressUp?: () => void;
  onPressDown?: () => void;
  isShowAccessory?: boolean;
}

interface State {
  selectedIndex: number | undefined;
  selectedValue: string;
  isFocus: boolean;

  // // Temp load data update dropdown iOS
  temp_selectedIndex: number | undefined;
  temp_selectedValue: string;
}

export interface ObjDropdown {
  _key: string;
  _value: string;
  _code?: string;
  _institution?: string;
  _index?: number;
}

class DropdownNative extends React.Component<Props, State> {
  inputRef: any;
  pickerRef: any;

  static defaultProps = {
    limitLineError: true,
    selected: 0,
  };

  getSelectedValue = (): string => {
    const value = this.props.selected != -1 && this.props.arrData && this.props.arrData.length > 0
      ? this.props.arrData[this.props.selected]._value
      : (this.props.placeholder ? this.props.placeholder! : "Please choose...");

    return value;
  };

  getSelectedKey = (): string => {
    const value = this.props.selected != -1 && this.props.arrData && this.props.arrData.length > 0
      ? this.props.arrData[this.props.selected]._key
      : "";

    return value;
  };

  getSelectedIndex = (): number | undefined => {
    const value = this.props.selected != -1 && this.props.arrData && this.props.arrData.length != 0
      ? this.props.selected
      : -1;

    return value;
  };

  state = {
    selectedIndex: this.getSelectedIndex(),

    selectedValue: this.getSelectedValue(),

    isFocus: false,

    temp_selectedIndex: this.getSelectedIndex(),

    temp_selectedValue: this.getSelectedKey(),
  };

  // Action show Picker
  focus = () => {
    Keyboard.dismiss();
    this.props.onFocus && this.props.onFocus();
    this.props.onUpdateCurrentPicker && this.props.onUpdateCurrentPicker();
    if (!isAndroid()) {
      this.inputRef.togglePicker(true);
    } else {
      this.setState({ isFocus: true });
      this.pickerRef.show();
    }
  };

  dismiss = () => {
    this.inputRef && this.inputRef.togglePicker(false);
  };

  DropdownNative = () => {
    let borderStyle = { borderColor: BORDER_COLOR_DEFAULT };
    if (this.props.errorText) {
      borderStyle = { borderColor: 'red' };
    } else {
      if (this.state.isFocus) {
        borderStyle = { borderColor: '#5C6AC4' };
      } else {
        borderStyle = { borderColor: BORDER_COLOR_DEFAULT };
      }
    }
    let backgroundColor = this.props.errorText ? ['#FBEAE5', '#FBEAE5'] : ['#FFFFFF', '#F9FAFB'];
    backgroundColor = this.props.linearGradientColors ? this.props.linearGradientColors : backgroundColor;

    const pathData =
      this.props.arrData &&
      this.props.arrData.map(obj => {
        return {
          key: obj._key,
          label: obj._value,
          value: obj._key,
          color: '#212B36',
        };
      });

    return (
      <View style={this.props.containerStyle ? this.props.containerStyle : styles.container}>
        {this.props.textTitle && !this.props.isHideTitle ? (
          <Text style={styles.text} numberOfLines={2}>
            {this.props.textTitle}
          </Text>
        ) : null}
        <TouchableOpacity
          ref={touch => (this.props.ref = touch)}
          style={[styles.modalDropdown, this.props.contentDropdownStyle]}
          onPress={() => {
            this.focus();
          }}
          disabled={this.props.isDisablePicker}
        >
          <View style={[styles.buttonContainer, this.props.buttonContainer]}>
            <Text style={[styles.modalDropdownText, this.props.textStyle]} numberOfLines={1}>
              {this.getSelectedValue()}
            </Text>
            {this.props.isDisablePicker ? null : (
              <Image resizeMode={'contain'} style={this.props.iconRightStyle} source={ICON_ARROW_DOWN} />
            )}
          </View>
        </TouchableOpacity>

        {!isAndroid() ? this.renderIOS(pathData) : this.renderAndroid(pathData)}

        {this.renderError()}

        {this.renderLineBottom()}
      </View>
    );
  };

  renderIOS = (pathData: any) => {
    const data = pathData.slice(1);
    return (
      <RNPickerSelect
        ref={this.pickerRef}
        placeholder={pathData[0]}
        items={data}
        onValueChange={(value, index) => {
          // value is _key in array data
          this.setState({
            temp_selectedIndex: index,
            temp_selectedValue: value,
          });
          return {};
        }}
        onDonePress={() => {
          this.onDonePress();
        }}
        InputAccessoryView={() => this.InputAccessoryView()}
        onUpArrow={() => {
          this.props.onUpArrow && this.props.onUpArrow();
          return {};
        }}
        onDownArrow={() => {
          this.props.onDownArrow && this.props.onDownArrow();
          return {};
        }}
        onOpen={() => {
          this.setState({
            isFocus: true,
            temp_selectedIndex: this.getSelectedIndex(),
            temp_selectedValue: this.getSelectedKey(),
          });
          return {};
        }}
        onClose={() => {
          this.setState({ isFocus: false });
          return {};
        }}
        style={pickerSelectStyles}
        value={this.state.temp_selectedValue}
        ref={el => {
          this.inputRef = el;
        }}
        useNativeAndroidPickerStyle={false}
      />
    );
  };

  renderAndroid = (pathData: any) => {
    const data = pathData.map((item: any) => {
      return item.label;
    });

    return (
      <ReactNativePickerModule
        items={data}
        title={this.props.textTitle ? this.props.textTitle : ''}
        pickerRef={e => (this.pickerRef = e)}
        value={this.state.selectedIndex == -1 ? null : this.state.selectedIndex}
        onValueChange={(valueText: string, index: number) => {
          this.setState({
            selectedValue: valueText,
            selectedIndex: index,
          });
          const result = this.props.arrData
            && this.props.arrData.find((data, idx) => data._value === valueText && index == idx);
          if (result) {
            this.props.onChangeDropDown({
              _key: result._key,
              _value: result._value,
              _code: result._code ? result._code : '',
              _institution: result._institution ? result._institution : '',
              _index: index,
            });
          } else {
            this.props.onChangeDropDown({
              _key: '',
              _value: valueText,
              _code: '',
              _institution: '',
              _index: 0,
            });
          }
        }}
        onCancel={() => {
          this.setState({ isFocus: false });
          return {};
        }}
        onDismiss={() => {
          this.setState({ isFocus: false });
          return {};
        }}
      />
    );
  };

  renderLineBottom = () => {
    if (this.props.lineBottom) {
      return <View style={[styles.lineBottom, this.props.showError && this.props.errorText ? { marginTop: 10 } : { marginTop: 20 }]} />;
    } else {
      return null;
    }
  };

  renderError = () => {
    if (this.props.showError && this.props.errorText) {
      return (
        <View style={styles.errorContainer}>
          {this.props.limitLineError ? (
            <Text style={styles.errorText} numberOfLines={2}>
              {this.props.errorText}
            </Text>
          ) : (
              <Text style={styles.errorText}>{this.props.errorText}</Text>
            )}
        </View>
      );
    } else {
      return null;
    }
  };

  renderUpDownArrow = () => {
    const { numberOfInput = 0, currentInputIndex, onPressUp, onPressDown, isShowAccessory = false } = this.props;
    const isUpDisabled = currentInputIndex === 0 || isShowAccessory;
    const isDownDisabled = currentInputIndex === numberOfInput - 1 || isShowAccessory;

    return (
      <View style={{ flexDirection: 'row' }}>
        {!isUpDisabled ? (
          <TouchableOpacity onPress={() => onPressUp && onPressUp()}>
            <Image
              resizeMode={'contain'}
              source={ARROW_UP}
              style={[styles.iconArrowStyles, { tintColor: Theme.keyboard.arrowActive }]}
            />
          </TouchableOpacity>
        ) : (
            <Image
              resizeMode={'contain'}
              source={ICON_INACTIVE_UP}
              style={[styles.iconArrowStyles]} />
          )}

        {!isDownDisabled ? (
          <TouchableOpacity onPress={() => onPressDown && onPressDown()}>
            <Image
              resizeMode={'contain'}
              source={ARROW_DOWN}
              style={[styles.iconArrowStyles, { tintColor: Theme.keyboard.arrowActive }]}
            />
          </TouchableOpacity>
        ) : (
            <Image source={ICON_INACTIVE_DOWN} style={styles.iconArrowStyles} />
          )}
      </View>
    );
  };

  renderTitleText = () => {
    const { textTitle } = this.props;
    return (
      <View style={styles.titleTextContainer}>
        <Text numberOfLines={1} style={styles.titleTextStyle}>
          {textTitle ? textTitle : ''}
        </Text>
      </View>
    );
  };

  InputAccessoryView = () => {
    return (
      <View style={[defaultStyles.modalViewMiddle, { justifyContent: 'flex-end', paddingHorizontal: 20 }]}>
        {this.renderUpDownArrow()}
        {this.renderTitleText()}
        <TouchableWithoutFeedback
          onPress={() => {
            this.inputRef.togglePicker(true);
            this.onDonePress();
          }}
          hitSlop={{ top: 4, right: 4, bottom: 4, left: 4 }}
          style={{ right: 20 }}
        >
          <View testID="needed_for_touchable">
            <Text
              style={[
                { lineHeight: 20, fontFamily: fonts.MontserratMedium, fontSize: 15, textAlign: 'right', color: '#007AFF', width: 50 },
              ]}
            >
              Done
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  onDonePress = () => {
    const idx = this.state.temp_selectedIndex;
    const value = this.state.temp_selectedValue;
    this.setState({
      selectedIndex: idx,
      selectedValue: value,
    });

    const result = this.props.arrData && find(this.props.arrData, { _key: value });
    if (result) {
      this.props.onChangeDropDown({
        _key: result._key,
        _value: result._value,
        _code: result._code ? result._code : '',
        _institution: result._institution ? result._institution : '',
        _index: idx,
      });
    } else {
      this.props.onChangeDropDown({
        _key: '',
        _value: value,
        _code: '',
        _institution: '',
        _index: 0,
      });
    }
  };

  render() {
    return this.DropdownNative();
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
  }
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    flex: 1,
    opacity: 0,
    height: 0,
  },
  inputAndroid: {
    flex: 1,
    opacity: 0,
    height: 10,
    backgroundColor: 'blue',
  },
  iconContainer: {
    opacity: 0,
  },
});

export default DropdownNative;
