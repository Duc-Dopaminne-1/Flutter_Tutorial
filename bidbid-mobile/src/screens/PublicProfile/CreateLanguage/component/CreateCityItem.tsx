import React, { ReactElement } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import DefaultText from '@/components/CustomText/DefaultText';
import LocationSVG from '@/components/SVG/LocationSVG';
import EditLineSVG from '@/components/SVG/EditLineSVG';

interface CreateCityItemProps {
  onOpenMap?: () => void;
  textAddress?: string;
}
export function CreateCityItem(props: CreateCityItemProps): ReactElement {
  const { onOpenMap, textAddress } = props;

  return (
    <Pressable onPress={onOpenMap} style={styles.container}>
      <LocationSVG />
      <View style={styles.wrapAddress}>
        <DefaultText {...{ style: styles.textAddress }}>{textAddress === '' ? language('addCity') : textAddress}</DefaultText>
      </View>
      <EditLineSVG />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray_100,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: 15,
  },
  textAddress: {
    flexShrink: 1,
    fontSize: fonts.size.s16,
    color: colors.gray_900,
  },
  wrapAddress: {
    flex: 1,
    marginLeft: 12,
    marginRight: 5,
  },
});
