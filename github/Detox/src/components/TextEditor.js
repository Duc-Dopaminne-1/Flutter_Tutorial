import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';

import {FONT_REGULAR} from '../assets/fonts';
import {COLORS} from '../assets/theme/colors';
import {HELPERS} from '../assets/theme/helpers';
import {generateAssetsFontCss} from '../screens/ProjectDetail/components/HTMLText';
import logService from '../service/logService';

const fontUrl = Platform.select({
  ios: `${FONT_REGULAR}.ttf`,
  android: `file:///android_asset/fonts/${FONT_REGULAR}.ttf`,
});

const replaceHTMLTag = (html, key, tag) => {
  if (!html) {
    return '';
  }
  return html.replaceAll(key, tag);
};

const TextEditor = forwardRef(
  (
    {
      containerStyle,
      placeholder = '',
      onChange = () => {},
      style,
      showToolBar,
      onFocus = () => {},
      onBlur = () => {},
      initialContentHTML,
      outerScrollViewRef,
      ...props
    },
    ref,
  ) => {
    const [article, setArticle] = useState('');
    const [contentText, setContentText] = useState('');
    const [rendered, setRendered] = useState(false);

    const RichText = useRef(); //reference to the RichEditor component
    const scrollView = useRef();
    const editorRef = ref ? ref : RichText;

    function editorInitializedCallback() {
      editorRef.current?.registerToolbar(function (items) {
        // items contain all the actions that are currently active
      });
      if (initialContentHTML && editorRef.current) {
        editorRef.current?.insertHTML(initialContentHTML);
        editorRef.current?.blurContentEditor();
      }
      setRendered(true);
    }

    // Callback after height change
    function handleHeightChange(height) {
      logService.log('editor height change:', height);
      scrollView.current?.scrollToEnd();
    }

    function onPressAddImage() {
      // you can easily add images from your gallery
      editorRef.current?.insertImage(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png',
      );
    }

    function insertVideo() {
      // you can easily add videos from your gallery
      editorRef.current?.insertVideo(
        'https://mdn.github.io/learning-area/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4',
      );
    }

    const onChangeContent = () => {
      if (rendered) {
        onChange(contentText, article);
      }
    };
    useEffect(onChangeContent, [article]);

    const onScrollEndDrag = () => {
      outerScrollViewRef?.current &&
        outerScrollViewRef.current?.setNativeProps({scrollEnabled: true});
    };

    const editorStyle = {
      color: COLORS.TEXT_DARK_10, // editor text color
      placeholderColor: COLORS.GREY_CB, // editor placeholder text color
      cssText: generateAssetsFontCss({}),
    };

    return (
      <View style={[styles.container, style]}>
        <ScrollView
          ref={scrollView}
          style={[HELPERS.fill]}
          onScrollEndDrag={onScrollEndDrag}
          contentContainerStyle={styles.scrollViewContainer}
          {...props?.scrollViewProps}>
          <RichEditor
            disabled={false}
            containerStyle={[styles.editor, containerStyle ?? {}]}
            ref={ref && ref?.hasOwnProperty('current') ? ref : RichText}
            style={[styles.rich]}
            placeholder={placeholder ?? 'Start Writing Here'}
            onChange={setArticle}
            onInput={inputAction => {
              const {data} = inputAction;
              setContentText(data ?? '');
            }}
            editorInitializedCallback={editorInitializedCallback}
            onHeightChange={handleHeightChange}
            editorStyle={editorStyle}
            pasteAsPlainText
            onBlur={onBlur}
            onFocus={onFocus}
            onCursorPosition={it => {
              scrollView.current?.scrollTo({x: 0, y: it, animated: true});
            }}
            useContainer={false}
          />
          {showToolBar && (
            <RichToolbar
              style={[styles.richBar, props?.toolBarContainerStyle ?? {}]}
              editor={ref && ref?.hasOwnProperty('current') ? ref : RichText}
              disabled={false}
              iconTint={'purple'}
              selectedIconTint={'pink'}
              disabledIconTint={'purple'}
              onPressAddImage={onPressAddImage}
              iconSize={16}
              actions={['insertVideo', actions.setStrikethrough, actions.heading1]}
              // map icons for self made actions
              // iconMap={{
              //   [actions.heading1]: ({tintColor}) => (
              //     <Text style={[styles.tib, {color: tintColor}]}>H1</Text>
              //   ),
              // }}
              insertVideo={insertVideo}
            />
          )}
        </ScrollView>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    height: 110,
    borderRadius: 4,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  scrollViewContainer: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    paddingBottom: 10,
    flexGrow: 1,
  },
  editor: {
    flex: 1,
    marginHorizontal: 4,
  },
  rich: {
    flex: 1,
  },
});

export default TextEditor;
