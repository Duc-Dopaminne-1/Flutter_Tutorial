import { language } from '@/i18n';
import { appLocaleSelector } from '@/redux/app/selector';
import { setFilterAgeRange } from '@/redux/filters/actions';
import { filterAgeRangeSelector } from '@/redux/filters/selector';
import React, { memo, ReactElement, useCallback, useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { SettingItemSlider } from '../SettingItemSlider';
import IconGrayAgeRageSVG from '@/components/SVG/IconGrayAgeRageSVG';

const AgeRangeContainer = (): ReactElement => {
  appLocaleSelector();
  const [ageRange, setAgeRange] = useState([18, 100]);
  const dispatch = useDispatch();
  const ageRangeSelected = filterAgeRangeSelector();
  useLayoutEffect(() => {
    setAgeRange(ageRangeSelected ? [ageRangeSelected.min, ageRangeSelected.max] : [18, 100]);
  }, [ageRangeSelected]);

  const onValuesChangeFinishCallback = useCallback((value: number[]) => {
    dispatch(
      setFilterAgeRange(value[0], value[1], {
        onSuccess: () => {},
        onFail: () => {},
      }),
    );
  }, []);

  const onValuesChangeCallback = useCallback((value: number[]) => {
    setAgeRange(value);
  }, []);

  return (
    <SettingItemSlider
      title={language('ageRage')}
      content={ageRange}
      onValuesChangeFinishCallback={onValuesChangeFinishCallback}
      onValuesChangeCallback={onValuesChangeCallback}
      image={<IconGrayAgeRageSVG />}
    />
  );
};

export default memo(AgeRangeContainer);
