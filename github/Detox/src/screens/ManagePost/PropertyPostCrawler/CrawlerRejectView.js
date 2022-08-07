import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {CONSTANTS} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomBottomButton from '../../../components/Button/CustomBottomButton';
import DropdownWithTitle from '../../../components/DropdownWithTitle';
import WhiteBoxInput from '../../../components/WhiteBoxInput';
import {getHeaderLimited} from '../../../utils/UiUtils';
import ValidateInputMessage from '../../../utils/ValidateInputMessage';
import LabelSectionLimited from '../NewPost/NewPostComponents/LabelSectionLimited';
import {NewPostStyles} from '../NewPost/NewPostComponents/NewPostConstant';

const styles = StyleSheet.create({
  statusPickerContainer: {
    width: '100%',
    ...METRICS.horizontalPadding,
    ...METRICS.paddingBottom,
  },
  textInputDescription: {
    ...commonStyles.inputBorderStyle,
    height: CONSTANTS.INPUT_DESCRIPTION_HEIGHT,
  },
});

const CrawlerRejectView = ({data, onPressConfirm, onPressCancel}) => {
  const OTHER = 'Other';
  const [state, setState] = useState({
    isSelected: data?.rejectReasons?.some(e => e.checked),
    isOther: data?.rejectReasons?.some(e => e?.checked && e?.key === OTHER),
    focus: false,
    rejectReason: data?.rejectReason,
    rejectReasonId: data?.rejectReasonId,
    error: {
      rejectReasonId: '',
      rejectReason: '',
    },
  });

  const isValid = () => {
    const errors = {
      rejectReason: state?.isOther
        ? ValidateInputMessage.checkRequiredFieldMessage(state.rejectReason)
        : '',
      rejectReasonId: ValidateInputMessage.checkRequiredFieldMessage(state.rejectReasonId),
    };
    setState({
      ...state,
      error: errors,
    });
    const isValidData = !Object.values(errors).some(item => item !== '');
    return isValidData;
  };

  useEffect(() => {
    const isOther = data?.rejectReasons?.some(e => e?.checked && e?.key === OTHER);
    setState({
      ...state,
      isOther: isOther,
      isSelected: data?.rejectReasons?.some(e => e.checked),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.rejectReasons]);

  const onChooseRejectReason = item => {
    if (item?.id) {
      const isOther = item?.key === OTHER;
      // const payload = {rejectReasonId: item?.id, rejectReason: isOther ? data?.rejectReason : ''};

      // dispatch({type: REQUEST_DETAIL_ACTIONS.SET_CONTACT_TRADING_INFO, payload: payload});
      setState({
        ...state,
        rejectReasonId: item?.id,
        isOther,
        error: {
          ...state?.error,
          rejectReason: '',
          rejectReasonId: '',
        },
      });
    }
  };
  const onChangeTextDescription = text => {
    setState({
      ...state,
      rejectReason: text,
      error: {
        rejectReason: ValidateInputMessage.checkRequiredFieldMessage(text),
      },
    });
    // dispatch({
    //   type: GLOBAL_ACTIONS.FIELD,
    //   fieldName: 'rejectReason',
    //   payload: text,
    // });
  };

  const onPressSave = () => {
    if (isValid()) {
      onPressConfirm({
        propertyPostId: data.propertyPostId,
        id: state.rejectReasonId,
        note: state.rejectReason,
      });
    }
  };
  return (
    <>
      <View style={[styles.statusPickerContainer, METRICS.marginTop]}>
        <Text style={[commonStyles.blackTextBold20, FONTS.fontSize24]}>
          {translate('common.deleteFromList')}
        </Text>
        <DropdownWithTitle
          colorTheme={COLORS.PRIMARY_A100}
          style={METRICS.smallMarginTop}
          inputStyle={commonStyles.inputBorderWithIcon}
          title={translate(STRINGS.REASON)}
          headerStyles={commonStyles.blackText14}
          dropdownTitle={translate(STRINGS.PLEASE_SELECT)}
          popupTitle={translate(STRINGS.REASON)}
          items={data?.rejectReasons}
          error={state?.error?.rejectReasonId}
          showSearchBox={false}
          itemSelected={onChooseRejectReason}
          dropdownPlaceHolderStyle={
            state?.isSelected ? commonStyles.blackText14 : NewPostStyles.dropdownPlaceholder
          }
          isRequired
        />

        {state?.isOther && (
          <>
            <LabelSectionLimited
              leftProps={{
                title: translate('crawler.reject.title'),
                isRequired: true,
              }}
              rightProps={{
                title: getHeaderLimited(state?.rejectReason, 200),
                titleStyle: {color: COLORS.GRAY_A3},
                isRequired: false,
              }}
            />
            <WhiteBoxInput
              textInputStyle={
                state?.focus
                  ? [styles.textInputDescription, {borderColor: COLORS.PRIMARY_A100}]
                  : styles.textInputDescription
              }
              placeholder={translate('crawler.reject.placeholder')}
              multiline={true}
              onChangeText={onChangeTextDescription}
              value={data?.rejectReason}
              maxLength={200}
              error={state?.error?.rejectReason}
              alignTop={true}
              onFocus={() => setState({...state, focus: true})}
              onBlur={() => setState({...state, focus: false})}
            />
          </>
        )}
      </View>
      <CustomBottomButton
        onPressLeftButton={onPressCancel}
        onPressRightButton={onPressSave}
        rightTitle={translate(STRINGS.CONFIRM)}
        leftTitle={translate(STRINGS.CLOSE)}
      />
    </>
  );
};

export default CrawlerRejectView;
