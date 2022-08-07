import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { scale } from '../../../../utils/responsive';
import WebView from '../../../../components/web_view';
import { DEVICE_WIDTH } from '../../../../constants/size';
import SeeMoreButton from './see_more_button';
const Description = props => {
  const { content } = props;
  const [isSeeMore, setIsSeeMore] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const handleSeeMore = () => {
    setShowSeeMore(false);
    setIsSeeMore(true);
  };
  const onLayoutView = height => {
    //const {height} = event.nativeEvent.layout;
    //alert('height: '+height)
    if (!isSeeMore && height > scale(300)) {
      setShowSeeMore(true);
      return;
    }
    setShowSeeMore(false);
  };
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, overflow: 'hidden', height: !isSeeMore ? scale(300) : undefined }}>
        <WebView
          onLayout={onLayoutView}
          width={DEVICE_WIDTH - scale(15) * 2}
          content={content || ''}
        />
        {showSeeMore && <SeeMoreButton onPress={handleSeeMore} />}
      </View>
    </View>
  );
};
export default React.memo(Description);
const styles = StyleSheet.create({
  container: {
    paddingBottom: scale(20),
    backgroundColor: '#FFF',
    marginTop: scale(10),
    paddingTop: scale(20)
  }
});
