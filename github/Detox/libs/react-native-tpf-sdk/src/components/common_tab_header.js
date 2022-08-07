import React, { useContext } from 'react';
import { ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../constants/colors';
import { DEVICE_WIDTH, SPACING } from '../constants/size';
import { Shadow } from '../constants/stylesCSS';
import { scale } from '../utils/responsive';
import AppText from './app_text';
import themeContext from '../constants/theme/themeContext';

const CommonTabHeader = props => {
  const theme = useContext(themeContext);
  const {
    tabIndex,
    tabs,
    onPress,
    containerStyle,
    countInTab,
    justify = false,
    translate = false
  } = props;
  let tabWith = 0;
  const alignJustify = tabs.length < 4 || justify;
  if (alignJustify) {
    tabWith = DEVICE_WIDTH / tabs.length;
  }
  const scrollRef = React.useRef();
  const [viewWidth, setViewWidth] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const _onPress = React.useCallback(
    (index, e) => {
      typeof onPress === 'function' && onPress(index);
      const tabItem = viewWidth.find(item => item?.index === index);
      if (e.nativeEvent?.pageX - e.nativeEvent?.locationX + tabItem?.width > DEVICE_WIDTH) {
        scrollRef.current.scrollTo({ x: DEVICE_WIDTH * page });
        setPage(prev => prev++);
      } else {
        if (e.nativeEvent?.pageX < e.nativeEvent?.locationX) {
          scrollRef.current.scrollTo({ x: DEVICE_WIDTH * page - DEVICE_WIDTH });
          setPage(prev => prev--);
        }
      }
    },
    [onPress, viewWidth, page]
  );

  const onLayout = React.useCallback(
    (e, index) => {
      const objIndex = viewWidth.findIndex(item => item?.index === index);
      if (objIndex !== -1) {
        const newData = viewWidth;
        newData[objIndex].width = e.nativeEvent.layout.width;
        setViewWidth(newData);
      } else {
        const newData = viewWidth.concat([{ index, width: e.nativeEvent.layout.width }]);
        setViewWidth(newData);
      }
    },
    [viewWidth]
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} ref={scrollRef}>
        {tabs.map((tab, index) => {
          return (
            <TouchableWithoutFeedback
              onLayout={e => onLayout(e, index)}
              onPress={e => _onPress(index, e)}
              key={'' + index}>
              <View style={[styles.button, tabWith > 0 ? { width: tabWith } : {}]}>
                <AppText
                  translate={translate}
                  numberOfLines={1}
                  medium
                  style={[
                    styles.text,
                    {
                      color: tabIndex === index ? theme.app.primaryColor1 : theme?.text?.primary
                    },
                    alignJustify ? { paddingHorizontal: SPACING.Small } : {}
                  ]}>
                  {tab.title}
                  {countInTab && countInTab[index] !== null ? ` (${countInTab[index]})` : ''}
                  {tab?.count ? ` (${tab.count})` : ''}
                </AppText>

                <View
                  style={[
                    styles.bottom,
                    {
                      backgroundColor:
                        tabIndex === index ? theme.app.primaryColor2 : CUSTOM_COLOR.White
                    }
                  ]}
                />
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CommonTabHeader;

const styles = StyleSheet.create({
  container: {
    ...Shadow,
    flexDirection: 'row',
    width: DEVICE_WIDTH,
    backgroundColor: BACKGROUND_COLOR.Primary,
    marginBottom: scale(8)
  },
  button: {
    height: scale(42),
    justifyContent: 'center'
  },
  text: {
    width: '100%',
    textAlign: 'center',
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    paddingHorizontal: SPACING.Medium
  },
  bottom: {
    width: '100%',
    bottom: 0,
    height: scale(2),
    position: 'absolute'
  }
});
