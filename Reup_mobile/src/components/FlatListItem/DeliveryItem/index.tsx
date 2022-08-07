import React from 'react';
import { View, Image } from 'react-native';
import styles from './styles';
import { CustomText } from '@src/components/CustomText';
import { CustomTouchable } from '@src/components/CustomTouchable';
import translate from '@src/localize';
import { TICK_DONE_ICON } from '@src/constants/icons';
import { Theme } from '@src/components/Theme';
import { IDelivery } from '@reup/reup-api-sdk/libs/api/frontdesk/delivery/model';
import { DeliveryState } from '@reup/reup-api-sdk/src/api/enum';
import { formatTime, getApartmentName } from '@src/utils';

interface Props {
  onPress: (item: IDelivery) => void;
  item: IDelivery;
};

const DeliveryItem = (props: Props) => {
  const { item, onPress } = props;

  const renderContentLeft = () => {
    return (
      <View style={styles.leftContent}>
        <CustomText
          text={item && getApartmentName(item.unit.block, item.unit.floor, item.unit.code)}
          styleContainer={styles.idContainerView}
          style={styles.id}
          numberOfLines={2}
        />
        <CustomText
          text={item && formatTime(item.shipped_date)}
          styleContainer={styles.dateContainerView}
          style={styles.date}
          numberOfLines={1}
        />
      </View>
    );
  };

  const renderContentRight = () => {
    return (
      <View style={styles.rightContent}>
        <CustomText
          text={item && item.title}
          styleContainer={styles.nameContainerView}
          style={styles.name}
          numberOfLines={1}
        />
        <View style={styles.descriptionView}>
          <CustomText
            text={item && item.shipping_unit}
            styleContainer={styles.descriptionContainerView}
            style={styles.description}
            numberOfLines={1}
          />
          {renderStatusDelivery()}
        </View>
      </View>
    );
  };

  const renderStatusDelivery = () => {
    const title = item && item.state == DeliveryState.Shipped ? translate('deliveries.shipped_status') : translate('deliveries.draft_status');
    const backgroundColorView =
      item && item.state == DeliveryState.Shipped ? Theme.deliveries.receive_status_button : Theme.deliveries.waiting_status_button;
    const textColor = item && item.state == DeliveryState.Shipped ? Theme.deliveries.receive_text : Theme.deliveries.waiting_text;

    return (
      <View style={styles.statusDelivery}>
        {item && item.state == DeliveryState.Shipped ? null : (
          <CustomTouchable style={styles.checkShippedButton} onPress={() => onPress(item)}>
            <Image source={TICK_DONE_ICON} style={styles.image} resizeMode='contain' />
          </CustomTouchable>
        )}
        <View style={[styles.statusView, { backgroundColor: backgroundColorView }]}>
          <CustomText text={title} style={[styles.statusText, { color: textColor }]} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderContentLeft()}
      {renderContentRight()}
    </View>
  );
};

export default React.memo(DeliveryItem);
