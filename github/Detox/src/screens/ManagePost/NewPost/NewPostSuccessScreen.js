import React, {useContext} from 'react';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import BaseSuccessScreen from '../../../components/BaseSuccessScreen';
import ScreenIds from '../../ScreenIds';
import {NewPostContext} from '../useNewPost';

const NewPostSuccessScreen = ({navigation, route}) => {
  const {
    title = translate(STRINGS.POST_SUCCESSFULLY),
    description,
    isShowDraft,
  } = route?.params || {};

  const {resetState} = useContext(NewPostContext);

  const onReviewNewPost = () => {
    resetState();
    navigation.navigate(ScreenIds.Home);
    navigation.navigate(ScreenIds.ManagePost);
    if (isShowDraft) {
      navigation.navigate(ScreenIds.PropertyPostSaved);
    } else {
      navigation.navigate(ScreenIds.YourPropertyPost, {defaultIndex: 0});
    }
  };

  const onReturnHome = () => {
    resetState();
    navigation.navigate(ScreenIds.Home);
  };

  return (
    <BaseSuccessScreen
      title={title}
      description={description}
      onPressButton1={onReviewNewPost}
      onPressButton2={onReturnHome}
      buttonText1={translate(STRINGS.LIST)}
      buttonText1Style={{...FONTS.bold, ...FONTS.fontSize14}}
      buttonText2={translate(STRINGS.HOME)}
      enableBottomButton
      contentStyle={HELPERS.fillCenter}
      iconName={'checkmark-circle'}
    />
  );
};

export default NewPostSuccessScreen;
