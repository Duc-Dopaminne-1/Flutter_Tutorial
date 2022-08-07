import CustomItemSetting from '@/components/CustomItemSetting';
import { language } from '@/i18n';
import { filterAuctionStatusSelector } from '@/redux/filters/selector';
import { AuctionStatusDumpData, FilterAuctionStatusEnum } from '@/redux/filters/types';
import { IconAuctionSetting } from '@/vars/imagesSvg';
import React, { memo, ReactElement, useState } from 'react';
import { AuctionStatusDialog } from './AuctionStatusDialog';

const AuctionStatusContainer = (): ReactElement => {
  const [auctionDialogVisible, setAuctionDialogVisible] = useState(false);
  const status = filterAuctionStatusSelector();

  const mapAuctionStatus = () => {
    if (!status) return language('filterScreen.none');
    switch (status) {
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

  return (
    <>
      <CustomItemSetting
        title={language('filterScreen.auctionStatus')}
        content={mapAuctionStatus()}
        onPress={() => setAuctionDialogVisible(true)}
        image={<IconAuctionSetting />}
      />

      <AuctionStatusDialog
        isVisible={auctionDialogVisible}
        onBackdropPress={() => {
          setAuctionDialogVisible(false);
        }}
      />
    </>
  );
};

export default memo(AuctionStatusContainer);
