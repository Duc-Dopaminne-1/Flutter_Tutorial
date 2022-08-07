import styles from './styles';
import React from 'react';
import { View, Text } from 'react-native';
import { CustomText } from '@src/components/CustomText';
import NavigationActionsService from '@src/navigation/navigation';
import { BOOK_INFO_DETAIL } from '@src/constants/screenKeys';
import FastImage from 'react-native-fast-image';
import { IBook } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import { CustomTouchable } from '@src/components/CustomTouchable';
import HTML from 'react-native-render-html';
import { fonts } from '@src/constants/vars';

interface AToZItemProp {
  item: IBook;
}

const AToZItem = (props: AToZItemProp) => {
  const htmlContent = `<p>${props.item.description}</p>`;

  const onPressItem = () => {
    NavigationActionsService.push(BOOK_INFO_DETAIL, { bookId: props.item.id }, true);
  };

  return (
    <CustomTouchable onPress={onPressItem}>
      <View style={styles.container}>
        <FastImage resizeMode={'contain'} source={{ uri: props.item.image_thumb }} style={{ flex: 1 }} />
        <View style={styles.containerContent}>
          <CustomText style={styles.contentTitle} numberOfLines={1} text={props.item.name} />
          <CustomText
            style={styles.contentChapter}
            numberOfLines={1}
            text={props.item.total_chapter === 1 ? props.item.total_chapter + ' chapter' : props.item.total_chapter + ' chapters'}
          />
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
        </View>
      </View>
    </CustomTouchable>
  );
};

export { AToZItem };
