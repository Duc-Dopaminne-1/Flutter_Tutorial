import {useRef, useState} from 'react';

import usePlusServices from '../../../../hooks/usePlusServices';
import {useLogin} from '../../../Auth/useLogin';
import ScreenIds from '../../../ScreenIds';
import {TypeChatData} from './data';
import {ChatDataTypes} from './types';

export const useSliderIntro = ({onPress}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const onPressItem = id => {
    if (currentIndex === id) {
      onPress(id);
    } else {
      carouselRef?.current?.goToIndex(id, true);
    }
  };

  return {setCurrentIndex, carouselRef, onPressItem};
};

const useIntro = ({navigation}) => {
  const {showLogin} = useLogin();
  const [pageIndex, setPageIndex] = useState(1);
  const modalIntro = useRef(null);
  const {onPressItem} = usePlusServices();

  const onPressPage = index => {
    setPageIndex(index);
    modalIntro.current?.open();
  };

  const onPressAccept = (servicesSelected: ChatDataTypes) => {
    if (servicesSelected) {
      const {type, id, params} = servicesSelected;
      if (type === TypeChatData.screen) {
        modalIntro.current?.close();
        if (id === ScreenIds.CreateGeneralRequestScreen) {
          showLogin(() => {
            navigation.navigate(ScreenIds.CreateGeneralRequestScreen);
          });
        } else {
          navigation.navigate(id, params);
        }
      } else if (type === TypeChatData.plusService) {
        onPressItem(servicesSelected);
        onPressCancel();
      }
    }
  };

  const onPressCancel = () => {
    modalIntro.current?.close();
  };

  return {onPressCancel, useSliderIntro, onPressAccept, onPressPage, modalIntro, pageIndex};
};

export default useIntro;
