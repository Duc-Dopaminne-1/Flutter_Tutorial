import React, {useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {SpringScrollView} from 'react-native-spring-scrollview';

import CenterText from './CenterText';
import ScrollViewHeader from './ScrollViewHeader';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});

const ScrollViewRefresh = ({
  loading,
  onRefresh,
  children,
  showCenterText,
  loadingText,
  ...props
}) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      scrollRef.current?.endRefresh(); // NOSONAR due to wrong parsing of sonar scanner for this optional operation
    }
  }, [loading]);

  const onRefreshScrollView = () => {
    if (loading) {
      scrollRef.current?.endRefresh(); // NOSONAR due to wrong parsing of sonar scanner for this optional operation
      return;
    }
    onRefresh();
  };

  const scrollTo = () => {
    if (props.scrollTo) {
      const animated = props.scrollWithAnimate ?? true;
      scrollRef.current?.scrollTo(props.scrollTo, animated);
    }
  };
  useEffect(scrollTo, [props.scrollTo, props.scrollWithAnimate]);

  const scrollToEnd = () => {
    if (props.scrollToEnd) {
      scrollRef.current?.scrollToEnd();
    }
  };
  useEffect(scrollToEnd, [props.scrollToEnd]);

  return (
    <SpringScrollView
      {...props}
      ref={scrollRef}
      onRefresh={onRefreshScrollView}
      refreshHeader={ScrollViewHeader}
      contentContainerStyle={{...styles.scrollView, ...props?.contentContainerStyle}}>
      {showCenterText ? <CenterText title={loadingText} loading={loading} /> : children}
    </SpringScrollView>
  );
};

export default ScrollViewRefresh;
