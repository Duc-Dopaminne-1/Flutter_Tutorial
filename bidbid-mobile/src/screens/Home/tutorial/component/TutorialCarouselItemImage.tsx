import React, { ReactElement, memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { colors } from '@/vars';
import { ImageSource } from 'react-native-vector-icons/Icon';
import { useSelector } from 'react-redux';
import { TutorialState } from '@/redux/tutorial/reducer';
import CustomAnimationUpDown from '@/components/CustomAnimationUpDown';
import VectorUpSVG from '@/components/SVG/VectorUpSVG';

interface TutorialCarouselItemImageProps {
  image: ImageSource;
  isFirstTutorial?: boolean;
  index?: number;
  isImagePng?: boolean;
}

function TutorialCarouselItemImage(props: TutorialCarouselItemImageProps): ReactElement {
  const { image, isFirstTutorial, isImagePng, index } = props;
  const indexScreen = useSelector((state: TutorialState) => state.tutorial.index);

  const renderVectorUp = () => {
    if (index === 4 && indexScreen === 4) {
      return (
        <CustomAnimationUpDown style={styles.wrapVector}>
          <View style={styles.wrapIcon}>
            <VectorUpSVG />
          </View>
        </CustomAnimationUpDown>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, isFirstTutorial && styles.wrapContainer]}>
      {renderVectorUp()}
      {isImagePng ? <Image source={image} resizeMode={'stretch'} style={styles.image} /> : <View style={styles.image}>{image}</View>}
    </View>
  );
}

export default memo(TutorialCarouselItemImage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  wrapContainer: {
    padding: 4,
  },
  image: {
    height: '90%',
    width: '100%',
    borderRadius: 12,
  },
  wrapVector: {
    zIndex: 99,
  },
  wrapIcon: {
    position: 'absolute',
    right: 10,
    top: -60,
  },
});
