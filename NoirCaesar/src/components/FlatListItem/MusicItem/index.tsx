import { View, Image } from 'react-native';
import styles from './styles';
import React, { useState } from 'react';
import { CustomText } from '@src/components/CustomText';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { formatTimePlayer } from '@src/utils/date';
import DefaultImage from '@src/components/DefaultImage';
import { IEpisode } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv/models';
import { WIDTH_RATIO } from '@src/constants/vars';
import { COINS } from '@src/constants/icons';
import { formatCoin } from '@src/utils';
import { CustomPopup } from '@src/components/CustomPopup';
import translate from '@src/localize';
import { useDispatch } from 'react-redux';
import NavigationActionsService from '@src/navigation/navigation';
import { purchaseEpisode } from '@src/modules/tv/actions';

interface Props {
  url: string;
  item: IEpisode;
  onPressItem: () => void;
  onRefreshData?: () => void;
}

const MusicItem = (props: Props) => {
  const { url, item, onPressItem, onRefreshData } = props;
  const dispatch = useDispatch();
  const [showBuyChapterPopup, setShowBuyChapterPopup] = useState<boolean>(false);

  const onPressActivePopup = () => {
    setShowBuyChapterPopup(false);
    NavigationActionsService.showLoading()
    dispatch(purchaseEpisode({
      episode_id: item.id,
      onSuccess: () => {
        setTimeout(() => {
          onRefreshData && onRefreshData();
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
    const titleWidth = !item.allow_read && item.coins ? 150 * WIDTH_RATIO : '100%';
    return (
      <View style={styles.titleContainer}>
        <CustomText style={[styles.title, { width: titleWidth }]} numberOfLines={1} text={item.name} />
        {!item.allow_read && item.coins && (
          <View style={styles.coinContainer}>
            <Image resizeMode="contain" source={COINS} style={styles.iconCoins} />
            <CustomText style={styles.textCoins} text={formatCoin(item.coins)} />
          </View>
        )}
      </View>
    );
  };

  const onPress = () => {
    if (item.allow_read) {
      onPressItem();
    } else {
      setShowBuyChapterPopup(true);
    }
  };

  return (
    <CustomTouchable onPress={onPress}>
      <CustomPopup
        text={`${translate('books.buy_chapter_popup')} "${item.name}" for ${formatCoin(item.coins ? item.coins : 0)}?`}
        loading={showBuyChapterPopup}
        buttonRedTitle={translate('common.yes')}
        buttonGrayTitle={translate('common.cancel')}
        onPressRedButton={onPressActivePopup}
        onPressGrayButton={onPressInactivePopup}
      />
      <View style={styles.container}>
        <DefaultImage imageUri={url} imageStyle={styles.image} resizeMode={'contain'} />
        <View style={styles.textContainer}>
          {renderTitle()}
          <CustomText numberOfLines={1} style={styles.content} text={`${item.story?.name} • ${formatTimePlayer(Number(item.duration))}`} />
        </View>
      </View>
    </CustomTouchable>
  );
};

export { MusicItem };
