import _get from 'lodash/get';

import {SearchProjectInfoDto} from '../api/graphql/generated/graphql';
import {SEASON_STATUS} from '../assets/constants';

export const getProjectStatistic = (data: SearchProjectInfoDto) => {
  const seasonStatusName = _get(data, 'saleSeason.seasonStatusName');
  const saleSeasonStatistic = _get(data, 'saleSeasonStatistic');
  let statusLabel = 'Đã cọc, bán';
  if (seasonStatusName) {
    let availableText = null;
    let availableValue = null;
    let statusValue = null;
    let countDownTime = null;
    if (
      seasonStatusName === SEASON_STATUS.NEW ||
      seasonStatusName === SEASON_STATUS.RESERVATION_OPENING ||
      seasonStatusName === SEASON_STATUS.RELOCATION_LOCK
    ) {
      availableText = 'Còn trống';
      availableValue = _get(saleSeasonStatistic, 'availableCount', 0) || 0;
      statusLabel = 'Có đặt chỗ';
      statusValue = _get(saleSeasonStatistic, 'bookedCount', 0) || 0;
      countDownTime = data.saleSeason.openDatetime;
    } else if (
      seasonStatusName === SEASON_STATUS.SALE_OPENING ||
      seasonStatusName === SEASON_STATUS.SALE_CLOSING
    ) {
      availableText = 'Còn trống';
      availableValue = _get(saleSeasonStatistic, 'availableCount', 0) || 0;
      statusLabel = 'Đã cọc, bán';
      statusValue =
        (_get(saleSeasonStatistic, 'depositCount', 0) || 0) +
        (_get(saleSeasonStatistic, 'soldCount', 0) || 0);
    }
    return {
      countDownTime,
      availableText,
      availableValue,
      statusLabel,
      statusValue,
    };
  }
  return {statusLabel};
};
