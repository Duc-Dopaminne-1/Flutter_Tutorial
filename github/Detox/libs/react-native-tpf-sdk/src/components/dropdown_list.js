import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ICDropDown } from '../assets/icons';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../constants/colors';
import { SPACING } from '../constants/size';
import AppText from './app_text';
import Divider from './divider';
import DropDown from './drop_down';
import { scale } from '../utils/responsive';
import themeContext from '../constants/theme/themeContext';

const DropDownList = ({
  value,
  data = [],
  title,
  style,
  placeholder,
  borderBottomColor,
  onChangeValue,
  renderDropdownItem,
  labelInput,
  hasRightButton,
  disable,
  isRequired = false,
  translateItem = false,
  icDropdown,
  translateTitle = false,
  translateValue = false,
  showSearch = false,
  hideTitle = false
}) => {
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  // const [list, setList] = React.useState(data);
  const theme = useContext(themeContext);
  const onToggle = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const chooseItem = code => {
    onChangeValue(code);
  };

  // React.useEffect(() => {
  //   setList(data);
  // }, [data]);

  const label = data?.find(t => t.code === value)?.displayName;
  const RequireCharacter = isRequired ? <Text style={styles.iconRequired}>{' *'}</Text> : null;
  return (
    <View style={[styles.container, style]}>
      {title && !hideTitle ? (
        <View style={{ flexDirection: 'row' }}>
          <AppText
            translate={translateTitle}
            style={[styles.title, { color: theme?.text?.primary }]}>
            {title}
          </AppText>
          {RequireCharacter}
        </View>
      ) : null}

      <TouchableOpacity style={styles.comboBoxContainer} onPress={onToggle}>
        <View style={styles.textComboBoxContainer}>
          <AppText
            translate={translateValue}
            style={[
              styles.textComboBox,
              { color: theme.text.primary }
              //!labelInput && !label && { color: theme?.app?.secondary }
            ]}>
            {labelInput || label || placeholder}
          </AppText>
        </View>
        <View style={{ position: 'absolute', right: 10 }}>
          {!disable ? icDropdown ? icDropdown : <ICDropDown /> : null}
        </View>
      </TouchableOpacity>
      {[...data].length > 0 ? (
        <DropDown
          key={'modal_01'}
          translateItem={translateItem}
          translateTitle={translateTitle}
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          title={title}
          list={data}
          showSearch={showSearch}
          chooseItem={chooseItem}
          currentCode={value}
          renderDropdownItem={renderDropdownItem}
          hasRightButton={hasRightButton}
          translateValue={translateValue}
        />
      ) : (
        <DropDown
          key={'modal_02'}
          translateItem={translateItem}
          translateTitle={translateTitle}
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          title={title}
          list={data}
          showSearch={showSearch}
          chooseItem={chooseItem}
          currentCode={value}
          renderDropdownItem={renderDropdownItem}
          hasRightButton={hasRightButton}
          translateValue={translateValue}
        />
      )}
    </View>
  );
};

export default DropDownList;

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: SPACING.Medium
  },
  iconRequired: {
    color: CUSTOM_COLOR.Red
  },
  title: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    paddingBottom: SPACING.Normal
  },
  placeholder: {
    color: CUSTOM_COLOR.RegentGray
  },
  comboBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    minHeight: scale(45),
    borderRadius: 4,
    borderColor: CUSTOM_COLOR.grayBoder,
    borderWidth: 1
  },
  textComboBoxContainer: {
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 10,
    borderRadius: 15,
    paddingVertical: 5,
    marginRight: 15
  },
  textComboBox: {
    lineHeight: LINE_HEIGHT.Small,
    fontSize: FONT_SIZE.SubHead
  }
});
