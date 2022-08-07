import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomButtonIcon from '@/components/CustomButtonIcon';
import { shouldSwipe, TouchDiscovery, touchDiscovery } from '@/shared/global';
import { DiscoveryState } from '@/redux/discovery';
import { images } from '@/vars';
import styles from './styles';
import { setIndexDiscovery } from '@/redux/discovery/actions';
import NavigationActionsService from '@/navigation/navigation';

const HomeCarouselCardRevertIcon = () => {
  const index = useSelector((state: DiscoveryState) => state.discovery.index);
  const [swiping, setSwiping] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const shouldSwipeSubscribe = shouldSwipe.subscribe(data => {
      setSwiping(data.status);
    });

    return () => {
      shouldSwipeSubscribe?.unsubscribe();
    };
  }, []);

  const onPressBack = useCallback(() => {
    setDisabled(true);
    touchDiscovery.next({
      type: TouchDiscovery.Back,
    });
    setTimeout(() => setDisabled(false), 500);
    /**
     * Predict to instant hide revert button for the first card.
     */
    if (index === 1) {
      setTimeout(
        () =>
          NavigationActionsService.dispatchAction(
            setIndexDiscovery({
              index: 0,
              noReset: true,
            }),
          ),
        300,
      );
    }
  }, [index]);

  if (index === 0 || swiping) return null;

  return (
    <CustomButtonIcon
      disabled={disabled}
      onPress={onPressBack}
      containerStyle={styles.btnRevert}
      imagesPng={images.revertBold}
      iconStyle={styles.revertIcon}
    />
  );
};

export default HomeCarouselCardRevertIcon;
