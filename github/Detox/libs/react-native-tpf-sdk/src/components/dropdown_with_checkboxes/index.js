import React, { useCallback, useContext, useMemo } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import themeContext from '../../constants/theme/themeContext';
import { ICClose, ICWhiteCheck } from '../../assets/icons';
import AppText from '../../components/app_text';
import styles from './styles';

const Item = ({
  value,
  chooseItem,
  displayName,
  currentValue,
  checkBoxStyle,
  translateItem = false
}) => {
  const theme = useContext(themeContext);

  const onPress = useCallback(() => {
    chooseItem(value);
  }, [chooseItem, value]);
  const _checkBoxStyle = useMemo(() => {
    return [styles.checkBox, checkBoxStyle, currentValue.includes(value) && styles.checkedBox];
  }, [currentValue, value, checkBoxStyle]);

  return (
    <View style={styles.item}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <View style={_checkBoxStyle} />
      </TouchableOpacity>
      <AppText translate={translateItem} style={styles.displayName}>
        {displayName || ''}
      </AppText>
      <ICWhiteCheck style={styles.checkIcon} />
    </View>
  );
};

const DropDownWithCheckBoxes = ({
  modalIsOpen = false,
  closeModal,
  title,
  list,
  chooseItem,
  currentValue = [],
  onConfirm,
  checkBoxStyle,
  translateTitle = false,
  translateItem = false,
  translateValue = false
}) => {
  const renderItem = useCallback(
    ({ item }) => (
      <Item
        translateItem={translateItem}
        currentValue={currentValue}
        value={item?.status}
        chooseItem={chooseItem}
        displayName={item?.displayName || item?.title || item?.name || ''}
        checkBoxStyle={checkBoxStyle}
        translateValue={translateValue}
      />
    ),
    [currentValue, chooseItem, checkBoxStyle, translateValue]
  );
  return (
    <Modal
      hideModalContentWhileAnimating
      isVisible={modalIsOpen}
      style={styles.modal}
      useNativeDriver={true}
      onBackdropPress={closeModal}>
      <View style={styles.modalWrapper}>
        <View style={styles.modalTitle}>
          <TouchableOpacity onPress={closeModal} style={styles.left}>
            <ICClose />
          </TouchableOpacity>
          <AppText translate={translateTitle} semiBold style={styles.title}>
            {title}
          </AppText>
          <View style={styles.right}>
            <TouchableOpacity onPress={onConfirm} style={styles.rightBtn}>
              <AppText
                translate
                semiBold
                style={[styles.textBtn, { color: theme?.app?.primaryColor1 }]}>
                {'common.select'}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.modalContent}>
          <FlatList
            data={list}
            bounces={false}
            style={styles.list}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <AppText translate style={styles.noData}>
                {'common.noData'}
              </AppText>
            }
            keyExtractor={(item, index) => index + ''}
          />
        </View>
        <View style={styles.modalControl} />
      </View>
    </Modal>
  );
};

export default React.memo(DropDownWithCheckBoxes);
