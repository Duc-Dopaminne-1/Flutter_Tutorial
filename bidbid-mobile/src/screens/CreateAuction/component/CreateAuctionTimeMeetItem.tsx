import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { TIME_MEET } from '@/models';
import { localizeDuration } from '@/shared/processing';
import RadioCheckedSVG from '@/components/SVG/RadioCheckedSVG';
import RadioUnCheckSVG from '@/components/SVG/RadioUnCheckSVG';

interface CreateAuctionTimeMeetItemProps {
  item: TIME_MEET;
  onPress?: (item: number) => void;
  itemSelected?: number;
}
function CreateAuctionTimeMeetItem(props: CreateAuctionTimeMeetItemProps) {
  const {
    item: { name, id },
    onPress,
    itemSelected,
  } = props;

  const renderRadio = () => {
    if (itemSelected === id) {
      return <RadioCheckedSVG />;
    }
    return <RadioUnCheckSVG />;
  };

  const onPressItem = () => {
    onPress(id);
  };
  return (
    <View style={styles.container}>
      <Pressable onPress={onPressItem} style={styles.wrapItem}>
        {renderRadio()}
        <Text style={styles.textHeader}>{localizeDuration(name)}</Text>
      </Pressable>
    </View>
  );
}

export default memo(CreateAuctionTimeMeetItem);

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  wrapItem: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: '15%',
  },
  textHeader: {
    fontSize: fonts.size.s16,
    fontWeight: '500',
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  },
});
