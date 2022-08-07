import React, { ReactElement, useEffect, useState, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { language } from '@/i18n';
import DropdownNative from '@/components/CustomDropdown';
import { FormikValues } from 'formik';
import { useDispatch } from 'react-redux';
import { alertError } from '@/shared/alert';
import { getDonatePercents } from '@/redux/auction/actions';
import { CreateAuctionTitle } from '@/screens/CreateAuction/component/CreateAuctionTitle';

function CreateAuctionDonate({ setFieldValue, errors }: FormikValues): ReactElement {
  const [indexSelected, setIndexSelected] = useState(0);
  const dispatch = useDispatch();
  const [listPercents, setListPercents] = useState([]);

  useEffect(() => {
    dispatch(
      getDonatePercents({
        onSuccess,
        onFail: onFail,
      }),
    );
  }, []);

  const convertValue = (percent: string): number => {
    return parseInt(percent.replace('%', ''));
  };

  const onSuccess = (data: any) => {
    const options = data.items.map((option: any) => {
      return { _key: option.id, _value: option.name };
    });
    options.sort((a, b) =>
      convertValue(a._value) > convertValue(b._value) ? 1 : convertValue(b._value) > convertValue(a._value) ? -1 : 0,
    );
    setFieldValue('donate', options[0]._key);
    setFieldValue('donate', options[0]._key);
    setListPercents(options ? options : []);
  };

  const onFail = (error: string) => {
    alertError(error);
  };

  const onChangeClinic = (obj: any) => {
    const indexItem = listPercents.findIndex(item => item._key === obj._key);
    const item = listPercents.find(item => item._key === obj._key);
    setIndexSelected(indexItem);
    setFieldValue('donate', item._key);
  };

  return (
    <View style={styles.container}>
      <CreateAuctionTitle title={language('donateCharity')} subTitle={language('donateCharitySubtitle')} />
      <DropdownNative
        textTitle={language('donate')}
        containerStyle={styles.wrapDropdown}
        onChangeDropDown={onChangeClinic}
        lineBottom={false}
        limitLineError={false}
        selected={indexSelected}
        arrData={listPercents}
        showError={!!errors.donate}
        errorText={errors.donate}
      />
    </View>
  );
}

export default memo(CreateAuctionDonate);

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  wrapDropdown: {
    height: 42,
    marginTop: 14,
    width: '100%',
  },
});
