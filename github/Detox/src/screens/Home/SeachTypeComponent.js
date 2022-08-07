import React from 'react';
import {View} from 'react-native';
import Select2 from 'react-native-select-two';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {FONT_REGULAR} from '../../assets/fonts';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import styles from './styles';

export const ID_B2C = 1;
export const ID_C2C = 2;
export const ID_AGENT = 3;

const itemsTypeSearch = [
  {id: ID_B2C, name: 'Dự án', checked: true},
  {id: ID_C2C, name: 'Nhà lẻ'},
  {id: ID_AGENT, name: 'Đối tác'},
];

const SeachTypeComponent = ({setSelectedId}) => {
  const onSelect = data => {
    const id = data[0];
    setSelectedId(id);
  };

  return (
    <View style={styles.viewSelectType}>
      <MaterialCommunityIcons
        pointerEvents="none"
        size={24}
        name="chevron-down"
        style={styles.iconDropdownFilter}
        color={COLORS.TEXT_DARK_10}
      />
      <Select2
        style={styles.selectType}
        isSelectSingle={true}
        isRequiredAtLeastOne={true}
        colorTheme={COLORS.PRIMARY_A100}
        defaultFontName={FONT_REGULAR}
        data={itemsTypeSearch}
        onSelect={onSelect}
        showSearchBox={false}
        popupTitle={'Loại hình tìm kiếm'}
        title={'Tìm kiếm'}
        cancelButtonText={translate(STRINGS.CANCEL)}
        selectButtonText={translate(STRINGS.SELECT)}
        searchPlaceHolderText={'Search'}
      />
      <View style={styles.lineSperator} />
    </View>
  );
};

SeachTypeComponent.propTypes = {};

export default SeachTypeComponent;
