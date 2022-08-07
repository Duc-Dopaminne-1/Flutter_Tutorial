import styles from './styles';
import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { IBook } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import HTML from 'react-native-render-html';

interface Props {
  book: IBook;
}

const Details = (props: Props) => {
  const htmlContent = `<p>${props.book.description}</p>`;
  return (
    <ScrollView>
      <View style={styles.container}>
        <HTML html={htmlContent} allowFontScaling={false} baseFontStyle={styles.contentDes} />
      </View>
    </ScrollView>
  );
};

export { Details };
