import { View } from 'react-native';
import styles from './styles';
import React from 'react';
import { ProgressComponent } from 'react-native-track-player';
import { formatTimePlayer } from '@src/utils/date';
import { CustomText } from '@src/components/CustomText';
import { THUMB } from '@src/constants/icons';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '@src/constants/vars';
//@ts-ignore
import Slider from 'react-native-slider';

export interface Props {
  style?: object;
  onSlidingComplete: (value: number) => void;
}

export default class SeekBar extends ProgressComponent<Props> {
  render() {
    const { onSlidingComplete, style } = this.props;
    const { position, duration } = this.state;
    const formatPosition = formatTimePlayer(position > duration ? duration : position);
    const formatDuration = formatTimePlayer(duration);
    return (
      <View style={[style, styles.container]}>
        <CustomText style={styles.time} text={`${formatPosition}`} />
        <View style={styles.sliderContainer}>
          <LinearGradient
            start={{ x: 1.0, y: 0.5 }}
            end={{ x: 0.0, y: 0.5 }}
            style={styles.gradient}
            colors={[colors.SLIDER_LIGHT, colors.SLIDER_DARK]}
          ></LinearGradient>
          <Slider
            style={styles.slider}
            maximumValue={this.state.duration}
            minimumTrackTintColor="red"
            maximumTrackTintColor="transparent"
            thumbImage={THUMB}
            thumbStyle={styles.thumb}
            trackStyle={styles.track}
            onSlidingComplete={onSlidingComplete}
            value={this.state.position}
          />
        </View>
        <CustomText style={styles.time} text={`${formatDuration}`} />
      </View>
    );
  }
}
