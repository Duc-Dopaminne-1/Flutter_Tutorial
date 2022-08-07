import React from 'react';
import { StyleSheet, View, ViewStyle, Pressable } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import styles from './styles';
import { colors } from '@/vars';
import ErrorMessage from '@/components/ErrorMessage';
import { isAndroid } from '@/shared/devices';
import { language } from '@/i18n';
import DropdownSVG from '@/components/SVG/DropdownSVG';

interface Props {
  textTitle?: string;
  placeholder?: string;
  selected: number;
  arrData: ObjDropdown[];
  lineBottom: boolean;
  containerStyle?: ViewStyle | ViewStyle[];
  onChangeDropDown: (obj: ObjDropdown) => void;
  onUpArrow?: () => void;
  onDownArrow?: () => void;
  errorText?: string;
  showError?: boolean;
  listInstitution?: string[];
  limitLineError?: boolean;
  onRef?: (ref: DropdownNative) => void;
  onUpdateCurrentPicker?: () => void;
  isFirstComponentInList?: boolean;
  isLastComponentInList?: boolean;
  handleDismisKeyboardIfShowing?: () => void;
  handleSubmit?: () => void;
}

interface State {
  selectedIndex: number;
  selectedValue: string;
  isFocus: boolean;

  // Temp load data update dropdown iOS
  temp_selectedIndex: number;
  temp_selectedValue: string;
}

export interface ObjDropdown {
  _key: string;
  _value: string;
  _code?: string;
  _institution?: string;
}

class DropdownNative extends React.Component<Props, State> {
  inputRef = null;
  static defaultProps = {
    limitLineError: true,
  };

  state = {
    selectedIndex: this.props.selected != -1 && this.props.arrData.length != 0 ? this.props.selected : -1,

    selectedValue:
      this.props.selected != -1 && this.props.arrData.length != 0
        ? this.props.arrData[this.props.selected]._value
        : this.props.placeholder
        ? this.props.placeholder!
        : 'Please choose...',

    isFocus: false,

    temp_selectedIndex: this.props.selected != -1 && this.props.arrData.length != 0 ? this.props.selected : -1,

    temp_selectedValue:
      this.props.selected != -1 && this.props.arrData.length != 0
        ? this.props.arrData[this.props.selected]._value
        : this.props.placeholder
        ? this.props.placeholder!
        : 'Please choose...',
  };

  getSelectedValue = (): string => {
    return this.props.selected != -1 && this.props.arrData.length > 0
      ? this.props.arrData[this.props.selected]._value
      : this.props.placeholder
      ? this.props.placeholder!
      : 'Please choose...';
  };

  DropdownNative = () => {
    const pathData =
      this.props.arrData &&
      this.props.arrData.map(obj => {
        return {
          key: obj._key,
          label: obj._value,
          value: obj._value,
          color: colors.bg_tab,
        };
      });

    return (
      <View style={this.props.containerStyle ? this.props.containerStyle : styles.container}>
        {this.renderPicker(pathData)}

        {this.renderError()}

        {this.renderLineBottom()}
      </View>
    );
  };

  onPressDropDown = () => {
    this.inputRef.current.togglePicker(true);
  };

  renderIcon = () => {
    return (
      <Pressable onPress={this.onPressDropDown}>
        <DropdownSVG />
      </Pressable>
    );
  };

  renderPicker = (pathData: any) => {
    const data = pathData.slice(1);
    return (
      <RNPickerSelect
        textInputProps={styles.textColor as any}
        placeholder={pathData[0]}
        items={data}
        doneText={language('confirm')}
        onValueChange={(value, index) => {
          this.setState(
            {
              temp_selectedIndex: index,
              temp_selectedValue: value,
            },
            () => {
              if (isAndroid) {
                this.onDonePress();
              }
            },
          );
          return {};
        }}
        onDonePress={() => {
          this.onDonePress();
        }}
        onOpen={() => {
          this.setState({
            isFocus: true,
            temp_selectedIndex: this.props.selected,
            temp_selectedValue: this.getSelectedValue(),
          });
          return {};
        }}
        onClose={() => {
          this.setState({ isFocus: false });
          return {};
        }}
        Icon={this.renderIcon}
        style={pickerSelectStyles}
        value={this.state.temp_selectedValue}
        ref={el => {
          this.inputRef = el;
        }}
        useNativeAndroidPickerStyle={false}
        fixAndroidTouchableBug={true}
      />
    );
  };

  renderLineBottom = () => {
    if (this.props.lineBottom) {
      return <View style={[styles.lineBottom, this.props.showError && this.props.errorText ? styles.line : styles.lineError]} />;
    } else {
      return null;
    }
  };

  renderError = () => {
    if (this.props.showError && this.props.errorText) {
      return <ErrorMessage errorValue={this.props.errorText} />;
    } else {
      return null;
    }
  };

  onDonePress = () => {
    const idx = this.state.temp_selectedIndex;
    const value = this.state.temp_selectedValue;
    this.setState({
      selectedIndex: idx,
      selectedValue: value,
    });

    const result = this.props.arrData && this.props.arrData.find(data => data._value === value);
    if (result) {
      this.props.onChangeDropDown({
        _key: result._key,
        _value: result._value,
        _code: result._code ? result._code : '',
        _institution: result._institution ? result._institution : '',
      });
    } else {
      this.props.onChangeDropDown({
        _key: '',
        _value: value,
        _code: '',
        _institution: '',
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
  // eslint-disable-next-line react-native/no-unused-styles
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.gray_400,
    borderRadius: 10,
    color: colors.gray_900,
    paddingRight: 30,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.gray_400,
    borderRadius: 10,
    color: colors.gray_900,
    paddingRight: 30,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  iconContainer: {
    top: 15,
    right: 11,
  },
});

export default DropdownNative;
