import React, { ReactElement, useRef, memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, screenHeight, screenWidth } from '@/vars';
import Swiper, { customSwiperProps } from 'react-native-deck-swiper';
import { useSelector } from 'react-redux';
import { TutorialState } from '@/redux/tutorial/reducer';
import TutorialCarouselItem from '@/screens/Home/tutorial/component/TutorialCarouselItem';
import NavigationActionsService from '@/navigation/navigation';
import { setIndexTutorial } from '@/redux/tutorial/actions';
import { TutorialContext } from './TutorialContext';
import TutorialCarouselButton from '@/screens/Home/tutorial/component/TutorialCarouselButton';
import { onClickIconFilter, TouchDiscovery } from '@/shared/global';

function HomeTutorial(): ReactElement {
  const keyExtractor = item => item && item.toString();
  const swiPerRef = useRef(null);
  const { index, data } = useSelector((state: TutorialState) => state.tutorial);

  useEffect(() => {
    const onClickIconFilterSubscribe = onClickIconFilter.subscribe(data => {
      if (data === TouchDiscovery.Back) {
        onNextStep();
      } else if (data === TouchDiscovery.Like) {
        onNextStepLike();
      }
    });

    return () => {
      onClickIconFilterSubscribe && onClickIconFilterSubscribe.unsubscribe();
    };
  }, []);

  const renderItem = (_item: number, index: number) => {
    return <TutorialCarouselItem index={index} />;
  };

  const onSwipedRight = (currentIndex: number) => {
    // should swipe left when in step 4
    if (currentIndex === 4) {
      swiPerRef.current.jumpToCardIndex(3);
      return;
    }
    currentIndex >= 3 && onInCreaseIndex();
  };

  const onSwipedLeft = (currentIndex: number) => {
    // should swipe left when in step 3
    if (currentIndex === 3) {
      swiPerRef.current.jumpToCardIndex(2);
      return;
    }
    if (currentIndex >= 4) {
      onInCreaseIndex();
    }
  };

  const onNextStep = () => {
    onInCreaseIndex();
    swiPerRef.current.swipeLeft();
  };

  const onNextStepLike = () => {
    swiPerRef.current.swipeRight();
  };

  const onInCreaseIndex = () => {
    NavigationActionsService.dispatchAction(
      setIndexTutorial({
        index: index + 1,
      }),
    );
  };

  return (
    <TutorialContext.Provider
      value={{
        onNextStep,
      }}
    >
      <View style={styles.container}>
        <View style={styles.container}>
          <Swiper
            ref={swiPerRef}
            cards={data}
            disableTopSwipe={true}
            disableBottomSwipe={true}
            renderCard={renderItem}
            stackScale={5}
            stackSeparation={0}
            verticalSwipe={false}
            horizontalSwipe={index >= 2 && index <= 3}
            animateOverlayLabelsOpacity
            onSwipedRight={onSwipedRight}
            onSwipedLeft={onSwipedLeft}
            keyExtractor={keyExtractor}
            cardStyle={styles.card}
            cardIndex={index}
            animateCardOpacity
            cardVerticalMargin={0}
            backgroundColor={colors.transparent}
            stackSize={3}
            overlayOpacityHorizontalThreshold={screenWidth / 14}
            inputOverlayLabelsOpacityRangeX={[-screenWidth / 8, -screenWidth / 13, 0, screenWidth / 13, screenWidth / 8]}
            inputOverlayLabelsOpacityRangeY={[-screenHeight / 9, -screenHeight / 14, 0, screenHeight / 14, screenHeight / 9]}
            {...customSwiperProps}
          />
        </View>

        <TutorialCarouselButton index={index} />
      </View>
    </TutorialContext.Provider>
  );
}

export default memo(HomeTutorial);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
  },
  card: {
    height: '100%',
    marginTop: 8,
  },
});
