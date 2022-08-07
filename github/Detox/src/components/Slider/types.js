import {ViewStyle} from 'react-native';

export type RangeSliderProps = {
  title: String,
  isRequired: Boolean,
  values: Required<Array<Number>>,
  unit: String,
  onValuesChange: (values: Array<Number>) => {},
  optionsArray: Array<Number>,
  min: Number,
  max: Number,
  step: Number,
  enabledTwo: Boolean,
  enabledOne: Boolean,
  slideMargin: Number,
  isOverlappable: Boolean,
  showDescription: Boolean,
  showSlideHeader: Boolean,
  sliderLength: Number,
  containerStyle: ViewStyle,
  customMarker: () => JSX.Element,
  customMarkerLeft: () => JSX.Element,
  customMarkerRight: () => JSX.Element,
  trackSelectedStyle: ViewStyle,
  trackUnselectedStyle: ViewStyle,
  trackStyle: ViewStyle,
  onValuesChangeStart: Function,
  onValuesChangeFinish: (value: Array<Number>) => {},
  editable: Boolean,
  markerOffsetX: Number,
  markerContainerStyle: ViewStyle,
};

export type SliderWithInputProps = {
  headerTitle: String,
  titleStyle: ViewStyle,
  headerRightComp: JSX.Element | (() => JSX.Element),
  inputRightComp: JSX.Element | (() => JSX.Element),
  editable: Boolean,
  markerStyle: ViewStyle,
  customMarker: () => JSX.Element,
};

export type DefaultSliderNumberInputProps = {
  editable: Boolean,
  inputValue: String,
  style: ViewStyle,
  inputValidator: (a: String) => {},
  onChangeInput: (a: String, b: Function) => {},
  onBlurInput: (a: String) => {},
  onFocusInput: (a: String) => {},
};
