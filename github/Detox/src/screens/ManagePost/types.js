import {TextStyle} from 'react-native';

export type CommissionPieChartContainerProps = {
  totalAmount: Required<Number>,
  topenlandPercentage: Required<Number>,
  buyerPercentage: Required<Number>,
  sellerPercentage: Required<Number>,
  onPressConfigurePercentage: Function,
  hideCautionText: Boolean,
};

export type ConfigureCommissionSliderContainerProps = {
  totalAmount: Required<Number>,
  topenlandPercentage: Required<Number>,
  defaultBuyerPercentage: Number,
  defaultSellerPercentage: Number,
  onConfirm: Function,
  onClose: Function,
  onStartSliding: Function,
  onFinishedSliding: Function,
};

export type CommissionSliderProps = {
  title: String,
  input1Value: String,
  input1Title: String,
  input1TitleStyle: TextStyle,
  input1TitleDescription: String,
  input1TitleDescriptionStyle: TextStyle,
  input2Value: String,
  input2Title: String,
  input2TitleStyle: TextStyle,
  input2TitleDescription: String,
  input2TitleDescriptionStyle: TextStyle,
  maximumPercentage: Required<Number>,
  minimumPercentage: Number,
  percentage: Required<Number>,
  onValueChange: (values: Array<Number>) => {},
  onInput1Change: (values: Array<Number>) => {},
  onInput2Change: (values: Array<Number>) => {},
  themeColor: String,
  editable: Boolean,
  onSliding: Function,
  onSlideFinished: (values: Array<Number>) => {},
  overrideTrackstyle: ViewStyle,
};
