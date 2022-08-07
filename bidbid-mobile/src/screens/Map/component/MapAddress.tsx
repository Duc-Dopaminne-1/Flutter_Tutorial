import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { colors, fonts, screenWidth } from '@/vars';
import { alertError } from '@/shared/alert';
import { useAlertMessage } from '@/constants/messageConstants';

interface Prop {
  address: string;
  onPressAddAddress: () => void;
  titleButton?: string;
}
const MapAddress = (props: Prop) => {
  const alertMessage = useAlertMessage();
  const { address = '', onPressAddAddress, titleButton } = props;

  const addAddress = () => {
    if (!address) {
      alertError(alertMessage.EMPTY_FIELD);
    } else {
      onPressAddAddress();
    }
  };

  return (
    <View>
      {address ? (
        <View style={styles.wrapAddress}>
          <Text style={styles.text}>{address}</Text>
        </View>
      ) : null}

      <CustomButton
        onPress={addAddress}
        textStyle={styles.textBtn}
        containerStyle={[styles.btnContinue, address ? { backgroundColor: colors.red_700 } : { backgroundColor: colors.gray_400 }]}
        text={titleButton}
      />
    </View>
  );
};

export default React.memo(MapAddress);

const styles = StyleSheet.create({
  btnContinue: {
    position: 'absolute',
    bottom: 25,
    zIndex: 2,
    alignSelf: 'center',
    backgroundColor: colors.red_700,
    width: screenWidth - 30,
    paddingVertical: 13,
  },
  textBtn: {
    color: colors.white,
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s18,
    fontWeight: null,
  },
  wrapAddress: {
    width: screenWidth - 30,
    position: 'absolute',
    bottom: 90,
    backgroundColor: colors.white,
    alignSelf: 'center',
    maxHeight: 70,
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 10,
  },
  text: {
    flex: 1,
  },
});
