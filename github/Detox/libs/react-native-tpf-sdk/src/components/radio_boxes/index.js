import React, { useContext } from 'react';
import RadioBox from '../radio_box';
import { View } from 'react-native';
import { styles } from './styles';

const RadioBoxes = props => {
  const { checked, data, onChange, labelStyle, boxStyle, containerStyle, translate } = props;

  const onChangeSelect = itemValue => {
    typeof onChange === 'function' ? onChange(itemValue) : null;
  };
  return (
    <View style={{ ...styles.containerStyle, ...containerStyle }}>
      {data?.length > 0
        ? data.map(item => (
            <RadioBox
              translate={translate}
              style={boxStyle}
              checked={checked}
              value={item.value}
              label={item.title}
              key={'' + item.value}
              labelStyle={labelStyle}
              onChange={value => onChangeSelect(value)}
              disable={item?.disabled}
            />
          ))
        : null}
    </View>
  );
};

export default RadioBoxes;
