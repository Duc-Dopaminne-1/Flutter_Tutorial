import React, { ReactElement, memo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { language } from '@/i18n';
import CreateAuctionDurationItem from '@/screens/CreateAuction/component/CreateAuctionDurationItem';
import ErrorMessage from '@/components/ErrorMessage';
import { FormikValues } from 'formik';
import { DurationProp } from '@/redux/auction';
import { CreateAuctionTitle } from '@/screens/CreateAuction/component/CreateAuctionTitle';
import { useSelector } from 'react-redux';
import { AuctionState } from '@/redux/auction/reducer';

function CreateAuctionDuration({ setFieldValue, errors, setFieldError, isFromRaffle }: FormikValues): ReactElement {
  const duration = useSelector((state: AuctionState) => {
    if (isFromRaffle) {
      return state.auction.timeAuction.raffle;
    }
    return state.auction.timeAuction.duration;
  });
  const [itemId, setItemId] = useState(0);

  const onPressItem = (value: DurationProp) => {
    setFieldValue('durationId', value.id);
    setFieldValue('durationTime', value.seconds);
    setFieldError('durationId', '');
    setFieldError('durationTime', '');
    setItemId(value.id);
  };

  const renderItem = ({ item }) => {
    return <CreateAuctionDurationItem itemId={itemId} onPress={onPressItem} item={item} />;
  };

  const keyExtractor = item => item.id.toString();

  return (
    <View style={styles.container}>
      <CreateAuctionTitle isRequire title={language('duration')} />

      <View style={styles.wrapTopDuration}>
        <FlatList
          data={duration}
          scrollEnabled={false}
          numColumns={3}
          key={'durationId'}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </View>
      <ErrorMessage errorValue={errors.durationId} />
    </View>
  );
}

export default memo(CreateAuctionDuration);

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  wrapTopDuration: {
    flexDirection: 'row',
    marginTop: 2,
  },
});
