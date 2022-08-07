import React, { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { CustomLine } from '@/components/CustomeLine';
import { ActionSaveAllPaymentPayload } from '@/redux/payment';
import { RulePayment } from '@/constants/app';
import { CardIconView } from 'react-native-credit-card-input';
import NextSVG from '@/components/SVG/NextSVG';
import IconPaypalSVG from '@/components/SVG/IconPaypalSVG';
import IconCardDefaultSVG from '@/components/SVG/IconCardDefaultSVG';

interface Prop {
  title: string;
  onPress?: (item: any) => void;
  isFromDefault?: boolean;
  item?: ActionSaveAllPaymentPayload;
}

export function PaymentAccountsItem(props: Prop): ReactElement {
  const { title, onPress, isFromDefault, item } = props;

  const onPressItem = () => {
    onPress && onPress(item);
  };

  const renderIconPayment = () => {
    switch (item.type) {
      case RulePayment.PayPal:
        return <IconPaypalSVG />;
      case RulePayment.Card:
        return <CardIconView brand={item.cardType} />;
      default:
        return <IconCardDefaultSVG />;
    }
  };

  return (
    <View>
      <Pressable onPress={onPressItem} style={styles.container}>
        <View style={styles.wrapItem}>
          {renderIconPayment()}
          <View style={styles.wrapText}>
            <Text numberOfLines={1} style={styles.textTitle}>
              {title}
            </Text>
          </View>
          {!isFromDefault && <NextSVG />}
        </View>
      </Pressable>
      {isFromDefault ? null : <CustomLine />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  wrapText: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  wrapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 12,
  },
  textTitle: {
    color: colors.gray_600,
    fontSize: fonts.size.s14,
    fontFamily: fonts.family.PoppinsRegular,
    flexShrink: 1,
  },
});
