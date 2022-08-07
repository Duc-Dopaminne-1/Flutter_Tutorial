import React from 'react';
import { View, } from 'react-native';
import styles from './styles';
import { CustomText } from '@src/components/CustomText';
import translate from '@src/localize';
import { Theme } from '@src/components/Theme';
import { IVisitor } from '@reup/reup-api-sdk/libs/api/frontdesk/visitor/model';
import { VisitorState } from '@reup/reup-api-sdk/libs/api/enum';
import { formatTime } from '@src/utils';

type Props = {
  item: IVisitor;
};

type ItemProps = {
  title: string;
  value: string;
  titleStyles?: any;
  titleContainerStyle?: any;
  valueContainerStyle?: any;
  valueStyles?: any;
}

const MyVisitorTenantItem = (props: Props) => {

  const { item } = props;
  let textStatus = '';
  let statusBackgroundColor = '';
  let statusTextColor = '';

  switch (item.state) {
    case VisitorState.Draft:
      textStatus = translate('visitor_list.draft');
      statusBackgroundColor = Theme.visitor_list.draft_status;
      statusTextColor = Theme.visitor_list.draft_text;
      break;
    case VisitorState.Arrived:
      textStatus = translate('visitor_list.arrived');
      statusBackgroundColor = Theme.visitor_list.arrived_status;
      statusTextColor = Theme.visitor_list.arrived_text;
      break;
    case VisitorState.Left:
      textStatus = translate('visitor_list.left');
      statusBackgroundColor = Theme.visitor_list.left_status;
      statusTextColor = Theme.visitor_list.left_text;
      break;
  }

  const InfoItem = (props: ItemProps) => {
    const { title, value, titleStyles, valueStyles, titleContainerStyle, valueContainerStyle } = props;
    return (
      <View style={styles.itemContainer}>
        <CustomText
          text={title}
          style={[styles.titleStyle, titleStyles]}
          styleContainer={[styles.titleContainerStyle, titleContainerStyle]}
        />
        <CustomText
          text={value}
          style={[styles.valueStyle, valueStyles]}
          styleContainer={[styles.valueContainerStyle, valueContainerStyle]}
        />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <InfoItem
        title={item && formatTime(item.expected_arrival_date)}
        value={textStatus}
        titleStyles={styles.arriveDateText}
        titleContainerStyle={styles.arriveDateContainer}
        valueStyles={{ color: statusTextColor }}
        valueContainerStyle={[styles.statusContainer, { backgroundColor: statusBackgroundColor, }]}
      />
      <InfoItem
        title={translate('visitor_list.visitor_name')}
        value={item && item.full_name}
        valueStyles={styles.nameText}
      />
      <InfoItem title={translate('visitor_list.id_card')} value={item && item.identity_code} />
      <InfoItem title={translate('visitor_list.leave_date')} value={item && formatTime(item.expected_leave_date)} />
      <InfoItem title={translate('visitor_list.note')} value={item && item.note} />
    </View>
  );
};

export default React.memo(MyVisitorTenantItem);
