import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {StyleProp, View} from 'react-native';
import RenderHTML, {MixedStyleDeclaration} from 'react-native-render-html';

type Props = {
  data: string,
  styles: MixedStyleDeclaration,
  emptyView: JSX.Element,
  viewStyle: StyleProp,
  maxHeight: number,
};

const HtmlOverallProject = ({
  data,
  viewStyle,
  emptyView = null,
  maxHeight = 40,
  minHeight = 40,
  numberOfLines = 1,
  customElementStyles,
}: Props) => {
  if (!isEmpty(data)) {
    const tagsStyles = {
      p: {
        margin: 0,
        paddingLeft: 0,
        paddingTop: 5,
        paddingRight: 0,
        paddingBottom: 10,
      },
      ...customElementStyles,
    };

    const source = {
      html: data.replace(/<[^>]*>?/gm, ''),
    };

    return (
      <View style={[{maxHeight: maxHeight, minHeight: minHeight}, viewStyle]}>
        <RenderHTML
          contentWidth={100}
          defaultTextProps={{
            numberOfLines: numberOfLines,
          }}
          tagsStyles={tagsStyles}
          source={source}
        />
      </View>
    );
  } else {
    return <View style={{height: maxHeight}}>{emptyView}</View>;
  }
};

export default HtmlOverallProject;
