import React, {forwardRef, useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const styles = StyleSheet.create({
  contentKeyboardScroll: {
    flexGrow: 1,
  },
});
const KeyboardScrollView = forwardRef(
  (
    {
      contentStyle,
      children,
      extraScrollHeight,
      scrollEnabled = true,
      pointerEvents = 'auto',
      showsScrollIndicator = true,
      horizontal = false,
      keyboardShouldPersistTaps,
    },
    ref,
  ) => {
    const scrollViewRef = useRef();
    useEffect(() => {
      if (ref && scrollViewRef.current) {
        ref.current = scrollViewRef.current;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref, scrollViewRef.current]);

    return (
      <KeyboardAwareScrollView
        pointerEvents={pointerEvents}
        innerRef={innerRef => {
          scrollViewRef.current = innerRef;
        }}
        scrollEnabled={scrollEnabled}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps || 'handled'}
        alwaysBounceVertical={false}
        contentContainerStyle={[styles.contentKeyboardScroll, contentStyle]}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={showsScrollIndicator}
        extraScrollHeight={extraScrollHeight}
        horizontal={horizontal}>
        {children}
      </KeyboardAwareScrollView>
    );
  },
);

export default KeyboardScrollView;
