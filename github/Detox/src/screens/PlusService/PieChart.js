import React from 'react';
import {StyleSheet, View} from 'react-native';
import {VictoryPie} from 'victory-native';

import {medium} from '../../assets/theme/metric';

const styles = StyleSheet.create({
  container: {
    marginVertical: medium,
  },
});
export const PieChart = ({data, colorScale}) => {
  const SIZE = 190;

  return (
    <View style={styles.container}>
      <VictoryPie
        padding={0}
        data={data.map(y => ({y}))}
        colorScale={colorScale}
        // standalone={false}
        width={SIZE}
        height={SIZE}
        innerRadius={SIZE / 4}
        style={{labels: {display: 'none', padding: 0}}}
      />
    </View>
  );
};
