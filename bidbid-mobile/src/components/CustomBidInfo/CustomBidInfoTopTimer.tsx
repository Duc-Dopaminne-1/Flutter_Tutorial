import React, { useMemo } from 'react';
import { TextStyle, View } from 'react-native';
import { CountDownComponent } from '@/components/CountDownTime';
import { formatCountDown } from '@/shared/processing';

interface Prop {
  infoTime?: string;
  isAuctionProgress?: boolean;
  timeStyle?: TextStyle;
  endTimeCB?: () => void;
  onPressTime?: () => void;
}

export const CustomBidInfoTopTimer = React.memo((props: Prop) => {
  const { infoTime, isAuctionProgress, timeStyle, onPressTime, endTimeCB } = props;

  const time = useMemo(() => {
    return formatCountDown(infoTime);
  }, [infoTime]);

  return (
    <View>
      <CountDownComponent
        timeStyle={timeStyle}
        onPressTime={onPressTime}
        isAuctionProgress={isAuctionProgress}
        until={time}
        onFinish={endTimeCB}
      />
    </View>
  );
});
