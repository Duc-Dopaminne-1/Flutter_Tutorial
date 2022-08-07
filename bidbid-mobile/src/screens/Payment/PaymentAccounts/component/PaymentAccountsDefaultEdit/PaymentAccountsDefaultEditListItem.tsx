import React, { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { CustomLine } from '@/components/CustomeLine';
import { RulePayment } from '@/constants/app';
import { ActionSaveAllPaymentPayload } from '@/redux/payment';
import { CardIconView } from 'react-native-credit-card-input';
import TickBlueSVG from '@/components/SVG/TickBlueSVG';
import IconPaypalSVG from '@/components/SVG/IconPaypalSVG';
import IconCardDefaultSVG from '@/components/SVG/IconCardDefaultSVG';

interface Prop {
  title: string;
  onPress?: () => void;
  itemSelected?: number;
  id?: number;
  item?: ActionSaveAllPaymentPayload;
}
function PaymentAccountsDefaultEditListItem(props: Prop): ReactElement {
  const { title, onPress, itemSelected, id, item } = props;
  const isDefault = itemSelected === id;

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
      <Pressable onPress={onPress} style={[styles.container, isDefault ? styles.wrapDefault : {}]}>
        <View style={styles.wrapItem}>
          {renderIconPayment()}
          <View style={styles.wrapText}>
            <Text numberOfLines={1} style={styles.textTitle}>
              {title}
            </Text>
          </View>
          {isDefault && <TickBlueSVG />}
        </View>
      </Pressable>
      <CustomLine lineStyle={styles.line} />
    </View>
  );
}

export default React.memo(PaymentAccountsDefaultEditListItem);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  wrapItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapText: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  textTitle: {
    color: colors.gray_600,
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsRegular,
    flexShrink: 1,
  },
  wrapDefault: {
    backgroundColor: colors.gray_100,
  },
  line: {
    height: 0.5,
    marginLeft: 15,
  },
});
