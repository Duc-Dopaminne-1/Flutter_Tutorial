import isEmpty from 'lodash/isEmpty';
import React, {forwardRef, useState} from 'react';
import {Platform, StyleSheet, Text, TextInput, View} from 'react-native';

import {useGraphqlApiLazy} from '../../../../api/graphql/useGraphqlApiLazy';
import {SUPPORT_SERVICE_CANCEL_REASON} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {normal, small} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomButton from '../../../../components/Button/CustomButton';
import DropdownWithTitle from '../../../../components/DropdownWithTitle';
import ModalWithModalize from '../../../../components/Modal/ModalWithModalize';
import {dropdownMapper} from '../../../../utils/DataProcessUtil';
import {useMount} from '../../../commonHooks';

const styles = StyleSheet.create({
  title: {fontSize: 24, ...FONTS.bold},
  headerRadio: {marginBottom: small, marginTop: 32, color: COLORS.TEXT_DARK_10},
  btnApply: {
    height: 50,
    borderRadius: small,
    flex: 1,
    marginLeft: normal,
    backgroundColor: COLORS.PRIMARY_A100,
  },
  btnReset: {height: 50, borderRadius: small, flex: 1, backgroundColor: COLORS.GRAY_BD},
  viewBottom: {flexDirection: 'row', marginVertical: normal},
  inputDropdown: {borderWidth: SIZES.BORDER_WIDTH_1, borderColor: COLORS.GRAY_ED},
  closeButton: {
    ...FONTS.bold,
    fontSize: 14,
    color: COLORS.PRIMARY_A100,
    textDecorationLine: 'none',
  },
  label: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.TEXT_DARK_10,
    marginTop: normal,
  },
  toLabel: {
    margin: small,
  },
  dropdown: {
    ...commonStyles.dropdownInput,
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePicker: {
    flex: 1,
  },
  applyButton: {
    backgroundColor: COLORS.PRIMARY_A100,
  },
  inputReason: {
    height: 150,
    borderRadius: SIZES.BORDER_RADIUS_88,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_F0,
    marginTop: normal,
    padding: normal,
  },
});

const ModalCancelRequest = forwardRef(({onApply, queryOptions, initState}, ref) => {
  const [listReason, setListReason] = useState([]);
  const [state, setState] = useState(initState);

  const {startApi: getReasonsReject} = useGraphqlApiLazy({
    graphqlApiLazy: queryOptions.query,
    dataField: queryOptions.dataField,
    onSuccess: data => {
      const items = dropdownMapper(
        data?.edges ?? [],
        queryOptions.dataKey.id,
        queryOptions.dataKey.description,
      );
      setListReason(items);
    },
  });

  const onPressReset = () => {
    setState(initState);
    setListReason(listReason.map(item => ({...item, checked: false})));
  };

  useMount(() => {
    getReasonsReject();
  });

  const onChangeState = (type, value) => {
    setState({...state, [type]: value});
  };

  const buttonSubmit =
    state.reasonId === null ||
    (state.reasonId === SUPPORT_SERVICE_CANCEL_REASON.Other && isEmpty(state.reasonNote))
      ? {
          disabled: true,
          style: {...commonStyles.disabledButtonConfirm, marginLeft: normal},
        }
      : {
          disabled: false,
          style: styles.btnApply,
        };

  return (
    <ModalWithModalize
      scrollViewProps={{scrollEnabled: false}}
      withReactModal={Platform.OS === 'ios'}
      getModalRef={ref}>
      <View style={{padding: normal}}>
        <Text style={styles.title}>{translate('supportRequest.cancel.title')}</Text>
        <Text style={styles.label}>{translate('supportRequest.cancel.reason')}</Text>
        <DropdownWithTitle
          inputStyle={styles.dropdown}
          dropdownTitle={translate('supportRequest.dropdownTitle')}
          isSelectSingle={true}
          isRequiredAtLeastOne={true}
          items={listReason}
          onChosen={e => onChangeState('reasonId', e.id)}
        />
        {state.reasonId === SUPPORT_SERVICE_CANCEL_REASON.Other && (
          <>
            <Text style={styles.label}>{translate('supportRequest.cancel.content')}</Text>
            <TextInput
              value={state.reasonNote}
              multiline
              onChangeText={text => onChangeState('reasonNote', text)}
              style={styles.inputReason}
            />
          </>
        )}
        <View style={styles.viewBottom}>
          <CustomButton
            style={styles.btnReset}
            title={translate('social.modalSort.reset')}
            onPress={onPressReset}
          />
          <CustomButton
            style={buttonSubmit.style}
            disabled={buttonSubmit.disabled}
            onPress={() => onApply(state)}
            title={translate('social.modalSort.apply')}
          />
        </View>
      </View>
    </ModalWithModalize>
  );
});

export default ModalCancelRequest;
