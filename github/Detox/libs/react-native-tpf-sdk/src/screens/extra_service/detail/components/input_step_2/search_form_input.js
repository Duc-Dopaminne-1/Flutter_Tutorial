import React, { useState, useCallback, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ATTRIBUTE_TYPE } from '../../../../../global/entity_type';
import { parseToLocationForm } from '../../../../../helpers/entityData';
import CustomInput from '../../../../../components/custom_input';
import { Heading } from '../../../../../components';
import { scale } from '../../../../../utils/responsive';
import { ICSearchField } from '../../../../../assets/icons';
import __ from 'lodash';
import themeContext from '../../../../../constants/theme/themeContext';
const SearchFormInput = props => {
  const { listComponent, onChange, onSearch } = props;
  const [textSearch, setTextSearch] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const theme = useContext(themeContext);
  const onChangeInput = useCallback(
    (attributeId, value) => {
      let newData = [...listComponent];
      let attributeIdx = newData.findIndex(t => t.attributeId === attributeId);
      if (newData[attributeIdx].type === ATTRIBUTE_TYPE.address) {
        newData[attributeIdx]?.addressDetail?.map(t => {
          t.value = value[__.camelCase(t.code)];
        });
      } else if (newData[attributeIdx].type === ATTRIBUTE_TYPE.media) {
        newData[attributeIdx].mediaUploadValue = value;
      } else {
        newData[attributeIdx].value = value;
      }
      onChange(newData);
    },
    [listComponent]
  );
  const handleSearch = () => {
    setIsSearch(true);
    onSearch(textSearch);
  };
  const onChangeSearch = text => {
    if (isSearch && text === '') {
      setIsSearch(false);
      onSearch('');
    }
    setTextSearch(text);
  };
  return (
    <View style={styles.container}>
      <Heading bold translate>
        extra_service_detail.search_partner_product_service
      </Heading>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(15) }}>
        <CustomInput
          style={{ flex: 1, marginTop: 0 }}
          translate
          placeholder="extra_service_detail.search_partner_product_service"
          value={textSearch}
          onChangeText={onChangeSearch}
        />
        <TouchableOpacity
          style={[styles.buttonSearch, { backgroundColor: theme.app.primaryColor1 }]}
          onPress={handleSearch}>
          <ICSearchField width={24} height={24} stroke={'#FFF'} />
        </TouchableOpacity>
      </View>
      {listComponent?.map(item => {
        let location = null;
        let options = null;
        if (item.type === ATTRIBUTE_TYPE.address) {
          location = parseToLocationForm(item?.addressDetail);
        } else if (item.type === 'select') {
          options = item.options.map(item => ({ displayName: item.label, code: '' + item.value }));
        }
        if (item.hidden) {
          return null;
        }
        return (
          <CustomInput
            hideTitle
            translateTitle
            item={item}
            key={'' + item.attributeId}
            type={item.type}
            title={item?.name}
            placeholder={item?.name}
            value={item?.value}
            onChangeText={(value, error) => {
              onChangeInput(item?.attributeId, value, error);
            }}
            location={location}
            selectOptions={options}
            hasExtend={item.type === ATTRIBUTE_TYPE.textarea}
            multiline={item.type === ATTRIBUTE_TYPE.textarea}
          />
        );
      })}
    </View>
  );
};
export default React.memo(SearchFormInput);
const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(15),
    padding: scale(16),
    marginBottom: scale(20),
    borderRadius: scale(6),
    marginTop: 2,
    backgroundColor: '#FFF',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  buttonSearch: {
    marginLeft: scale(15),
    height: scale(45),
    width: scale(45),
    borderRadius: scale(4),
    alignItems: 'center',
    justifyContent: 'center'
  }
});
