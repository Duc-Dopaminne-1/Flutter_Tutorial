import React, { ReactElement, memo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { language } from '@/i18n';
import ErrorMessage from '@/components/ErrorMessage';
import { FormikValues } from 'formik';
import { CreateAuctionTitle } from '@/screens/CreateAuction/component/CreateAuctionTitle';
import CreateAuctionDurationItem from './CreateAuctionDurationItem';
import { useSelector } from 'react-redux';
import { AuctionState } from '@/redux/auction/reducer';

function CreateAuctionTimeMeet({ setFieldValue, errors, setFieldError }: FormikValues): ReactElement {
  const timeMeet = useSelector((state: AuctionState) => state.auction.timeAuction.timeMeet);
  const [itemSelected, setItemSelected] = useState(0);

  const onPressItem = (id: number) => {
    setFieldValue('timeMeetId', id);
    setFieldError('timeMeetId', '');
    setItemSelected(id);
  };

  const renderItem = ({ item }) => {
    return <CreateAuctionDurationItem itemId={itemSelected} onPress={item => onPressItem(item.id)} item={item} />;
  };

  return (
    <View style={styles.container}>
      <CreateAuctionTitle isRequire title={language('timeInterval')} />
      <View style={styles.wrapTopDuration}>
        <FlatList data={timeMeet} scrollEnabled={false} numColumns={3} renderItem={renderItem} keyExtractor={item => item.id.toString()} />
      </View>
      <ErrorMessage errorValue={errors.timeMeetId} />
    </View>
  );
}

export default memo(CreateAuctionTimeMeet);

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  wrapTopDuration: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 2,
  },
});
