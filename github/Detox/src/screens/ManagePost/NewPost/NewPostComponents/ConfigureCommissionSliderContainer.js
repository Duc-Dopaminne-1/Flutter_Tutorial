import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {
  APP_CURRENCY,
  COMMISSION_CHART_COLORS_THEME,
  INTEGER_NUMBER_REGEX,
} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomFooterButtons from '../../../../components/Button/CustomFooterButtons';
import SliderWith2Inputs from '../../../../components/Slider/SliderWith2Inputs';
import NumberUtils from '../../../../utils/NumberUtils';
import {CommissionSliderProps, ConfigureCommissionSliderContainerProps} from '../../types';

const useSliderInputHandler = ({onValueChange, maximumPercentage, minimumPercentage}) => {
  const onInputTextChange = text => {
    onValueChange && onValueChange([text]);
  };

  const onBlurInput = (text, updater) => {
    if (!text) {
      updater(0);
      onValueChange && onValueChange([0]);
    }
  };

  const inputValidator = text => {
    if (
      text > maximumPercentage ||
      text < minimumPercentage ||
      (!INTEGER_NUMBER_REGEX.test(text) && text > 0)
    ) {
      return false;
    }

    return true;
  };

  return {
    onInputTextChange,
    onBlurInput,
    inputValidator,
  };
};

const CommissionSlider = ({
  title,
  input1Value,
  input1Title,
  input1TitleStyle,
  input1TitleDescription,
  input1TitleDescriptionStyle,
  input2Value,
  input2Title,
  input2TitleStyle,
  input2TitleDescription,
  input2TitleDescriptionStyle,
  maximumPercentage,
  minimumPercentage = 0,
  percentage,
  onValueChange,
  onInput1Change,
  onInput2Change,
  themeColor1 = COLORS.GRAY_C9,
  themeColor2 = COLORS.GRAY_C9,
  markerStyle,
  editable = true,
  onSliding = () => {},
  onSlideFinished,
  overrideTrackstyle,
}: CommissionSliderProps) => {
  const input1Handler = useSliderInputHandler({
    onValueChange: onInput1Change,
    maximumPercentage,
    minimumPercentage,
  });

  const input2Handler = useSliderInputHandler({
    onValueChange: onInput2Change,
    maximumPercentage,
    minimumPercentage,
  });

  const onSlide = values => {
    if (values?.length > 0) {
      onValueChange && onValueChange([values[0]]);
    }
  };

  return (
    <SliderWith2Inputs
      values={[percentage]}
      max={maximumPercentage}
      min={minimumPercentage}
      onValuesChange={onSlide}
      headerTitle={title}
      titleStyle={commonStyles.blackTextBold16}
      editable={editable}
      showSlideHeader={false}
      markerStyle={markerStyle}
      trackSelectedStyle={{backgroundColor: themeColor1}}
      overrideTrackstyle={overrideTrackstyle}
      trackUnselectedStyle={{backgroundColor: themeColor2}}
      trackStyle={styles.slider}
      onValuesChangeStart={onSliding}
      onValuesChangeFinish={onSlideFinished}
      input1Value={input1Value}
      input1Title={input1Title}
      input1TitleStyle={input1TitleStyle}
      input1TitleDescription={input1TitleDescription}
      input1TitleDescriptionStyle={input1TitleDescriptionStyle}
      input1Validator={input1Handler.inputValidator}
      onBlurInput1={input1Handler.onBlurInput}
      onChangeInput1={input1Handler.onInputTextChange}
      input2Value={input2Value}
      input2Title={input2Title}
      input2TitleStyle={input2TitleStyle}
      input2TitleDescription={input2TitleDescription}
      input2TitleDescriptionStyle={input2TitleDescriptionStyle}
      input2Validator={input2Handler.inputValidator}
      onBlurInput2={input2Handler.onBlurInput}
      onChangeInput2={input2Handler.onInputTextChange}
      markerOffsetX={12}
    />
  );
};

const ConfigureCommissionSliderContainer = ({
  totalAmount = 0,
  defaultBuyerPercentage,
  defaultSellerPercentage,
  onConfirm,
  onClose,
  onStartSliding,
  onFinishedSliding,
}: ConfigureCommissionSliderContainerProps) => {
  const maximumConfigurablePercentage = 100;

  const [buyerPercentage, setBuyerPercentage] = useState(
    defaultBuyerPercentage ?? maximumConfigurablePercentage,
  );
  const [sellerPercentage, setSellerPercentage] = useState(defaultSellerPercentage ?? 0);

  const onChangeBuyerPercentage = values => {
    let modifiedBuyerPercentage = values[0] ?? 0;

    if (modifiedBuyerPercentage < 0) {
      modifiedBuyerPercentage = 0;
    } else if (modifiedBuyerPercentage > maximumConfigurablePercentage) {
      modifiedBuyerPercentage = buyerPercentage;
    }

    setBuyerPercentage(modifiedBuyerPercentage);
    setSellerPercentage(
      maximumConfigurablePercentage - NumberUtils.parseFloatValue(modifiedBuyerPercentage),
    );
  };

  const onChangeSellerPercentage = values => {
    let modifiedSellerPercentage = values[0] ?? 0;

    if (modifiedSellerPercentage < 0) {
      modifiedSellerPercentage = 0;
    } else if (modifiedSellerPercentage > maximumConfigurablePercentage) {
      modifiedSellerPercentage = sellerPercentage;
    }

    setSellerPercentage(modifiedSellerPercentage);
    setBuyerPercentage(
      maximumConfigurablePercentage - NumberUtils.parseFloatValue(modifiedSellerPercentage),
    );
  };

  const onSlidding = () => {
    onStartSliding && onStartSliding();
  };

  const onSlideFinished = () => {
    onFinishedSliding && onFinishedSliding();
  };

  const onConfirmChange = () => {
    onConfirm && onConfirm(buyerPercentage, sellerPercentage);
  };

  const input1Description = useMemo(
    () =>
      NumberUtils.formatNumberToCurrencyNumber(
        Math.round((totalAmount * NumberUtils.parseFloatValue(buyerPercentage)) / 100) || 0,
        0,
      ) +
      ' ' +
      APP_CURRENCY,
    [buyerPercentage, totalAmount],
  );

  const input2Description = useMemo(
    () =>
      NumberUtils.formatNumberToCurrencyNumber(
        Math.round((totalAmount * NumberUtils.parseFloatValue(sellerPercentage)) / 100) || 0,
        0,
      ) +
      ' ' +
      APP_CURRENCY,
    [sellerPercentage, totalAmount],
  );

  return (
    <>
      <View style={METRICS.padding}>
        <Text style={{...commonStyles.blackTextBold14, ...FONTS.fontSize24}}>
          {translate('newPost.configureCommissionPercentage')}
        </Text>
      </View>
      <View style={METRICS.horizontalPadding}>
        <CommissionSlider
          input1Value={NumberUtils.parseFloatValue(buyerPercentage)}
          input1Title={translate('newPost.commissionConfig.buyer')}
          input1TitleStyle={commonStyles.blackTextBold16}
          input1TitleDescription={input1Description}
          input1TitleDescriptionStyle={[commonStyles.blackText16, METRICS.smallMarginTop]}
          input2Value={NumberUtils.parseFloatValue(sellerPercentage)}
          input2Title={translate('newPost.commissionConfig.seller')}
          input2TitleStyle={commonStyles.blackTextBold16}
          input2TitleDescription={input2Description}
          input2TitleDescriptionStyle={[commonStyles.blackText16, METRICS.smallMarginTop]}
          maximumPercentage={maximumConfigurablePercentage}
          percentage={NumberUtils.parseFloatValue(buyerPercentage)}
          themeColor1={COMMISSION_CHART_COLORS_THEME.buyer}
          themeColor2={COMMISSION_CHART_COLORS_THEME.seller}
          onValueChange={onChangeBuyerPercentage}
          onInput1Change={onChangeBuyerPercentage}
          onInput2Change={onChangeSellerPercentage}
          onSliding={onSlidding}
          onSlideFinished={onSlideFinished}
          markerStyle={styles.marker}
        />
      </View>
      <View style={[commonStyles.footerContainer, commonStyles.borderTop]}>
        <CustomFooterButtons
          nextButtonTitle={translate('common.confirm')}
          cancelButtonTitle={translate(STRINGS.CANCEL)}
          onPressNext={onConfirmChange}
          onPressCancel={onClose}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  slider: {
    height: 4,
  },
  marker: {
    borderColor: COLORS.NEUTRAL_BORDER,
    borderWidth: SIZES.BORDER_WIDTH_4,
    ...commonStyles.shadowApp,
  },
});

export default ConfigureCommissionSliderContainer;
