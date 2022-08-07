import React, { useContext } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { CUSTOM_COLOR } from '../../../constants/colors';
import { DEVICE_WIDTH } from '../../../constants/size';
import { scale } from '../../../utils/responsive';
import themeContext from '../../../constants/theme/themeContext';
import { BodyText } from '../../../components';

const PADDING = 12;

const TriggerTabHeader = props => {
  const theme = useContext(themeContext);
  const { tabIndex, tabs, onPress, containerStyle, justify = false, translate = false } = props;
  let tabWith = 0;
  const alignJustify = tabs.length < 4 || justify;
  if (alignJustify) {
    tabWith = DEVICE_WIDTH / tabs.length;
  }
  const scrollRef = React.useRef();
  const [viewWidth, setViewWidth] = React.useState([]);

  React.useEffect(() => {
    if (viewWidth && tabIndex > -1) {
      const tabItem = viewWidth.find(item => item?.index === tabIndex);
      scrollRef.current?.scrollTo({ x: tabItem?.x - PADDING, animated: true });
    }
  }, [viewWidth, tabIndex]);

  const _onPress = React.useCallback(
    (index, e) => {
      typeof onPress === 'function' && onPress(index);
    },
    [onPress]
  );

  const onLayout = React.useCallback(
    (e, index) => {
      const objIndex = viewWidth.findIndex(item => item?.index === index);
      if (objIndex !== -1) {
        const newData = viewWidth;
        newData[objIndex].width = e.nativeEvent.layout.width;
        newData[objIndex].x = e.nativeEvent.layout.x;
        setViewWidth(newData);
      } else {
        const newData = viewWidth.concat([
          { index, width: e.nativeEvent.layout.width, x: e.nativeEvent.layout.x }
        ]);
        setViewWidth(newData);
      }
    },
    [viewWidth]
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} ref={scrollRef}>
        {tabs.map((tab, index) => {
          const focused = tabIndex === index;
          return (
            <TouchableOpacity
              key={index + ''}
              onLayout={e => onLayout(e, index)}
              onPress={e => _onPress(index, e)}
              style={[
                styles.tabContainer,
                { backgroundColor: focused ? theme.app.primaryColor1 : CUSTOM_COLOR.White }
              ]}>
              <Image source={{ uri: tab.icon?.fileUrl }} style={styles.imageIcon} />
              <BodyText
                translate
                numberOfLines={2}
                color={focused ? CUSTOM_COLOR.White : theme?.text?.primary}
                style={{ ...styles.subHeadTitle }}>
                {tab.title}
              </BodyText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default TriggerTabHeader;

const styles = StyleSheet.create({
  container: {
    // ...Shadow,
    flexDirection: 'row',
    minHeight: scale(90),
    paddingTop: scale(16),
    width: DEVICE_WIDTH,
    zIndex: 100
  },

  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginHorizontal: PADDING,
    width: scale(170),
    height: scale(64),
    borderRadius: 10,
    shadowColor: CUSTOM_COLOR.ShuttleGray,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
  },
  imageIcon: {
    borderRadius: 4,
    width: scale(40),
    height: scale(40)
  },
  subHeadTitle: {
    fontSize: 14,
    marginLeft: scale(10),
    maxWidth: scale(100)
  }
});
