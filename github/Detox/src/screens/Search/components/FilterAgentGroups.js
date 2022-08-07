import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';

import {ALL_SELECT} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS} from '../../../assets/theme/metric';
import DropdownWithTitle from '../../../components/DropdownWithTitle';

const checkItemsHavingAll = items => {
  if (!Array.isArray(items) && items.length === 0) {
    return false;
  }
  for (let index = 0; index < items.length; index++) {
    if (items[index].id === ALL_SELECT.id) {
      return true;
    }
  }
  return false;
};

const styles = StyleSheet.create({
  titleSection: {
    fontSize: 15,
    color: COLORS.TEXT_DARK_10,
    ...FONTS.bold,
  },
});

const FilterAgentGroups = ({
  agentGroups,
  onSelectAgentGroup,
  onRemoveItemAgentGroup,
  isHavingAll,
}) => {
  const [groups, setGroups] = useState([]);

  const setData = ({checkedAll = false}) => {
    let listItems = agentGroups.map(group => ({...group, checked: false}));
    if (isHavingAll) {
      listItems = [{...ALL_SELECT, checked: checkedAll}, ...listItems];
    }
    setGroups(listItems);
  };

  useEffect(() => {
    if (agentGroups) {
      setData({checkedAll: false});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentGroups]);

  const onSelect = items => {
    const isCheckedAll = checkItemsHavingAll(items);
    if (isHavingAll && isCheckedAll) {
      setData({checkedAll: true});
      onSelectAgentGroup([{...ALL_SELECT}]);
    } else {
      onSelectAgentGroup(items);
    }
  };

  const onRemove = ids => {
    onRemoveItemAgentGroup(ids);
  };

  return (
    <DropdownWithTitle
      title={translate(STRINGS.AGENT_GROUP)}
      popupTitle={translate(STRINGS.AGENT_GROUP)}
      dropdownTitle={translate(STRINGS.ALL)}
      headerStyles={styles.titleSection}
      items={groups}
      style={METRICS.marginTop}
      onChosen={onSelect}
      isSelectSingle={false}
      onRemoveItem={onRemove}
      isRequiredAtLeastOne={false}
      isHaveAll={isHavingAll}
    />
  );
};

export default FilterAgentGroups;
