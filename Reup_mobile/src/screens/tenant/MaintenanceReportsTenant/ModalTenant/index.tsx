import React from 'react';
import { View, Text, FlatList } from 'react-native';
import MaintenanceReportItem from '@screens/tenant/MaintenanceReportsTenant/ModalTenant/Items/Item';
import { CustomButton } from '@components/CustomButton';
import translate from '@src/localize';
import styles from '@screens/tenant/MaintenanceReportsTenant/ModalTenant/styles';

interface Props {
  onCloseModal?: () => void;
  id?: string;
}

const data = [
  {
    id: '1',
    range: '12',
    numbRequest: '27',
    percent: '22,4%',
  },
  {
    id: '2',
    range: '23  ',
    numbRequest: '27',
    percent: '22,4%',
  },
  {
    id: '3',
    range: 'Less than 2 days',
    numbRequest: '27',
    percent: '22,4%',
  },
  {
    id: '4',
    range: 'Less than 2 days',
    numbRequest: '27',
    percent: '22,4%',
  },
  {
    id: '5',
    range: 'Less than 2 days',
    numbRequest: '27',
    percent: '22,4%',
  },
  {
    id: '6',
    range: '23  ',
    numbRequest: '27',
    percent: '22,4%',
  },
  {
    id: '7',
    range: 'Less than 2 days',
    numbRequest: '27',
    percent: '22,4%',
  },
  {
    id: '8',
    range: 'Less than 2 days',
    numbRequest: '27',
    percent: '22,4%',
  },
  {
    id: '9',
    range: 'Less than 2 days',
    numbRequest: '27',
    percent: '22,4%',
  },
];

const MaintenanceReportModalTenant = (prop: Props) => {
  const { onCloseModal, id = 'id' } = prop;

  return (
    <View style={styles.container}>
      <View style={styles.wrapHeader}>
        <Text style={styles.titleHeader}>{translate('report.range')}</Text>
        <Text style={styles.titleHeader}>{translate('report.number_request')}t</Text>
        <Text style={styles.titleHeader}>{translate('report.percent')}</Text>
      </View>

      <FlatList
        key={id}
        data={data}
        renderItem={({ item, index }) => {
          return <MaintenanceReportItem key={id} item={item} index={index} />;
        }}
        style={styles.flatlist}
        keyExtractor={(_item) => _item.id}
      />
      <View style={styles.wrapButton}>
        <CustomButton onPress={onCloseModal} text={translate('report.close')} style={styles.button} textStyle={styles.textButton} />
      </View>
    </View>
  );
};

export default React.memo(MaintenanceReportModalTenant);
