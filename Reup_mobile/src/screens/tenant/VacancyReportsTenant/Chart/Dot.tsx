import React from 'react';
import { Circle, G,Text } from 'react-native-svg';
import { Theme } from '@components/Theme';

interface Props {
  onPressDot: (data: any) => void
  data: any
  indexDot: number
}

const Dot = (prop: Props) => {
  const { data: {x, y , dataset, index}, indexDot, onPressDot, data  } = prop;

  return (
    <G key={Math.random()}>
      {indexDot === index && (
        <Text
          key={Math.random()}
          stroke={Theme.report.vacancy.chart.lineChart}
          fontSize="9"
          x={x}
          y={y - 8}
          textAnchor="middle"
        >{dataset.data[index]}</Text>
      )}
      <Circle key={Math.random()} cx={x} cy={y} r="3" fill={Theme.report.vacancy.chart.lineChart} onPress={() => onPressDot(data) }/>
      <Circle key={Math.random()} cx={x} cy={y} r="2" fill={indexDot === index ? Theme.report.vacancy.chart.lineChart : Theme.report.vacancy.chart.lastChart} onPress={() => onPressDot(data)}/>
    </G>
  );
};

export default React.memo(Dot);
