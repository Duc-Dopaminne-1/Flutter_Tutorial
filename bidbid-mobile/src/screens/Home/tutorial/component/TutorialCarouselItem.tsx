import React, { ReactElement, memo } from 'react';
import TutorialCarouselItemStepOne from '@/screens/Home/tutorial/component/TutorialCarouselItemStepOne';
import TutorialCarouselItemImage from '@/screens/Home/tutorial/component/TutorialCarouselItemImage';
import { images } from '@/vars';
import TutorialCarouselItemStepSix from '@/screens/Home/tutorial/component/TutorialCarouselItemStepSix';
import TutorialCarouselItemStepTwo from '@/screens/Home/tutorial/component/TutorialCarouselItemStepTwo';
import TutorialCarouselItemStepThree from '@/screens/Home/tutorial/component/TutorialCarouselItemStepThree';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/reducers';

interface TutorialCarouselItemProp {
  index?: number;
}

function TutorialCarouselItem(props: TutorialCarouselItemProp): ReactElement {
  const { index } = props;
  const language = useSelector((state: RootState) => state.user.data.appLanguage);

  const firstImage = language === 'es' ? images.tutorial1Sp : images.tutorial1;
  const indexFive = language === 'es' ? images.tutorial5Sp : images.tutorial5;
  const indexSix = language === 'es' ? images.tutorial6Sp : images.tutorial6;

  // index is step tutorial
  switch (index) {
    case 0:
      return <TutorialCarouselItemImage isImagePng image={firstImage} isFirstTutorial />;
    case 1:
      return <TutorialCarouselItemStepOne />;
    case 2:
      return <TutorialCarouselItemStepTwo />;
    case 3:
      return <TutorialCarouselItemStepThree />;
    case 4:
      return <TutorialCarouselItemImage isImagePng index={index} image={indexFive} />;
    case 5:
      return <TutorialCarouselItemImage isImagePng index={index} image={indexSix} />;
    case 6:
      return <TutorialCarouselItemStepSix />;
    default:
      return null;
  }
}

export default memo(TutorialCarouselItem);
