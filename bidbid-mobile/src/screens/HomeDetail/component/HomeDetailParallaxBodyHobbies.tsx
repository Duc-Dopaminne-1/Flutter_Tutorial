import React, { ReactElement, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { CustomText } from '@/components/CustomText';
import { HomeDetailContext } from '@/screens/HomeDetail/HomeDetailContext';
import { useLocalizeNameField } from '@/shared/processing';

export function HomeDetailParallaxBodyHobbies(): ReactElement {
  const localizeNameField = useLocalizeNameField();

  const {
    profile: { interests },
  } = useContext(HomeDetailContext);

  if (!interests || interests.length < 1) return null;

  return (
    <View style={styles.container}>
      {interests.map((item: any) => {
        return (
          <CustomText key={item.id.toString()} containerStyle={styles.wrapItem} titleStyle={styles.title} title={localizeNameField(item)} />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wrapItem: {
    minWidth: 50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.gray_400,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 5,
    marginRight: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray_50,
  },

  title: {
    fontSize: fonts.size.s14,
    color: colors.gray_600,
    fontFamily: fonts.family.PoppinsRegular,
  },
});
