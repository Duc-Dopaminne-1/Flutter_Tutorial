import React from 'react';
import styles from './styles';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import AppText from '../../../../components/app_text';

const TABS = [
  {
    id: 1,
    name: 'additional_service_profiles.wait_for_pay'
  },
  {
    id: 2,
    name: 'additional_service_profiles.processing'
  },
  {
    id: 3,
    name: 'additional_service_profiles.completed'
  },
  {
    id: 4,
    name: 'additional_service_profiles.cancel'
  }
];

const TabItem = ({ name, active, index, changeTabs }) => {
  const onPress = () => {
    if (active) {
      return;
    }

    changeTabs(index);
  };
  return (
    <TouchableOpacity onPress={onPress} style={styles.tabItem}>
      <AppText translate bold={true} style={[styles.tabText, active && styles.tabTextActive]}>
        {name}
      </AppText>
      {active ? <View style={[styles.lineActive]} /> : null}
    </TouchableOpacity>
  );
};

const TabViews = ({ currentIndex, changeTabs }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabViewsWrapper}>
      {TABS.map((tab, index) => {
        const active = currentIndex === index;

        return (
          <TabItem
            key={index}
            index={index}
            name={tab.name}
            active={active}
            changeTabs={changeTabs}
          />
        );
      })}
    </ScrollView>
  );
};

TabViews.propTypes = {
  currentIndex: PropTypes.number
};

TabViews.defaultProps = {
  currentIndex: 0
};

export default TabViews;
