import React, { useContext, useMemo } from 'react';
import { Linking } from 'react-native';
import HTML from 'react-native-render-html';
import { FONT_SIZE, LINE_HEIGHT } from '../constants/appFonts';
import themeContext from '../constants/theme/themeContext';

const regexInlineStyle = /style=(["'])(?:(?=(\\?))\2.)*?\1/g;
// const regexBackgroundColor = /background-color\:\#?\w+;*/g;

const HTMLView = ({ content, width, widthImage = '', TextAlignJustify = true }) => {
  const { text, app, fonts } = useContext(themeContext) || {};
  const contentNoInlineStyle = content === null ? '' : (content + '').replace(regexInlineStyle, '');

  const tagStyle = useMemo(
    () => ({
      p: {
        fontFamily: fonts?.REGULAR,
        fontSize: FONT_SIZE.BodyText,
        lineHeight: LINE_HEIGHT.BodyText,
        color: text.primary
      },
      h1: {
        fontFamily: fonts?.REGULAR,
        fontSize: FONT_SIZE.Title2,
        lineHeight: LINE_HEIGHT.Title2,
        color: text.primary
      },
      h2: {
        fontFamily: fonts?.REGULAR,
        fontSize: FONT_SIZE.Title3,
        lineHeight: LINE_HEIGHT.Title3,
        color: text.primary,
        fontWeight: 'normal'
      },
      h3: {
        fontFamily: fonts?.REGULAR,
        fontSize: FONT_SIZE.Title3,
        color: text.primary,
        fontWeight: 'normal'
      },
      img: {
        width: '100%'
      },
      em: {
        fontSize: FONT_SIZE.SubHead,
        color: text.primary,
        fontFamily: fonts?.ITALIC,
        lineHeight: LINE_HEIGHT.SubHead
      },
      a: {
        fontFamily: fonts?.REGULAR,
        fontSize: FONT_SIZE.BodyText,
        color: '#06c',
        lineHeight: LINE_HEIGHT.BodyText
      },
      ul: {
        fontFamily: fonts?.REGULAR,
        fontSize: FONT_SIZE.BodyText,
        color: text.primary,
        lineHeight: LINE_HEIGHT.BodyText,
        margin: 0,
        paddingVertical: 0
      },
      div: {
        fontFamily: fonts?.REGULAR,
        fontSize: FONT_SIZE.BodyText,
        color: text.primary,
        lineHeight: LINE_HEIGHT.BodyText
      },
      i: {
        fontFamily: fonts?.ITALIC,
        fontSize: FONT_SIZE.BodyText,
        color: text.primary,
        lineHeight: LINE_HEIGHT.BodyText
      },
      strong: {
        fontFamily: fonts?.BOLD,
        fontSize: FONT_SIZE.BodyText,
        color: text.primary,
        lineHeight: LINE_HEIGHT.BodyText
      },
      mark: {
        fontFamily: fonts?.REGULAR,
        fontSize: FONT_SIZE.BodyText,
        color: app?.primaryColor2,
        lineHeight: LINE_HEIGHT.BodyText
      },
      b: {
        fontFamily: fonts?.BOLD,
        fontSize: FONT_SIZE.BodyText,
        color: text.primary,
        lineHeight: LINE_HEIGHT.BodyText
      },
      small: {
        fontFamily: fonts?.REGULAR,
        fontSize: FONT_SIZE.Small,
        color: text.primary,
        lineHeight: LINE_HEIGHT.Small
      },
      span: {
        fontFamily: fonts?.REGULAR,
        fontSize: FONT_SIZE.BodyText,
        lineHeight: LINE_HEIGHT.BodyText,
        color: text.primary
      }
    }),
    [fonts, app, text]
  );

  const classesStyles = {
    'ql-align-justify': {
      textAlign: 'justify'
    },
    'ql-align-center': {
      textAlign: 'center'
    },
    'ql-align-right': {
      textAlign: 'right'
    },
    'ql-align-left': {
      textAlign: 'left'
    }
  };

  return (
    <HTML
      source={{
        html: `<p>${content === null ? '' : contentNoInlineStyle}</p>` || '<p></p>'
      }}
      contentWidth={width}
      onLinkPress={(evt, href) => {
        try {
          Linking.openURL(href);
        } catch (error) {}
      }}
      tagsStyles={{
        ...tagStyle,
        img: widthImage
          ? {
              width: widthImage
            }
          : {},
        p: TextAlignJustify
          ? {
              ...tagStyle.p,
              textAlign: 'justify'
            }
          : tagStyle.p
      }}
      ignoredStyles={['width', 'height']}
      classesStyles={{
        ...classesStyles
      }}
    />
  );
};

export default HTMLView;
