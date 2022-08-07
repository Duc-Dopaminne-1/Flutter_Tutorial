import CustomItemSetting from '@/components/CustomItemSetting';
import { language } from '@/i18n';
import { appLocaleSelector } from '@/redux/app/selector';
import { filterSocialInterestsSelector, getFilter } from '@/redux/filters/selector';
import { FilterInterests } from '@/screens/Filter/FilterInterestsScreen';
import { useLocalizeNameField } from '@/shared/processing';
import React, { memo, ReactElement, useState } from 'react';
import InterestSVG from '@/components/SVG/InterestSVG';

const SocialInterestsContainer = (): ReactElement => {
  appLocaleSelector();
  const [interestDialogVisible, setInterestDialogVisible] = useState(false);
  const socialInterestsSelected = filterSocialInterestsSelector() || [];
  const { data } = getFilter();
  const { interestsList = [] } = data;
  const localizeNameField = useLocalizeNameField();

  const interestsNameSelected = socialInterestsSelected
    .map(item => interestsList.find(i => i.id === item.id) || item)
    .map(item => localizeNameField(item));
  const filterInterestsDesc = interestsNameSelected.length > 0 ? interestsNameSelected.join(', ') + ' ' : language('filterScreen.none');

  return (
    <>
      <CustomItemSetting
        title={language('filterScreen.interests')}
        content={filterInterestsDesc}
        onPress={() => setInterestDialogVisible(true)}
        image={<InterestSVG />}
      />
      <FilterInterests
        isVisible={interestDialogVisible}
        interestsSelected={socialInterestsSelected}
        interestsList={interestsList}
        onBackdropPress={() => {
          setInterestDialogVisible(false);
        }}
      />
    </>
  );
};

export default memo(SocialInterestsContainer);
