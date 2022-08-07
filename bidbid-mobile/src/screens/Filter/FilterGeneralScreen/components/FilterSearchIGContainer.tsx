import { language } from '@/i18n';
import { filterInstaUsernameSelector } from '@/redux/filters/selector';
import React, { memo, ReactElement } from 'react';
import FilterCellDetail, { CellEnum } from './CellDetail';

interface FilterSearchIGContainerProps {
  onCellPressed: (type: CellEnum) => void;
}

function FilterSearchIGContainer(props: FilterSearchIGContainerProps): ReactElement {
  const { onCellPressed = () => {} } = props;
  const instaUsernameSelected = filterInstaUsernameSelector();
  const filterIGUsernameDesc = instaUsernameSelected || language('profileGeneral.igUsername');
  return (
    <FilterCellDetail
      type={CellEnum.IG_USERNAME}
      title={language('filterScreen.searchIGUsername')}
      description={filterIGUsernameDesc}
      onPress={onCellPressed}
    />
  );
}

export default memo(FilterSearchIGContainer);
