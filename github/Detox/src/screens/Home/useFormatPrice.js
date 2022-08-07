import {useContext} from 'react';

import {AppContext} from '../../appData/appContext/useAppContext';
import {getUnitOfMeasureById} from '../../utils/GetMasterData';
import MeasureUtils from '../../utils/MeasureUtils';
import PropertyPostUtils from '../ManagePost/PropertyPostUtils';

export const useFormatPrice = () => {
  const {getMasterData} = useContext(AppContext);
  const formatPrice = (price, unitOfMeasureId) => {
    if (!unitOfMeasureId) {
      return MeasureUtils.getPriceDescriptionNoUnitInput(price);
    }
    const unitOfMeasure = getUnitOfMeasureById(getMasterData(), unitOfMeasureId);
    return PropertyPostUtils.priceToString(price, unitOfMeasure);
  };
  return {formatPrice};
};
