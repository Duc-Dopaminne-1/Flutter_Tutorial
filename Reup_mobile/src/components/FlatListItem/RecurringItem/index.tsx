import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styles from './styles';
import { CustomText } from '@src/components/CustomText';
import { capitalizeFirstLetter } from "@utils/TextUtils";
import { ICompanyMaintenanceRecurringTask } from '@reup/reup-api-sdk/libs/api/company/maintenance/recurring-task/models';
import translate from '@src/localize';

type Props = {
  onPress: (id: string) => void;
  item: ICompanyMaintenanceRecurringTask;
};

const RecurringItem = (props: Props) => {
  const { item, onPress } = props;
  const styleStatus = item.is_active ? styles.statusActive : styles.statusInActive;
  const styleTextStatus = item.is_active ? styles.statusTextActive : styles.statusTextInActive;
  const textStatus = item.is_active ? translate('recurring_task.active') : translate('recurring_task.inactive');

  return (
    <TouchableOpacity
      onPress={() => onPress(item.id)}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <CustomText
          style={styles.title}
          text={item.title}
          numberOfLines={2}
        />
        <View style={styles.contentStatusContainer}>
          <View style={styles.itemCategoryView}>
            <CustomText
              styleContainer={{ flex: 1 }}
              style={styles.itemCategory}
              text={item.descriptions}
              numberOfLines={2}
            />
          </View>
          <View style={[styles.status, styleStatus]}>
            <CustomText
              style={[styles.statusText, styleTextStatus]}
              text={capitalizeFirstLetter(textStatus)}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity >
  );
};

export default React.memo(RecurringItem);
