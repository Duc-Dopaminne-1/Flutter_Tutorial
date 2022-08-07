import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/vars';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

interface Prop {
  content?: number[];
  distanceUnit?: string;
  onValuesChangeFinishCallback?: (value: number[]) => void;
  onValuesChangeCallback?: (data: number[]) => void;
}

export function SettingItemSliderMulti(props: Prop): ReactElement {
  const { content = [], onValuesChangeFinishCallback, onValuesChangeCallback } = props;
  const [slider, setSlider] = useState([0, 0]);
  const MinSlider = 18;
  const MaxSlider = 100;
  const [widthSlider, setWidthSlider] = useState(0);

  useEffect(() => {
    setSlider(content);
  }, [content]);

  const customMarker = () => {
    return <View style={styles.line} />;
  };
  const onValuesChangeFinish = (data: number[]) => {
    setSlider(data);
    onValuesChangeFinishCallback && onValuesChangeFinishCallback(data);
  };

  const onValuesChange = (data: number[]) => {
    onValuesChangeCallback && onValuesChangeCallback(data);
  };

  const onLayout = event => {
    const { width } = event.nativeEvent.layout;
    setWidthSlider(width);
  };

  const title = `${slider[0]} - ${slider[1]}`;
  return (
    <View onLayout={onLayout}>
      {content ? <Text style={styles.textTypeCard}>{title}</Text> : null}

      <MultiSlider
        values={slider}
        min={MinSlider}
        max={MaxSlider}
        sliderLength={widthSlider}
        customMarker={customMarker}
        markerStyle={styles.line}
        containerStyle={styles.container}
        selectedStyle={styles.inLine}
        trackStyle={styles.trackLine}
        onValuesChangeFinish={onValuesChangeFinish}
        onValuesChange={onValuesChange}
        isMarkersSeparated
        allowOverlap={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: null,
    paddingTop: 15,
    paddingBottom: 5,
  },
  trackLine: {
    height: 5,
    backgroundColor: colors.gray_200,
  },
  inLine: {
    backgroundColor: colors.blue_700,
    height: 5,
  },
  line: {
    marginTop: 3,
    backgroundColor: colors.white,
    width: 24,
    height: 24,
    borderRadius: 12,

    elevation: 5,
    shadowColor: colors.gray_product,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  textTypeCard: {
    fontSize: fonts.size.s14,
    color: colors.gray_600,
    fontFamily: fonts.family.PoppinsRegular,
    marginTop: 2,
  },
});
