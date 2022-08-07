import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {ViewBottom} from './ConfirmPropertyComponents';
import {TransactionContextType} from './ConfirmPropertyConstants';

storiesOf('z|b2c/ConfirmProperty', module) //format
  .add('ViewBottom', () => {
    const Story = ({
      name,
      contextType = TransactionContextType.Booking,
      endDepositeDatetime = Date(),
      isSaleAgent = true,
      isAgentUser = true,
      haveContactTrading,
    }) => {
      const props = {
        data: {
          contextType,
          bookingTransactionInfo: {
            endDepositeDatetime,
          },
          depositeDuration: {
            endDepositeTimeInSecond: null,
          },
          bookingFee: '50.000.000đ',
        },
        isAgentUser,
        isSaleAgent,
        haveContactTrading,
      };
      return (
        <>
          <View style={styles.container}>
            <Text>{name}</Text>
          </View>
          <ViewBottom {...props} />
        </>
      );
    };

    return (
      <>
        <Story name="Booking" />
        <Story name="ContactTrading" isSaleAgent={false} />
        <Story name="HaveContactTrading" isSaleAgent={false} haveContactTrading />
        <Story name="BookedDeposit" contextType={TransactionContextType.BookedDeposit} />
      </>
    );
  });

const styles = StyleSheet.create({
  container: {backgroundColor: 'lightgray', padding: 4},
});
