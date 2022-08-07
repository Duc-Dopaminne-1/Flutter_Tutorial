import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/vars';

interface Prop {
  name: string;
  city: string;
}
function ChooseCharityFlatlistItemLogo(props: Prop) {
  const { name, city } = props;

  return (
    <View style={styles.wrapItem}>
      <View style={styles.wrapName}>
        <Text style={styles.textName}>{name}</Text>
        <Text style={styles.textCity}>{city}</Text>
      </View>
    </View>
  );
}

export default React.memo(ChooseCharityFlatlistItemLogo);

const styles = StyleSheet.create({
  textName: {
    marginLeft: 12,
    color: colors.gray_900,
    fontSize: fonts.size.s14,
    lineHeight: 20,
  },
  textCity: {
    marginLeft: 12,
    color: colors.text_grey_beta,
    fontSize: fonts.size.s10,
  },
  wrapName: {
    marginBottom: 12,
  },
  wrapItem: {
    flex: 1,
    justifyContent: 'center',
  },
});
