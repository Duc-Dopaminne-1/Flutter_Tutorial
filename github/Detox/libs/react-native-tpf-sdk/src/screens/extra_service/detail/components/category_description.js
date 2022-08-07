import React, { useMemo, useContext } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import HTML from 'react-native-render-html';
import { FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { CUSTOM_COLOR } from '../../../../constants/colors';
import themeContext from '../../../../constants/theme/themeContext';
import { DEVICE_WIDTH } from '../../../../constants/size';
import { scale } from '../../../../utils/responsive';

const CategoryDescription = props => {
  const { content } = props;
  const { text, app, fonts } = useContext(themeContext) || {};

  const tagStyle = useMemo(
    () => ({
      p: {
        fontFamily: fonts?.REGULAR,
        fontSize: FONT_SIZE.BodyText,
        margin: 0,
        color: '#FFF',
        backgroundColor: CUSTOM_COLOR.Transparent
      },
      span: {
        fontFamily: fonts?.REGULAR,
        fontSize: FONT_SIZE.BodyText,
        margin: 0,
        color: '#FFF',
        backgroundColor: CUSTOM_COLOR.Transparent
      },
      h1: {
        margin: 0,
        fontFamily: fonts?.BOLD,
        fontSize: FONT_SIZE.Title3,
        color: '#FFF',
        backgroundColor: CUSTOM_COLOR.Transparent
      },
      h2: {
        margin: 0,
        fontFamily: fonts?.BOLD,
        fontSize: FONT_SIZE.Title3,
        lineHeight: LINE_HEIGHT.Title3,
        backgroundColor: CUSTOM_COLOR.Transparent,
        color: '#FFF'
      },
      h3: {
        margin: 0,
        fontFamily: fonts?.REGULAR,
        fontSize: FONT_SIZE.Title3,
        backgroundColor: CUSTOM_COLOR.Transparent,
        color: '#FFF'
      },
      em: {
        fontSize: FONT_SIZE.SubHead,
        fontFamily: fonts?.ITALIC,
        color: '#FFF',
        backgroundColor: CUSTOM_COLOR.Transparent
      },

      a: {
        fontFamily: fonts?.REGULAR,
        fontSize: FONT_SIZE.BodyText,
        color: '#06c',
        lineHeight: LINE_HEIGHT.BodyText,
        backgroundColor: CUSTOM_COLOR.Transparent
      },
      ul: {
        fontFamily: fonts?.REGULAR,
        fontSize: FONT_SIZE.BodyText,
        lineHeight: LINE_HEIGHT.BodyText,
        color: '#FFF'
      },
      ol: {
        fontFamily: fonts?.REGULAR,
        fontSize: FONT_SIZE.BodyText,
        lineHeight: LINE_HEIGHT.BodyText,
        color: '#FFF'
      },
      li: { margin: 0, padding: 0, color: '#FFF', backgroundColor: CUSTOM_COLOR.Transparent },
      b: {
        fontFamily: fonts?.BOLD,
        fontSize: FONT_SIZE.BodyText,
        lineHeight: LINE_HEIGHT.BodyText,
        color: '#FFF',
        backgroundColor: CUSTOM_COLOR.Transparent
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

  const TagCustom = ({ TDefaultRenderer, style: defaultStyle, ...props }) => {
    return (
      <TDefaultRenderer
        {...props}
        style={[defaultStyle, { color: '#fff', backgroundColor: CUSTOM_COLOR.Transparent }]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          style={[styles.description, { backgroundColor: app.primaryColor1 }]}>
          <View>
            <HTML
              source={{
                html: content || ''
              }}
              onLinkPress={(evt, href) => {
                try {
                  Linking.openURL(href);
                } catch (error) {}
              }}
              tagsStyles={{
                ...tagStyle
              }}
              ignoredStyles={['width', 'height']}
              renderers={{
                span: TagCustom,
                strong: TagCustom,
                p: TagCustom
              }}
              classesStyles={{
                ...classesStyles
              }}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
export default React.memo(CategoryDescription);
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    top: 0,
    width: DEVICE_WIDTH,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  wrapper: { zIndex: 99, position: 'absolute' },
  description: {
    width: DEVICE_WIDTH * 0.89,
    //  top: scale(40),
    //overflow: 'hidden',
    opacity: 0.85,
    flexGrow: 1,
    alignSelf: 'center',
    maxHeight: (DEVICE_WIDTH * 0.89) / 1.5,
    //padding: scale(16),
    borderRadius: scale(8)
  },
  content: {
    alignSelf: 'center',
    justifyContent: 'center',
    minHeight: '100%',
    paddingHorizontal: scale(15),
    width: '100%'
  }
});
