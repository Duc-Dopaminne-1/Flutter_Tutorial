import React, { useContext } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import { divisionArray } from '../../helpers/divisionArray';
import themeContext from '../../constants/theme/themeContext';
import { SubHead } from '..';
import { SPACING } from '../../constants/size';
import _ from 'lodash';
import Heading from '../text/heading';

const maxItemInRow = 3;

const GroupList = props => {
  const { data, onPress, horizontal } = props;
  const theme = useContext(themeContext);
  const renderService = (service, index) => {
    if (!service) {
      return null;
    }
    const smallArray = divisionArray(service?.triggers, maxItemInRow);
    const rowService = smallArray?.map(item => {
      let tmp = [...item];
      if (item.length < maxItemInRow) {
        for (let i = 0; i < maxItemInRow - item.length; i++) {
          tmp.push({});
        }
      }
      const list = tmp.map(v => {
        const triggerIcon = v?.triggerIcon ? JSON.parse(v.triggerIcon).fileUrl : null;
        return (
          <TouchableOpacity
            activeOpacity={!v?.triggerCode && 1}
            style={styles.serviceWrapper}
            key={v.triggerCode}
            onPress={() => {
              v && onPress?.(v);
            }}>
            {triggerIcon && (
              <FastImage source={{ uri: triggerIcon }} resizeMode="cover" style={styles.icon} />
            )}
            <SubHead bold={false} style={[styles.name, { color: theme.text.primary, with: '33%' }]}>
              {v.triggerName}
            </SubHead>
          </TouchableOpacity>
        );
      });
      return <View style={styles.services}>{list}</View>;
    });
    return rowService;
  };

  const renderServiceVertical = service => {
    if (!service) {
      return null;
    }

    const list = service?.triggers.map(v => {
      const triggerIcon = v?.triggerIcon ? JSON.parse(v.triggerIcon).fileUrl : null;
      return (
        <TouchableOpacity
          activeOpacity={!v?.triggerCode && 1}
          style={styles.serviceVericalWrapper}
          key={v.triggerCode}
          onPress={() => {
            v && onPress?.(v);
          }}>
          {triggerIcon && (
            <FastImage source={{ uri: triggerIcon }} resizeMode="cover" style={styles.icon} />
          )}
          <SubHead
            bold={false}
            style={[styles.name, { color: theme.text.primary, marginLeft: SPACING.Fit }]}>
            {v.triggerName}
          </SubHead>
        </TouchableOpacity>
      );
    });
    return <View style={[styles.services, { flexDirection: 'column' }]}>{list}</View>;
  };

  const listCategory = data?.map((item, index) => {
    return (
      <View style={styles.container} key={item.stageId}>
        <Heading style={styles.title}>{item.stageName}</Heading>
        {horizontal ? renderService(item, index) : renderServiceVertical(item, index)}
      </View>
    );
  });
  return <>{listCategory}</>;
};

export default React.memo(GroupList);
