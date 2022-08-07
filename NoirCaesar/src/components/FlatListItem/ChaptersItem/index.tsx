import styles, { imageWidth } from './styles';
import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { CustomText } from '@src/components/CustomText';
import { IChapter } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import { CustomTouchable } from '@src/components/CustomTouchable';
import DefaultImage from '@src/components/DefaultImage';
import HTML from 'react-native-render-html';
import { fonts, WIDTH, WIDTH_RATIO } from '@src/constants/vars';
import { COINS } from '@src/constants/icons';
import { formatCoin } from '@src/utils';
import { CustomPopup } from '@src/components/CustomPopup';
import translate from '@src/localize';
import { useDispatch } from 'react-redux';
import { purchaseChapter } from '@src/modules/books/actions';
import NavigationActionsService from '@src/navigation/navigation';

interface ChapterItemProp {
  item: IChapter;
  bookImage?: string;
  onCustomPress: () => void;
  onRefreshData: () => void;
}

const ChaptersItem = (props: ChapterItemProp) => {
  const dispatch = useDispatch();
  const { item, bookImage, onCustomPress, onRefreshData } = props;
  const imageUri = item.image ?? bookImage;
  const htmlContent = `<p>${item.description}</p>`;
  const [showBuyChapterPopup, setShowBuyChapterPopup] = useState<boolean>(false);

  const onPressActivePopup = () => {
    setShowBuyChapterPopup(false);
    NavigationActionsService.showLoading();
    dispatch(purchaseChapter({
      chapter_id: item.id,
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

  const onPressItem = () => {
    if (item.allow_read) {
      onCustomPress();
    } else {
      setShowBuyChapterPopup(true);
    }
  };

  const renderTitle = () => {
    const coinWidth = 72 * WIDTH_RATIO;
    const titleWidth = !item.allow_read && item.coins ? WIDTH - 60 - imageWidth - coinWidth - 15 : WIDTH - 60 - imageWidth;
    return (
      <View style={styles.title}>
        <CustomText style={[styles.contentTitle, { width: titleWidth }]} numberOfLines={1} text={item.name} />
        {!item.allow_read && item.coins && (
          <View style={styles.coinContainer}>
            <Image resizeMode="contain" source={COINS} style={styles.iconCoins} />
            <CustomText style={styles.textCoins} text={formatCoin(item.coins)} />
          </View>
        )}
      </View>
    );
  };

  const renderDetail = () => (
    <HTML
      html={htmlContent}
      allowFontScaling={false}
      baseFontStyle={{ fontSize: 10, fontFamily: fonts.AvenirLTStdRoman }}
      renderers={{
        p: (_htmlAttribs, children) => {
          return (
            <Text style={styles.contentDes} numberOfLines={4}>
              {children}
            </Text>
          );
        },
      }}
    />
  );

  return (
    <CustomTouchable onPress={onPressItem}>
      <CustomPopup
        text={`${translate('books.buy_chapter_popup')} "${item.name}" for ${formatCoin(item.coins ? item.coins : 0)}?`}
        loading={showBuyChapterPopup}
        buttonRedTitle={translate('common.yes')}
        buttonGrayTitle={translate('common.cancel')}
        onPressRedButton={onPressActivePopup}
        onPressGrayButton={onPressInactivePopup}
      />
      <View style={styles.container}>
        <DefaultImage resizeMode={'contain'} imageUri={imageUri} imageStyle={{ width: imageWidth }} />
        <View style={styles.containerContent}>
          {renderTitle()}
          {renderDetail()}
        </View>
      </View>
    </CustomTouchable>
  );
};

export { ChaptersItem };
