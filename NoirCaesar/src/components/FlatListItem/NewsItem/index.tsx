import { View, Image } from 'react-native';
import styles from './styles';
import React, { useState } from 'react';
import FastImage from 'react-native-fast-image';
import { CustomText } from '@src/components/CustomText';
import { PODCAST, COINS } from '@src/constants/icons';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { formatDate } from '@src/utils/date';
import { IStory } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv/models';
import { get } from 'lodash';
import { WIDTH_RATIO } from '@src/constants/vars';
import { formatCoin } from '@src/utils';
import { CustomPopup } from '@src/components/CustomPopup';
import translate from '@src/localize';
import { useDispatch } from 'react-redux';
import NavigationActionsService from '@src/navigation/navigation';
import { purchaseEpisode } from '@src/modules/tv/actions';

interface Props {
  item: IStory;
  onPressItem: () => void;
  onRefreshData: () => void;
}

const NewsItem = (props: Props) => {
  const { item, onPressItem, onRefreshData } = props;
  const dispatch = useDispatch()
  const [showBuyChapterPopup, setShowBuyChapterPopup] = useState<boolean>(false);
  const date = get(item, ['episode', 'created'], '');
  const description = get(item, ['description'], '');
  const allow_read = get(item, ['episode', 'allow_read'], undefined);
  const coins = get(item, ['episode', 'coins'], 0);
  const id = get(item, ['episode', 'id'], '');

  const onPressActivePopup = () => {
    setShowBuyChapterPopup(false);
    NavigationActionsService.showLoading()
    dispatch(purchaseEpisode({
      episode_id: id,
      onSuccess: () => {
        setTimeout(() => {
          onRefreshData()
          NavigationActionsService.hideLoading();
        }, 500);
      },
      onFail: (error) => {
        setTimeout(() => {
          NavigationActionsService.hideLoading();
          NavigationActionsService.showErrorPopup(error);
        }, 500);
      }
    }))
  };

  const onPressInactivePopup = () => {
    setShowBuyChapterPopup(false);
  };

  const renderTitle = () => {
    const titleWidth = !allow_read ? 150 * WIDTH_RATIO : '100%';
    return (
      <View style={styles.titleContainer}>
        <CustomText style={[styles.title, { width: titleWidth }]} numberOfLines={1} text={item.name} />
        {!allow_read && (
          <View style={styles.coinContainer}>
            <Image resizeMode="contain" source={COINS} style={styles.iconCoins} />
            <CustomText style={styles.textCoins} text={formatCoin(coins)} />
          </View>
        )}
      </View>
    );
  };

  const onPress = () => {
    if (allow_read) {
      onPressItem();
    } else {
      setShowBuyChapterPopup(true);
    }
  };

  return (
    <CustomTouchable onPress={onPress}>
      <CustomPopup
        text={`${translate('books.buy_chapter_popup')} "${item.name}" for ${formatCoin(coins ? coins : 0)}?`}
        loading={showBuyChapterPopup}
        buttonRedTitle={translate('common.yes')}
        buttonGrayTitle={translate('common.cancel')}
        onPressRedButton={onPressActivePopup}
        onPressGrayButton={onPressInactivePopup}
      />
      <View style={styles.container}>
        <FastImage style={styles.image} resizeMode="contain" source={item.image_thumb ? { uri: item.image_thumb } : PODCAST} />
        <View style={styles.textContainer}>
          {renderTitle()}
          <CustomText numberOfLines={1} style={styles.date} text={formatDate(date)} />
          <CustomText numberOfLines={3} style={styles.content} text={description} />
        </View>
      </View>
    </CustomTouchable>
  );
};

export { NewsItem };
