import { getMasterDataHandle } from '../../redux/actions/masterData';
import __, { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CustomInput } from '..';
import DropDown from '../../components/drop_down';
import styles from './styles';

const SelectBank = ({ title, style, bankBranchCode, onChangeValue, bankCode }) => {
  const dispatch = useDispatch();

  const bank = useSelector(state => state.masterData.bank);

  useEffect(() => {
    if (!bank || isEmpty(bank) || bank?.length === 0) {
      dispatch(getMasterDataHandle());
    }
  }, [bank, dispatch]);

  const [list, setList] = React.useState([]);
  const [modalTile, setModalTile] = React.useState('');
  const [modalType, setModalType] = React.useState(0);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  const checkSelected = [bankCode, bankBranchCode];
  const bankList = __.filter(bank, obj => !obj?.parentCode);
  const bankBranch = __.filter(bank, obj => obj?.parentCode === bankCode);
  const bankName = __.find(bankList, obj => obj?.code === bankCode)?.displayName || '';
  const bankBranchName =
    __.find(bankBranch, obj => obj?.code === bankBranchCode)?.displayName || '';

  const styleCustom = StyleSheet.flatten(style);
  const styleComposer = StyleSheet.compose(styles.wrapper, styleCustom);

  const onToggle =
    (name, data, type = 0) =>
    value => {
      setModalTile(name);
      setModalType(type);
      setList(data || []);
      setModalIsOpen(true);
    };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const chooseItem = code => {
    if (modalType === 0) {
      onChangeValue?.({
        bankCode: code,
        bankBranchCode: ''
      });
      return;
    }

    onChangeValue?.({
      bankCode,
      bankBranchCode: code
    });
  };

  return (
    <View style={styleComposer}>
      {title ? (
        <View style={styles.titleWrapper}>
          <Text style={styles.formTitle}>{title}</Text>
        </View>
      ) : null}
      <CustomInput
        translateTitle
        type="dropdown"
        value={bankName}
        style={styles.input}
        title={'common.bank'}
        onVisibleChange={onToggle('common.bank', bankList, 0)}
      />
      <DropDown
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        title={modalTile}
        list={list}
        chooseItem={chooseItem}
        currentCode={checkSelected[modalType]}
      />
    </View>
  );
};

SelectBank.propTypes = {
  title: PropTypes.string,
  bankCode: PropTypes.string,
  bankBranchCode: PropTypes.string,
  onChangeValue: PropTypes.func.isRequired
};

SelectBank.defaultProps = {
  provinceCityCode: 'HCM',
  style: {}
};

const areEqual = (preProps, nextProps) => {
  return (
    preProps.title === nextProps.title &&
    preProps.bankCode === nextProps.bankCode &&
    preProps.bankBranchCode === nextProps.bankBranchCode
  );
};

export default React.memo(SelectBank, areEqual);
