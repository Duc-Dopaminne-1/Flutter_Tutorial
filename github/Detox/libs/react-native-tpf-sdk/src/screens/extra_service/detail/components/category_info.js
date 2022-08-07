import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { scale } from '../../../../utils/responsive';
import WebView from '../../../../components/web_view';
import { DEVICE_WIDTH } from '../../../../constants/size';
import SeeMoreButton from './see_more_button';
const CategoryInfo = props => {
  const { detailItem } = props;
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
    <View style={[styles.container]}>
      {detailItem?.categorySubTile ? (
        <WebView width={DEVICE_WIDTH - scale(15) * 2} content={detailItem?.categorySubTile} />
      ) : null}
      {detailItem?.categoryBenifits ? (
        <View style={{ flex: 1, overflow: 'hidden', height: !isSeeMore ? scale(300) : undefined }}>
          <WebView
            onLayout={onLayoutView}
            width={DEVICE_WIDTH - scale(15) * 2}
            content={detailItem?.categoryBenifits}
          />
          {showSeeMore && <SeeMoreButton onPress={handleSeeMore} />}
        </View>
      ) : null}

      {detailItem?.categoryStep ? (
        <WebView width={DEVICE_WIDTH - scale(15) * 2} content={detailItem?.categoryStep} />
      ) : null}
    </View>
  );
};
export default React.memo(CategoryInfo);
const styles = StyleSheet.create({
  container: {
    paddingBottom: scale(20),
    backgroundColor: '#FFF',
    paddingTop: scale(20)
  }
});
