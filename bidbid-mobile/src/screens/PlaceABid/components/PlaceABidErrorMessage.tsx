import React, { ReactElement } from 'react';
import { Text, TextStyle, ViewStyle, View } from 'react-native';
import { colors, fonts } from '@/vars';

const CONTAINER: ViewStyle = {
  marginHorizontal: 15,
  alignItems: 'center',
};

const ERROR_MESSAGE_TEXT: TextStyle = {
  fontSize: 16,
  fontWeight: '500',
  color: colors.red_700,
  fontFamily: fonts.family.SSPRegular,
  alignItems: 'center',
  textAlign: 'center',
};

interface PlaceABidErrorMessageProps {
  errorMessage: string;
}

export function PlaceABidErrorMessage(props: PlaceABidErrorMessageProps): ReactElement {
  const { errorMessage = '' } = props;
  if (errorMessage === null || errorMessage === undefined || errorMessage.length === 0) return null;
  return (
    <View style={CONTAINER}>
      <Text style={ERROR_MESSAGE_TEXT}>{errorMessage}</Text>
    </View>
  );
}
