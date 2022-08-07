import React, { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { CustomLine } from '@/components/CustomeLine';
import { RulePayment } from '@/constants/app';
import IconPaypalSVG from '@/components/SVG/IconPaypalSVG';
import IconCardDefaultSVG from '@/components/SVG/IconCardDefaultSVG';

interface Prop {
  title: string;
  onPress?: () => void;
  type: string;
}
function PaymentAccountsSelectMethodItem(props: Prop): ReactElement {
  const { title, onPress, type } = props;

  const renderIconPayment = () => {
    switch (type) {
      case RulePayment.PayPal:
        return <IconPaypalSVG />;
      case RulePayment.Card:
        return <IconCardDefaultSVG />;
      default:
        return <IconCardDefaultSVG />;
    }
  };

  return (
    <View>
      <Pressable onPress={onPress} style={styles.container}>
        <View style={styles.wrapItem}>
          {renderIconPayment()}
          <View style={styles.wrapText}>
            <Text numberOfLines={1} style={styles.textTitle}>
              {title}
            </Text>
          </View>
        </View>
      </Pressable>
      <CustomLine lineStyle={styles.line} />
    </View>
  );
}

export default React.memo(PaymentAccountsSelectMethodItem);

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
  line: {
    height: 0.5,
    marginLeft: 15,
  },
});
