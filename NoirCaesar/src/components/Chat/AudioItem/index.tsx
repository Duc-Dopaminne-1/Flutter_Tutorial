import { View, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import styles from './styles';
import Svg, { Path } from 'react-native-svg';
import { moderateScale } from 'react-native-size-matters';
import FastImage from 'react-native-fast-image';
import { ICON_NEXT_ON } from '@src/constants/icons';
import PROGRESS_NONE from '@res/icons/audio_none_progress.png';
import PROGRESS_WHITE from '@res/icons/audio_progress.png';
import PAUSE from '@res/icons/pause.png';
import { CustomTouchable } from '@src/components/CustomTouchable';
import TrackPlayer from 'react-native-track-player';

export interface AudioItemProps {
  id: string;
  isCurrent: boolean;
  recordUri?: string;
  paused?: boolean;
  onPressPlay?: (recordUri: string, id: string) => void;
  onPressPause?: () => void;
  duration?: number;
  currentId: string;
}

const AudioItem = (props: AudioItemProps) => {
  const animatedProgressWidth = useRef<any>(0);
  const animated = useRef<any>(0);
  const { id, isCurrent = true, recordUri = '', duration = 0, paused, onPressPlay, onPressPause, currentId = '' } = props;

  useEffect(() => {
    animatedProgressWidth.current = new Animated.Value(0);
    animated.current = Animated.timing(animatedProgressWidth.current, {
      toValue: 150,
      duration: duration,
    });
    return () => {
      animatedProgressWidth.current = new Animated.Value(0);
      animated.current = null;
    };
  }, []);

  useEffect(() => {
    if (paused && currentId == id) {
      onPressPauseAudio();
    } else if (paused && currentId !== id && animatedProgressWidth.current.value != 0) {
      animatedProgressWidth.current.setValue(0);
      animated.current.stop();

      animated.current = Animated.timing(animatedProgressWidth.current, {
        toValue: 150,
        duration: duration,
      });
    }
  }, [paused, currentId, duration]);

  const onPressPlayAudio = () => {
    onPressPlay && onPressPlay(recordUri, id);
    animated.current.start();
  };

  const onPressPauseAudio = () => {
    onPressPause && onPressPause();
    TrackPlayer.stop();
    TrackPlayer.reset();
    animatedProgressWidth.current.setValue(0);
    animated.current.stop();

    animated.current = Animated.timing(animatedProgressWidth.current, {
      toValue: 150,
      duration: duration,
    });
  };

  const renderRecordLeft = () => (
    <View style={[styles.item, styles.itemIn]}>
      <View style={[styles.balloon, styles.balloonLeft]}>
        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
          <CustomTouchable onPress={paused ? onPressPlayAudio : onPressPauseAudio} style={[styles.balloon]}>
            <FastImage style={[styles.firstControl]} source={paused ? ICON_NEXT_ON : PAUSE} />
          </CustomTouchable>
          <View>
            <FastImage style={styles.mainIconRed} source={PROGRESS_NONE} resizeMode="contain" />
            <Animated.View style={[styles.mainIconAnimated, { width: animatedProgressWidth.current }]}>
              <View>
                <FastImage style={styles.mainIcon} source={PROGRESS_WHITE} resizeMode="contain" />
              </View>
            </Animated.View>
          </View>
        </View>
        <View style={[styles.arrowContainer, styles.arrowLeftContainer]}>
          <Svg
            style={styles.arrowLeft}
            width={moderateScale(15.5, 0.6)}
            height={moderateScale(17.5, 0.6)}
            viewBox="32.484 17.5 15.515 17.5"
            enable-background="new 32.485 17.5 15.515 17.5"
          >
            <Path d="M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z" fill="#676877" x="0" y="0" />
          </Svg>
        </View>
      </View>
    </View>
  );

  const renderRecordRight = () => (
    <View style={[styles.item, styles.itemOut]}>
      <View style={[styles.balloon, styles.balloonRight]}>
        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
          <CustomTouchable onPress={paused ? onPressPlayAudio : onPressPauseAudio} style={[styles.balloon]}>
            <FastImage style={[styles.firstControl]} source={paused ? ICON_NEXT_ON : PAUSE} />
          </CustomTouchable>
          <View>
            <FastImage style={styles.mainIconRed} source={PROGRESS_NONE} resizeMode="contain" />
            <Animated.View style={[styles.mainIconAnimated, { width: animatedProgressWidth.current }]}>
              <View>
                <FastImage style={styles.mainIcon} source={PROGRESS_WHITE} resizeMode="contain" />
              </View>
            </Animated.View>
          </View>
        </View>
        <View style={[styles.arrowContainer, styles.arrowRightContainer]}>
          <Svg
            style={styles.arrowRight}
            width={moderateScale(15.5, 0.6)}
            height={moderateScale(17.5, 0.6)}
            viewBox="0 0 3005 2248.37"
            enable-background="new 32.485 17.5 15.515 17.5"
          >
            <Path
              d="M2937.39,2108.08c-3.88-1.31-391.72-134.66-795.52-438.5-236.63-178-431.82-378.72-580.14-596.46-176.38-258.9-286.67-543-328.17-845L288.79,1638.61l-.07.1c163.82,187.35,352,313,498.12,391.46,247,132.61,532.78,217.37,849.46,251.93,386.66,42.21,823,9.63,1297-96.81L3072.79,2154Z"
              fill="#0F0F13"
              x="0"
              y="0"
              stroke="#0F0F13"
            />
            <Path
              d="M2937.39,2108.08c-3.88-1.31-391.72-134.66-795.52-438.5-236.63-178-431.82-378.72-580.14-596.46-176.18-258.62-286.43-542.38-328-844.07L1168,327c51.29,281.7,161.08,547.36,327.31,791.38,153.29,225,354.57,432.07,598.23,615.42,276.57,208.1,541.41,336.69,691.63,400.78-414.92,82.28-797.95,105.08-1140.19,67.73-306.39-33.44-582.34-115.15-820.19-242.85-143.94-77.28-330.45-202.36-489.76-390l-46.41,69.22c163.84,187.38,352,313,498.18,391.52,247,132.61,532.78,217.37,849.46,251.93,386.66,42.21,823,9.63,1297-96.81L3072.79,2154Z"
              fill="#676877"
              x="0"
              y="0"
              stroke="#676877"
            />
          </Svg>
        </View>
      </View>
    </View>
  );

  return <View>{isCurrent ? renderRecordRight() : renderRecordLeft()}</View>;
};

export { AudioItem };
