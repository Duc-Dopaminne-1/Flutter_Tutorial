import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {ITEM_TYPE} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {normal} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomFooterButtons from '../../../../components/Button/CustomFooterButtons';
import ModalWithModalize from '../../../../components/Modal/ModalWithModalize';
import RadioSelectionsView from '../../../../components/RadioSelectionsView';

const styles = StyleSheet.create({
  title: {textAlign: 'center', ...FONTS.bold, fontSize: 20, marginVertical: normal},
});

export const commonCheckBoxStyle = {
  style: HELPERS.fill,
  textStyle: {
    ...FONTS.fontSize14,
  },
};

const FilterType = ({onSelectItem, typeSelect, data, onClose, getModalRef}) => {
  const [listData, setListData] = useState(data);
  const [selectItem, setSelectItem] = useState(typeSelect);
  useEffect(() => {
    const list = listData.map(item => ({
      id: item.id,
      title: item.title,
      value: item.value,
      isChecked: item.id === typeSelect.id,
    }));
    setListData(list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeSelect]);

  const setItemSelect = item => {
    setSelectItem(item);
  };

  const onSubmitSelect = () => {
    onSelectItem(selectItem);
  };

  return (
    <>
      <ModalWithModalize getModalRef={getModalRef}>
        <View style={{padding: normal}}>
          <Text style={styles.title}>{translate('contactTradingB2C.filter.title')}</Text>
          <RadioSelectionsView data={listData} type={ITEM_TYPE.full} onChosen={setItemSelect} />
        </View>
        <View style={[commonStyles.footerContainerStyle, commonStyles.shadowApp]}>
          <CustomFooterButtons
            nextButtonStyle={commonStyles.enableColorButton}
            onPressCancel={onClose}
            onPressNext={onSubmitSelect}
            cancelButtonTitle={translate(STRINGS.DISCARD)}
            nextButtonTitle={translate(STRINGS.CONFIRM)}
          />
        </View>
      </ModalWithModalize>
    </>
  );
};

export default FilterType;
