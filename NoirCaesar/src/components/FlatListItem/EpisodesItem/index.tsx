import styles from './styles';
import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { CustomText } from '@src/components/CustomText';
import FastImage from 'react-native-fast-image';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { IEpisode } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv/models';
import { WIDTH_RATIO } from '@src/constants/vars';
import { COINS } from '@src/constants/icons';
import { formatCoin } from '@src/utils';
import { get } from 'lodash';
import translate from '@src/localize';
import { CustomPopup } from '@src/components/CustomPopup';
import { useDispatch } from 'react-redux';
import { purchaseEpisode } from '@src/modules/tv/actions';
import NavigationActionsService from '@src/navigation/navigation';

interface Props {
  item: IEpisode;
  episodeImage?: string;
  onCustomPress: () => void;
  onRefreshData: () => void;
}

const EpisodesItem = (props: Props) => {
  const { item, episodeImage, onCustomPress, onRefreshData } = props;
  const dispatch = useDispatch()
  const [showBuyChapterPopup, setShowBuyChapterPopup] = useState<boolean>(false);
  const imageUri = item.image ? item.image : episodeImage;
  const name = item.name ? item.name : '';
  const description = item.description ? item.description : '';
  const allow_read = get(item, ['allow_read'], undefined);
  const coins = get(item, ['coins'], undefined);

  const onPressActivePopup = () => {
    setShowBuyChapterPopup(false);
    NavigationActionsService.showLoading()
    dispatch(purchaseEpisode({
      episode_id: item.id,
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
    const titleWidth = !allow_read && coins ? 150 * WIDTH_RATIO : '100%';
    return (
      <View style={styles.titleContainer}>
        <CustomText style={[styles.contentTitle, { width: titleWidth }]} numberOfLines={1} text={name} />
        {!allow_read && coins && (
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
      onCustomPress();
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
        <FastImage resizeMode={'contain'} source={{ uri: imageUri }} style={{ flex: 1 }} />
        <View style={styles.containerContent}>
          {renderTitle()}
          <CustomText style={styles.contentDes} text={description}></CustomText>
        </View>
      </View>
    </CustomTouchable>
  );
};

export { EpisodesItem };
