import styles from './styles';
import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import HTML from 'react-native-render-html';

interface Props {
  description: string;
}

const Details = (props: Props) => {
  const htmlContent = `<p>${props.description}</p>`;
  return (
    <ScrollView>
      <View style={styles.container}>
        <HTML html={htmlContent} allowFontScaling={false} baseFontStyle={styles.contentDes} />
      </View>
    </ScrollView>
  );
};

export { Details };
