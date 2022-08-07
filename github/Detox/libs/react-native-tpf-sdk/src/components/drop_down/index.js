import __ from 'lodash';
import React, { useContext } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { ICClose, ICTickSelect } from '../../assets/icons';
import AppText from '../../components/app_text';
import { removeAscent } from '../../helpers/removeAscent';
import styles from './styles';
import SearchInput from '../../components/search_input';
import themeContext from '../../constants/theme/themeContext';

const Item = ({ displayName, code, chooseItem, currentCode, theme }) => {
  const onPress = () => {
    chooseItem?.(code);
  };
  return (
    <TouchableOpacity style={styles.item} activeOpacity={0.8} onPress={onPress}>
      <AppText translate style={styles.displayName}>
        {displayName || ''}
      </AppText>
      {code === currentCode ? (
        <ICTickSelect color1={theme?.icon?.color1} style={styles.checkIcon} />
      ) : null}
    </TouchableOpacity>
  );
};

const DropDown = ({
  modalIsOpen = false,
  closeModal,
  title,
  list,
  chooseItem,
  currentCode,
  renderDropdownItem,
  hasRightButton,
  translateTitle = false,
  showSearch = false
}) => {
  const [data, setData] = React.useState(list);
  const theme = useContext(themeContext);

  const renderItem = ({ item }) => {
    return (
      <Item
        currentCode={currentCode}
        code={item?.code || '0'}
        chooseItem={code => {
          closeModal();
          chooseItem(code);
        }}
        displayName={item?.displayName || ''}
        theme={theme}
      />
    );
  };

  React.useEffect(() => {
    setData(list);
  }, [list]);

  const onSearch = __.debounce(text => {
    const searchList = [...list].filter(o =>
      removeAscent(o?.displayName?.toLowerCase() + '').includes(removeAscent(text))
    );
    setData(searchList);
  }, 500);

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
          {hasRightButton ? (
            <TouchableOpacity onPress={closeModal} style={styles.right}>
              <AppText
                translate
                semiBold
                style={[styles.textBtn, { color: theme?.app?.primaryColor1 }]}>
                {'common.select'}
              </AppText>
            </TouchableOpacity>
          ) : (
            <View style={styles.right} />
          )}
        </View>
        <View style={styles.modalContent}>
          {showSearch ? (
            <View style={styles.searchContainer}>
              <SearchInput style={styles.searchInput} onSearch={onSearch} />
            </View>
          ) : null}
          <FlatList
            data={data}
            bounces={false}
            contentContainerStyle={styles.wrapper}
            renderItem={renderDropdownItem || renderItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <AppText translate style={styles.noData} bold={true}>
                {'common.noData'}
              </AppText>
            }
            keyExtractor={(item, index) => index + ''}
            initialNumToRender={data.length}
          />
        </View>
        <View style={styles.modalControl} />
      </View>
    </Modal>
  );
};

DropDown.propTypes = {
  // bla: PropTypes.string,
};

DropDown.defaultProps = {
  // bla: 'test',
};

export default DropDown;
