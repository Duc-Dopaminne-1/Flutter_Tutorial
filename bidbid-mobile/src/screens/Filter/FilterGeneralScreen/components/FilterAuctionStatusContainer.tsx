import { language } from '@/i18n';
import { filterAuctionStatusSelector } from '@/redux/filters/selector';
import { AuctionStatusDumpData, FilterAuctionStatusEnum } from '@/redux/filters/types';
import React, { memo, ReactElement } from 'react';
import FilterCellDetail, { CellEnum } from './CellDetail';

interface FilterAuctionStatusContainerProps {
  onCellPressed: (type: CellEnum) => void;
}

function FilterAuctionStatusContainer(props: FilterAuctionStatusContainerProps): ReactElement {
  const { onCellPressed = () => {} } = props;

  const statusSelected = filterAuctionStatusSelector();

  const mapAuctionStatus = () => {
    if (!statusSelected) return language('filterScreen.none');
    switch (statusSelected) {
      case FilterAuctionStatusEnum.ALL:
        return language(`auctionStatus.${AuctionStatusDumpData[0].name}`, { defaultValue: AuctionStatusDumpData[0].description });
      case FilterAuctionStatusEnum.BIDDING:
        return language(`auctionStatus.${AuctionStatusDumpData[1].name}`, { defaultValue: AuctionStatusDumpData[1].description });
      case FilterAuctionStatusEnum.END_TIME:
        return language(`auctionStatus.${AuctionStatusDumpData[2].name}`, { defaultValue: AuctionStatusDumpData[2].description });
      case FilterAuctionStatusEnum.MEET_TIME:
        return language(`auctionStatus.${AuctionStatusDumpData[3].name}`, { defaultValue: AuctionStatusDumpData[3].description });
      default:
        return language(`auctionStatus.${AuctionStatusDumpData[0].name}`, { defaultValue: AuctionStatusDumpData[0].description });
    }
  };

  const filterAuctionStatusDesc = mapAuctionStatus() || '';

  return (
    <FilterCellDetail
      type={CellEnum.AUCTION_STATUS}
      title={language('filterScreen.auctionStatus')}
      description={filterAuctionStatusDesc}
      onPress={onCellPressed}
    />
  );
}

export default memo(FilterAuctionStatusContainer);
