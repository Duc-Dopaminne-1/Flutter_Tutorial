import { language } from '@/i18n';
import { filterAgeRangeSelector } from '@/redux/filters/selector';
import React, { memo, ReactElement } from 'react';
import FilterCellDetail, { CellEnum } from './CellDetail';

interface FilterAgeRangeContainerProps {
  onCellPressed: (type: CellEnum) => void;
}

function FilterAgeRangeContainer(props: FilterAgeRangeContainerProps): ReactElement {
  const { onCellPressed = () => {} } = props;
  const ageRangeSelected = filterAgeRangeSelector();
  const filterAgeRangeDesc = ageRangeSelected ? `${ageRangeSelected.min}-${ageRangeSelected.max}` : language('filterScreen.none');
  return (
    <FilterCellDetail
      type={CellEnum.AGE_RANGE}
      title={language('filterScreen.ageRange')}
      description={filterAgeRangeDesc}
      onPress={() => onCellPressed(CellEnum.AGE_RANGE)}
    />
  );
}

export default memo(FilterAgeRangeContainer);
