import PropTypes from 'prop-types';
import React, {Fragment, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import RequiredLabel from '../RequiredLabel';
import CustomCheckbox from './CustomCheckbox';

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  interestedButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  columnContainer: {
    flexDirection: 'column',
  },
});

const mappingItems = (data, selectedItems) => {
  if (!data) {
    return [];
  }
  return data.map(item => {
    let checked = false;
    selectedItems?.forEach(element => {
      if (item.id === element.id) {
        checked = true;
      }
    });
    return {
      ...item,
      checked,
    };
  });
};

const CheckboxList = ({
  selectedItems,
  items,
  onSelect,
  titleStyle,
  title,
  listStyle,
  itemStyle,
  isIconLeft = true,
  isHorizontal = true,
  itemDescriptionStyle,
  getInternalListStateOnSelectFunc = () => {},
  shouldUseParentsListState = true,
  additionalMappingFunc = () => {},
  separatorComponent,
  childComponent,
  customCheckedBox,
  images,
  iconCheckedColor,
  iconColor,
  containerStyle,
}) => {
  const [state, setState] = useState({
    items: mappingItems(items, selectedItems),
  });

  const getDataList = () => {
    const mappedItems = mappingItems(items, selectedItems);
    return shouldUseParentsListState ? mappedItems : state.items || items;
  };

  const dataList = useMemo(getDataList, [
    items,
    state.items,
    selectedItems,
    shouldUseParentsListState,
  ]);

  const onSelectItem = (value, item) => {
    let nextSelectedItems = dataList?.filter(e => e.checked);
    if (value) {
      nextSelectedItems.push(item);
    } else {
      nextSelectedItems = nextSelectedItems.filter(e => e.id !== item.id);
    }
    let mappedItems = mappingItems(dataList, nextSelectedItems);
    if (additionalMappingFunc) {
      mappedItems = additionalMappingFunc(item, value, mappedItems);
    }
    onSelect(item, value);
    getInternalListStateOnSelectFunc(mappedItems);
    setState({items: mappedItems});
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {!!title && <RequiredLabel titleStyle={titleStyle} title={title} isRequired={false} />}
      <View
        style={[
          styles.interestedButtonContainer,
          isHorizontal || styles.columnContainer,
          listStyle,
        ]}>
        {dataList?.map((item, index) => (
          <Fragment key={index}>
            {index !== 0 && separatorComponent && separatorComponent(item, index)}
            <CustomCheckbox
              images={images}
              iconCheckedColor={iconCheckedColor}
              iconColor={iconColor}
              customCheckedBox={customCheckedBox}
              shouldGetValueOutSide
              disabled={item.disabled}
              key={item.id}
              parentCheckedValue={item.checked}
              checkValue={value => onSelectItem(value, item)}
              title={item.description}
              style={itemStyle}
              isIconLeft={isIconLeft}
              textStyle={itemDescriptionStyle}
            />
            {childComponent && childComponent(item, index)}
          </Fragment>
        ))}
      </View>
    </View>
  );
};

CheckboxList.propTypes = {
  selectedItems: PropTypes.array,
  items: PropTypes.array,
  onSelect: PropTypes.func,
  title: PropTypes.string,
};

CheckboxList.defaultProps = {
  selectedItems: [],
  items: [],
  title: '',
  onSelect: () => {},
};

export default CheckboxList;
