import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import {colors} from "../../constants";

class TabSelector extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { container, items, selectedIndex, select } = this.props;

    return (
      <View style={[ styles.container, container ]}>
        {items.map((item, index) => (
          <TouchableOpacity 
            key={`${index}`} 
            style={[ styles.item, index === selectedIndex && styles.itemSelected ]}
            onPress={ () => select(index) }
          >
            <Text style={[ styles.itemText, index === selectedIndex && styles.itemTextSelected ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between'
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 5
  },
  itemSelected: {
    borderBottomWidth: 2,
    borderBottomColor: colors.text_grey
  },
  itemText: {
    fontSize: 14,
    color: colors.text_grey
  },
  itemTextSelected: {
    fontWeight: 'bold',
    color: colors.black
  }
});

TabSelector.propTypes = {
  container: PropTypes.object,
  items: PropTypes.array,
  selectedIndex: PropTypes.number,
  select: PropTypes.func
};

export default TabSelector;