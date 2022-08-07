import { styles } from './styles';
import React from 'react';
import HTML from 'react-native-render-html';
import { View } from 'react-native';
import { WIDTH } from '@src/constants/vars';

interface Props {
  content: string;
}

const Content = (props: Props) => {
  return (
    <View style={styles.container}>
      <HTML
        html={props.content}
        baseFontStyle={styles.webview}
        allowFontScaling={false}
        imagesMaxWidth={WIDTH - 30}
        imagesInitialDimensions={styles.image}
      />
    </View>
  );
};

export { Content };
