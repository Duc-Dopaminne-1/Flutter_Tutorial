import * as React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { capitalizeAllWorks, getAgeFromDateOfBirth } from '@/shared/processing';
import { isIOS } from '@/shared/devices';

export type Props = {
  firstName: string;
  dateOfBirth: any;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  hideAge?: boolean;
};

export function UserNameAge(Props: Props) {
  const { firstName = '', dateOfBirth = '', containerStyle, textStyle = {}, hideAge } = Props;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.text, textStyle]} numberOfLines={1}>
        {capitalizeAllWorks(firstName)}
      </Text>
      <Text style={[styles.textAge, textStyle]}>{hideAge ? '' : ', ' + getAgeFromDateOfBirth(dateOfBirth)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    marginVertical: 5,
    flexDirection: 'row',
  } as ViewStyle,
  textAge: {
    color: colors.gray_900,
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: isIOS ? '600' : 'bold',
  } as TextStyle,

  text: {
    flexShrink: 1,
    color: colors.gray_900,
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: isIOS ? '600' : 'bold',
  } as TextStyle,
});
