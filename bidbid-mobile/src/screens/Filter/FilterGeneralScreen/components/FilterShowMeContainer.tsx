import { language } from '@/i18n';
import { filterGenderSelector, getFilter } from '@/redux/filters/selector';
import { sortArrayByOrder, useLocalizeGenderName } from '@/shared/processing';
import React, { memo, ReactElement } from 'react';
import FilterCellDetail, { CellEnum } from './CellDetail';

interface FilterShowMeContainerProps {
  onCellPressed: (type: CellEnum) => void;
}

function FilterShowMeContainer(props: FilterShowMeContainerProps): ReactElement {
  const { onCellPressed = () => {} } = props;
  const genderSelected = filterGenderSelector();
  const { gendersList } = getFilter().data;
  const getGenderName = useLocalizeGenderName();
  const genderNameSelected = sortArrayByOrder(genderSelected.map(item => gendersList.find(i => i.id === item.id) || item)).map(item =>
    getGenderName(item),
  );
  const genderDesc = genderNameSelected.length > 0 ? genderNameSelected.join(', ') + ' ' : language('filterScreen.none');
  return (
    <FilterCellDetail type={CellEnum.GENDER} title={language('filterScreen.showMe')} description={genderDesc} onPress={onCellPressed} />
  );
}

export default memo(FilterShowMeContainer);
