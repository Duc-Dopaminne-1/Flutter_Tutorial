import { language } from '@/i18n';
import React, { memo, ReactElement } from 'react';
import FilterCellDetail, { CellEnum } from './CellDetail';
import { filterFindProfileSelector } from '@/redux/filters/selector';

interface FilterProfilesContainerProps {
  onCellPressed: (type: CellEnum) => void;
}

function FilterProfilesContainer(props: FilterProfilesContainerProps): ReactElement {
  const { onCellPressed = () => {} } = props;
  const profileSelected = filterFindProfileSelector();

  const getDescription = () => {
    if (profileSelected.length === 0 || profileSelected.length === 2) {
      return language('filterScreen.allProfiles');
    }
    return `${profileSelected[0].name}`;
  };

  return (
    <FilterCellDetail
      type={CellEnum.PROFILES}
      title={language('filterScreen.findProfiles')}
      description={getDescription()}
      onPress={onCellPressed}
    />
  );
}

export default memo(FilterProfilesContainer);
