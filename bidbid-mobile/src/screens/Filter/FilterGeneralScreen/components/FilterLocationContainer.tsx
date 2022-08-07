import { language } from '@/i18n';
import { filterDistanceSelector, filterGlobalSelector, filterSelector, getFilter } from '@/redux/filters/selector';
import React, { memo, ReactElement } from 'react';
import FilterCellDetail, { CellEnum } from './CellDetail';

interface FilterLocationContainerProps {
  onCellPressed: (type: CellEnum) => void;
}

function FilterLocationContainer(props: FilterLocationContainerProps): ReactElement {
  const { onCellPressed = () => {} } = props;
  const global = filterGlobalSelector();
  const filterSelectorData = filterSelector();
  const distance = filterDistanceSelector();
  const filterMaxDistanceDesc = distance
    ? `${distance.max}${distance.unit === 'Mi' ? 'mi' : 'km'} ${language('max')}`
    : language('filterScreen.none');
  const countryDesc = filterSelectorData.hasOwnProperty('location') ? filterSelectorData.location?.name : '';
  return (
    <>
      {!global && (
        <FilterCellDetail
          isFromLocation
          countryDesc={countryDesc}
          description={filterMaxDistanceDesc}
          type={CellEnum.LOCATION}
          title={language('location')}
          onPress={() => onCellPressed(CellEnum.LOCATION)}
        />
      )}
    </>
  );
}

export default memo(FilterLocationContainer);
