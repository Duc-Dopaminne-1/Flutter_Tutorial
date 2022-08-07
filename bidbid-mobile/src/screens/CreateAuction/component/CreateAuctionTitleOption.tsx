import React, { ReactElement, memo } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
import { CustomLine } from '@/components/CustomeLine';
import NextRedSvg from '@/components/SVG/NextRedSvg';

interface CreateAuctionTitleOptionProps {
  icon?: ReactElement;
  onPress: () => void;
  title: string;
}

function CreateAuctionTitleOption(props: CreateAuctionTitleOptionProps): ReactElement {
  const { icon, onPress, title } = props;

  return (
    <Pressable onPress={onPress}>
      <View style={styles.wrapItem}>
        <View style={styles.wrapTitle}>
          {icon && icon}
          <Text style={styles.title}>{title}</Text>
        </View>
        <NextRedSvg />
      </View>
      <CustomLine lineStyle={styles.lineStyle} />
    </Pressable>
  );
}

export default memo(CreateAuctionTitleOption);

const styles = StyleSheet.create({
  wrapItem: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  wrapTitle: {
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    color: colors.red_700,
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: '400',
    marginLeft: 5,
  },
  lineStyle: {
    height: 0.5,
  },
});
