import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Alert } from 'react-native';
import styles from './styles';

import Container from '@src/components/Container';

import CustomSectionHeader from '@src/components/CustomSection';

import translate from '@src/localize';

import getStyles from '@src/utils/getStyles';
import { getKeyboardAdvoidStyle, upperCaseFirstChar } from '@src/utils';

import { CustomFlatList } from '@src/components/FlatList';
import RecurringDetailItem from '@src/components/FlatListItem/RecurringDetailItem';
import { RecurringDetailTaskItem } from '@src/components/FlatListItem/RecurringItem/Models';
import { CustomButton } from '@src/components/CustomButton';

import { ICON_RECURRING_TASK } from '@src/constants/icons';
import { useRoute } from '@react-navigation/native';
import { ICompanyMaintenanceRecurringTask } from '@reup/reup-api-sdk/libs/api/company/maintenance/recurring-task/models';
import { EDIT_RECURRING_TASK } from '@src/constants/screenKeys';
import NavigationActionsService from '@src/navigation/navigation';

interface Props {
  item: ICompanyMaintenanceRecurringTask;
  ref: any
}

interface InfoItem {
  key?: string,
  title?: string,
  value?: any,
}

const RecurringTaskDetailTenant = (props: Props) => {

  const router = useRoute()
  const { item, ref } = router.params as Props

  const dataDetailItems: InfoItem[] = [
    { key: 'title', title: "Task Title", value: item.title ?? '' },
    { key: 'status', title: "Task Status", value: item.is_active },
    { key: 'category', title: "Category", value: item.category ? item.category.name : '' },
    { key: 'priority', title: "Priority", value: item.priority ?? '' },
    { key: 'note', title: "Note", value: item.descriptions ?? '' },
    { key: 'interval', title: "Interval to perform this task", value: item.frequency + '/' + upperCaseFirstChar(item.frequency_type) },
  ]

  const onLoad = () => {

  };

  const onPressSave = () => {
    if (item) {
      NavigationActionsService.push(EDIT_RECURRING_TASK, { item: item, ref })
    }
  };

  const _renderDetailItem = (detailItem: RecurringDetailTaskItem) => {
    return (
      <RecurringDetailItem
        dataKey={detailItem.key}
        title={detailItem.title}
        value={detailItem.value} />
    );
  };

  const _itemSeparator = () => {
    return (
      <View style={styles.lineContainer} />
    );
  };

  const renderCustomHeader = () => {
    return (
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={translate('recurring.title_detail_section').toUpperCase()}
        icon={ICON_RECURRING_TASK}
      />
    );
  };

  const renderCustomFlatList = () => {
    return (
      <View style={styles.listContainer}>
        <CustomFlatList
          onLoad={onLoad}
          ItemSeparatorComponent={_itemSeparator}
          data={dataDetailItems}
          renderItem={_renderDetailItem} />
      </View>
    );
  };

  const renderBottomButton = () => {
    return (
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={onPressSave}
          text={translate('recurring.edit_button').toUpperCase()}
          style={styles.button} />
      </View>
    );
  };

  return (
    <Container
      isShowHeader={true}
      spaceBottom={true}
      isDisplayNotification={false}
      isDisplayMenuButton={false}
      title={translate('recurring.title_detail_nav_bar')}
      isDisplayBackButton={true}>
      <View style={styles.container}>
        {renderCustomHeader()}
        {renderCustomFlatList()}
        {renderBottomButton()}
      </View>
    </Container>
  );
};

export default React.memo(RecurringTaskDetailTenant);
