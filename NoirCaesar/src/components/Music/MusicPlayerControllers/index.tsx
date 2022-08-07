import { View, Image } from 'react-native';
import styles from './styles';
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { SHUFFLE, PREVIOUS, PLAY, PAUSE, NEXT, REPEAT } from '@src/constants/icons';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@src/types/types';
import { updateRepeatState, updateShuffleState } from '@src/modules/tv/actions';

interface Props {
  musicLength: number;
  containerStyle?: object;
  primaryControlStyle?: object;
  secondaryControlStyle?: object;
  onPressPlay: () => void;
  onPressPause: () => void;
  onPressNext: () => void;
  onPressPrevious: () => void;
}

let flagRepeat = false;
let flagShuffle = false;

const MediaControllers = forwardRef((props: Props, ref) => {
  const { musicLength, containerStyle, onPressPlay, onPressPause, onPressNext, onPressPrevious } = props;

  const dispatch = useDispatch();
  const [pause, setPause] = useState(false);
  const isRepeat = useSelector<RootState, boolean>((state: RootState) => state.tv.isRepeat);
  const isShuffle = useSelector<RootState, boolean>((state: RootState) => state.tv.isShuffle);

  useImperativeHandle(ref, () => ({
    onPlay() {
      setPause(false);
    },

    onPause() {
      setPause(true);
    },

    isRepeat() {
      return flagRepeat;
    },

    isShuffle() {
      return flagShuffle;
    },
  }));

  const onPressRepeat = () => {
    dispatch(updateRepeatState({ state: !isRepeat }));
    flagRepeat = !isRepeat;
    if (isShuffle) {
      dispatch(updateShuffleState({ state: false }));
      flagShuffle = false;
    }
  };

  const onPressShuffle = () => {
    dispatch(updateShuffleState({ state: !isShuffle }));
    flagShuffle = !isShuffle;
    if (isRepeat) {
      dispatch(updateRepeatState({ state: false }));
      flagRepeat = false;
    }
  };

  const renderPlayPause = () => {
    return (
      <CustomTouchable onPress={pause ? onPressPlay : onPressPause}>
        <Image style={styles.firstControl} source={pause ? PLAY : PAUSE} />
      </CustomTouchable>
    );
  };

  const renderNext = () => {
    if (musicLength > 1) {
      return (
        <CustomTouchable style={styles.touchView} onPress={onPressNext}>
          <Image style={styles.secondControl} source={NEXT} />
        </CustomTouchable>
      );
    } else {
      return (
        <View style={styles.touchView}>
          <Image style={[styles.secondControl, styles.disable]} source={NEXT} />
        </View>
      );
    }
  };

  const renderPrevious = () => {
    if (musicLength > 1) {
      return (
        <CustomTouchable style={styles.touchView} onPress={onPressPrevious}>
          <Image style={styles.secondControl} source={PREVIOUS} />
        </CustomTouchable>
      );
    } else {
      return (
        <View style={styles.touchView}>
          <Image style={[styles.secondControl, styles.disable]} source={PREVIOUS} />
        </View>
      );
    }
  };

  const renderRepeat = () => {
    return (
      <CustomTouchable style={styles.touchView} onPress={onPressRepeat}>
        <Image style={[styles.thirdControls, isRepeat ? [] : styles.disable]} source={REPEAT} />
      </CustomTouchable>
    );
  };

  const renderShuffle = () => {
    if (musicLength > 1) {
      return (
        <CustomTouchable style={styles.touchView} onPress={onPressShuffle}>
          <Image style={[styles.thirdControls, isShuffle ? [] : styles.disable]} source={SHUFFLE} />
        </CustomTouchable>
      );
    } else {
      return (
        <View style={styles.touchView}>
          <Image style={[styles.thirdControls, styles.disable]} source={SHUFFLE} />
        </View>
      );
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {renderRepeat()}
      {renderPrevious()}
      {renderPlayPause()}
      {renderNext()}
      {renderShuffle()}
    </View>
  );
});

export { MediaControllers };
