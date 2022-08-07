import React, { ReactElement, memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/vars';
import ContactSVG from '@/components/SVG/ContactSVG';

interface ShareContactItemNameProps {
  value: string;
  phone: string;
}
function ShareContactItemName(props: ShareContactItemNameProps): ReactElement {
  const { value, phone } = props;

  return (
    <View style={styles.wrapName}>
      <ContactSVG />
      <View style={styles.wrapPhone}>
        <Text style={styles.textName}>{value}</Text>
        <Text style={styles.textPhone}>{phone}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapName: {
    flexDirection: 'row',
  },
  textName: {
    fontSize: fonts.size.s16,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: '500',
    marginBottom: 3,
  },
  wrapPhone: {
    marginLeft: 12,
    marginTop: 10,
  },
  textPhone: {
    fontSize: fonts.size.s14,
    color: colors.gray_500,
    fontFamily: fonts.family.RobotoRegular,
    marginBottom: 10,
  },
});

export default memo(ShareContactItemName);
