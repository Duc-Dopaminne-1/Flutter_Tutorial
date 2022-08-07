import React from 'react';
import { View, Text } from 'react-native';
import styles from '@screens/tenant/MaintenanceReportsTenant/ModalTenant/Items/styles';

export interface Props {
  item: any;
  index: number;
}

const Header = (props: Props) => {
  const { item, index } = props;
  return (
    <View style={[styles.container, { backgroundColor: index % 2 == 0 ? '#F9F9FC' : '#FFFFFF' }]}>
      <View style={styles.firstText}>
        <Text style={styles.text} numberOfLines={2}>
          {item.range}
        </Text>
      </View>

      <View style={styles.secondText}>
        <Text style={styles.text} numberOfLines={2}>
          {item.numbRequest}
        </Text>
      </View>

      <View style={styles.threeText}>
        <Text style={styles.text} numberOfLines={2}>
          {item.percent}
        </Text>
      </View>
    </View>
  );
};
export default React.memo(Header);
