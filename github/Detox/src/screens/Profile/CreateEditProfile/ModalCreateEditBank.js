import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Portal} from 'react-native-portalize';

import {KEY_BOARD_TYPE, MAX_LENGTH} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';
import CustomCheckbox from '../../../components/Checkbox/CustomCheckbox';
import DropdownWithTitle from '../../../components/DropdownWithTitle';
import InputSection from '../../../components/InputSection';
import ModalWithModalize from '../../../components/Modal/ModalWithModalize';
import {SizeBox} from '../../../components/SizeBox';
import {dropdownMapper} from '../../../utils/DataProcessUtil';

export const ModalCreateEditBank = ({
  modalRef,
  listBanks = [],
  state,
  onChangeData,
  createBank,
  updateBank,
  isShowOptionDefault,
}) => {
  const {
    isUpdate,
    bankId,
    bankAccountBranch,
    bankAccountNumber,
    bankAccountHolderName,
    isDefault,
    errors,
  } = state;
  const closeModal = () => {
    modalRef?.current?.close();
  };
  const onPressNext = () => {
    if (isUpdate) {
      updateBank && updateBank();
    } else {
      createBank && createBank();
    }
  };
  return (
    <Portal>
      <ModalWithModalize getModalRef={modalRef} handlePosition="outside">
        <View style={styles.container}>
          <Text style={styles.title}>
            {translate(isUpdate ? 'agent.bank.editBank' : 'agent.bank.createBank')}
          </Text>
          <SizeBox height={SIZES.SEPARATOR_16} />
          <DropdownWithTitle
            inputStyle={commonStyles.dropdownInput}
            title={translate('agent.bank.nameBank')}
            headerStyles={styles.inputTitle}
            showSearchBox={true}
            dropdownPlaceHolderStyle={{
              ...commonStyles.dropdownPlaceHolder,
            }}
            dropdownTitle={translate('agent.bank.modal.placeholder.nameBank')}
            popupTitle={translate('transaction.pleaseSelectBank')}
            items={dropdownMapper(listBanks, 'bankId', 'bankFullName', bankId)}
            itemSelected={() => {}}
            onChosen={item => onChangeData(item?.id, 'bankId')}
            isRequiredAtLeastOne
            isRequired
            emptyText={translate(STRINGS.DO_NOT_HAVE_DATA)}
            error={errors?.bankId}
          />
          <InputSection
            headerTitle={translate('agent.bank.nameBranch')}
            isRequired
            value={bankAccountBranch}
            onChangeText={value => onChangeData(value, 'bankAccountBranch')}
            inputStyle={commonStyles.inputBorder}
            maxLength={MAX_LENGTH.default}
            placeholder={translate('agent.bank.modal.placeholder.nameBranch')}
            error={errors?.bankAccountBranch}
          />
          <InputSection
            headerTitle={translate('agent.bank.accountNumber')}
            isRequired
            value={bankAccountNumber}
            keyboardType={KEY_BOARD_TYPE.INT_NUMBER}
            onChangeText={value => onChangeData(value, 'bankAccountNumber')}
            inputStyle={commonStyles.inputBorder}
            maxLength={MAX_LENGTH.accountNumber}
            placeholder={translate('agent.bank.modal.placeholder.accountNumber')}
            error={errors?.bankAccountNumber}
          />
          <InputSection
            headerTitle={translate('agent.bank.holderBank')}
            isRequired
            value={bankAccountHolderName}
            onChangeText={value => onChangeData(value, 'bankAccountHolderName')}
            inputStyle={commonStyles.inputBorder}
            maxLength={MAX_LENGTH.default}
            placeholder={translate('agent.bank.modal.placeholder.fullName')}
            error={errors?.bankAccountHolderName}
          />
          {isShowOptionDefault && !isUpdate && (
            <CustomCheckbox
              images={['checkbox', 'checkbox-blank-outline']}
              parentCheckedValue={isDefault}
              customCheckedBox
              title={translate('agent.bank.choiceDefault')}
              checkValue={value => onChangeData(value, 'isDefault')}
            />
          )}
        </View>
        <View style={styles.footer}>
          <CustomButton
            mode="outline"
            title={translate('agent.bank.button.cancel')}
            onPress={closeModal}
            style={styles.flex1}
          />
          <SizeBox width={SIZES.SEPARATOR_12} />
          <CustomButton
            mode="primary"
            title={translate(isUpdate ? 'agent.bank.button.update' : 'agent.bank.button.add')}
            onPress={onPressNext}
            style={styles.flex1}
          />
        </View>
        <SafeAreaView />
      </ModalWithModalize>
    </Portal>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderTopEndRadius: SIZES.BORDER_RADIUS_16,
    borderTopStartRadius: SIZES.BORDER_RADIUS_16,
    padding: SIZES.PADDING_16,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.FONT_24,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.PADDING_16,
    borderTopWidth: 1,
    borderColor: COLORS.NEUTRAL_GRAY_BG,
  },
});
