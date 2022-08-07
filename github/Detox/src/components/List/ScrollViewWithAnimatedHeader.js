import React, {forwardRef, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {FlatList, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS} from '../../assets/theme/metric';

const HEADER_NAV_HEIGHT = 44;

const renderHeaderNavItem = ({item, index, onPress, chosenIndex}) => {
  const onPressNav = () => {
    onPress && onPress(item, index);
  };

  return (
    <TouchableOpacity style={[HELPERS.center, METRICS.horizontalMargin]} onPress={onPressNav}>
      <View
        style={[styles.headerNavTextContainer, chosenIndex === index && styles.highlightHeaderNav]}>
        <Text style={[styles.headerNavText, chosenIndex === index && styles.highlightText]}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const getIndexBeingFocused = ({
  headerSections,
  listContainerHeight,
  currentPositionY,
  listTotalHeight,
}) => {
  const endOfList = listTotalHeight - listContainerHeight - 24;
  let focusedIndex = 0;

  headerSections?.forEach((e, index) => {
    const isLastSection = index === headerSections.length - 1;
    const sectionThreshold = e.sectionInitialPositionY - 10;

    if ((isLastSection && currentPositionY >= endOfList) || currentPositionY >= sectionThreshold) {
      focusedIndex = index;
    }
  });
  return focusedIndex;
};

export const getHeaderNavSections = ({sections, listContainerHeight}) => {
  const header = [];

  for (const [key, value] of Object.entries(sections)) {
    if (value?.height > 0) {
      const prefix = Math.max((listContainerHeight - value?.height) / 2, HEADER_NAV_HEIGHT);

      const initialPosition = value?.position > 0 ? value?.position - prefix : value?.position;

      header.push({
        name: key,
        sectionInitialPositionY: initialPosition,
        sectionEndPositionY: value?.position + value.height,
        height: value.height,
      });
    }
  }

  const sortedHeader = header.sort((a, b) => a.sectionInitialPositionY - b.sectionInitialPositionY);

  const output = sortedHeader.map((e, index) => {
    const sectionNavTemp = {...e};
    const prefix = Math.max((listContainerHeight - sectionNavTemp?.height) / 2, HEADER_NAV_HEIGHT);

    if (
      sectionNavTemp?.sectionInitialPositionY < sortedHeader[index - 1]?.sectionInitialPositionY
    ) {
      sectionNavTemp.sectionInitialPositionY -= sortedHeader[index - 1]?.height / 2 + prefix;
    }

    return sectionNavTemp;
  });

  return output;
};

const ScrollViewWithAnimatedHeader = forwardRef(
  (
    {
      sections,
      children,
      loading,
      threshold,
      scrollViewProps,
    }: {
      sections: Object,
      loading: Boolean,
      threshold: Number,
      children: JSX.Element,
      sortedHeader: Array<String>,
      scrollViewProps: KeyboardAwareScrollViewProps,
    },
    ref,
  ) => {
    const [chosenIndex, setChosenIndex] = useState(0);

    const scrollY = useSharedValue(0);

    const listContentRef = useRef(null);
    const listContainerHeight = useRef(0);
    const listRef = useRef(null);

    const headerAnimatedStyle = useAnimatedStyle(
      () => ({
        transform: [
          {
            translateY: interpolate(
              scrollY.value,
              [0, threshold || 0 + HEADER_NAV_HEIGHT],
              [0, HEADER_NAV_HEIGHT],
              Extrapolate.CLAMP,
            ),
          },
        ],
      }),
      [scrollY.value],
    );

    const onPressHeaderNav = (item, index) => {
      const isAtLastSection = index === headerSections.length - 1;

      const sectionPrefix = Math.max((listContainerHeight.current - item.height) / 2, 0);
      const isSectionSmallerThanContainer = sectionPrefix > 0;

      const scrollToPositionY = item.sectionInitialPositionY;

      if (isAtLastSection && isSectionSmallerThanContainer) {
        listContentRef.current?.scrollToEnd();
      } else {
        listContentRef.current?.scrollTo({x: 0, y: scrollToPositionY}, true);
      }
    };

    const getHeaders = () =>
      getHeaderNavSections({
        sections,
        listContainerHeight: listContainerHeight.current,
      });
    const headerSections = useMemo(getHeaders, [sections, listContainerHeight.current]);

    const onChildrenRendered = event => {
      const containerHeight = event.nativeEvent.layout.height;
      listContainerHeight.current = containerHeight;
    };

    const onFailedScrollToIndex = () => {
      listRef.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    };

    const onScroll = event => {
      const positionY = event.nativeEvent.contentOffset.y;
      const listHeight = event.nativeEvent.contentSize.height;

      // setCurrentPositionY(positionY);
      if (!loading) {
        const focusedIndex = getIndexBeingFocused({
          listContainerHeight: listContainerHeight.current,
          currentPositionY: positionY,
          headerSections,
          listTotalHeight: listHeight,
        });

        if (chosenIndex !== focusedIndex) {
          setChosenIndex(focusedIndex);
          listRef.current?.scrollToIndex({
            animated: true,
            index: focusedIndex,
          });
        }
      }

      scrollY.value = positionY;
    };

    useImperativeHandle(ref, () => ({
      scrollToSection: sectionName => {
        const section = headerSections.find(s => s.name === sectionName);
        const sectionIndex = headerSections.findIndex(s => s.name === sectionName);

        if (!!section && !!sectionIndex) {
          onPressHeaderNav(section, sectionIndex);
        }
      },
    }));

    return (
      <View style={HELPERS.fill}>
        <Animated.View style={[styles.headerNavContainer, headerAnimatedStyle]}>
          <FlatList
            ref={listRef}
            data={headerSections}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) =>
              renderHeaderNavItem({
                item,
                index,
                onPress: onPressHeaderNav,
                chosenIndex,
              })
            }
            onScrollToIndexFailed={onFailedScrollToIndex}
            keyExtractor={(_, index) => index}
          />
        </Animated.View>
        <View style={HELPERS.fill} onLayout={onChildrenRendered}>
          <KeyboardAwareScrollView
            innerRef={ref => (listContentRef.current = ref)}
            onScroll={onScroll}
            {...scrollViewProps}>
            {children}
          </KeyboardAwareScrollView>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  headerNavText: {
    ...FONTS.regular,
    ...FONTS.fontSize14,
    paddingVertical: 10,
    textAlign: 'center',
    flex: 1,
  },
  headerNavContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: -HEADER_NAV_HEIGHT - 1,
    left: 0,
    right: 0,
    height: HEADER_NAV_HEIGHT,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    zIndex: 1,
  },
  highlightText: {
    ...FONTS.bold,
    color: COLORS.PRIMARY_A100,
  },
  highlightHeaderNav: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.PRIMARY_B100,
  },
  headerNavTextContainer: {
    flex: 1,
    minWidth: '5%',
    marginBottom: Platform.OS === 'android' ? 2 : 1,
  },
});

export default ScrollViewWithAnimatedHeader;
