import React, { ReactElement, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { TutorialState } from '../../../redux/tutorial/reducer';
import { getStatusFirstInstall } from '../../../redux/app/selector';
import CustomAnimationUpDown from '../../CustomAnimationUpDown';
import { BID_SCREEN } from '../../../navigation/screenKeys';
import VectorDownSVG from '../../SVG/VectorDownSVG';

interface CustomBadgeBidProp {
  isFocused: boolean;
  getGradientIcon: (icon: string, isFocused: boolean) => ReactElement;
  label: string;
}

function CustomBadgeBid(props: CustomBadgeBidProp): ReactElement {
  const { isFocused, getGradientIcon, label } = props;
  const index = useSelector((state: TutorialState) => state.tutorial.index);
  const shouldRenderVector = index === 5 && getStatusFirstInstall();

  return (
    <View style={styles.container}>
      {shouldRenderVector && (
        <CustomAnimationUpDown>
          <View style={styles.iconVector}>
            <VectorDownSVG />
          </View>
        </CustomAnimationUpDown>
      )}
      {shouldRenderVector ? getGradientIcon(BID_SCREEN, true) : getGradientIcon(label, isFocused)}
    </View>
  );
}

export default memo(CustomBadgeBid);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconVector: {
    position: 'absolute',
    top: -180,
    left: -62,
    height: 200,
    width: 200,
  },
});
