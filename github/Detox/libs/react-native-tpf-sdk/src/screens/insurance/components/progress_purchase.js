import { SubHead } from '../../../components/';
import AppText from '../../../components/app_text';
import { FONT_SIZE } from '../../../constants/appFonts';
import { CUSTOM_COLOR } from '../../../constants/colors';
import { DEVICE_WIDTH, SPACING } from '../../../constants/size';
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { scale } from '../../../utils/responsive';
import themeContext from '../../../constants/theme/themeContext';

const ProgressPurchase = ({ stepList = [''], currentStepIndex = 0, style }) => {
  const theme = useContext(themeContext);

  return (
    <View style={[styles.container, style]}>
      <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
        {stepList.map((item, index) => (
          <View key={index} style={styles.nodeContainer}>
            <View
              value={index + 1}
              disabled={index > currentStepIndex}
              style={[
                styles.dot,
                { marginHorizontal: DEVICE_WIDTH / stepList.length / 3 },
                currentStepIndex >= index && [
                  styles.activeDot,
                  { borderColor: theme.app.primaryColor1 }
                ]
              ]}>
              <SubHead
                bold
                color={currentStepIndex >= index ? theme.app.primaryColor1 : CUSTOM_COLOR.grayBoder}
                style={styles.index}>
                {index + 1}
              </SubHead>
            </View>
            <AppText
              translate
              bold={true}
              style={[
                styles.name,
                {
                  maxWidth: (DEVICE_WIDTH / stepList.length / 3) * 2 + scale(24)
                },
                currentStepIndex >= index && [styles.activeText, { color: theme.app.primaryColor1 }]
              ]}>
              {item}
            </AppText>
          </View>
        ))}
      </View>
      <View style={[styles.line, { marginHorizontal: DEVICE_WIDTH / stepList.length / 3 }]} />
      {/*<LinearGradient
        style={[
          styles.line,
          {
            marginLeft: DEVICE_WIDTH / stepList.length / 3,
            width: (DEVICE_WIDTH / stepList.length / 3 + scale(12)) * 2 * currentStepIndex,
            left: scale(12),
            right: 0
          }
        ]}
        colors={[CUSTOM_COLOR.SeaBuckthorn, CUSTOM_COLOR.SeaBuckthorn]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <Text style={[styles.text, { opacity: 0 }]} />
      </LinearGradient>*/}
    </View>
  );
};

export default React.memo(ProgressPurchase);

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center'
  },
  dot: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    marginHorizontal: scale(40),
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: scale(2),
    borderColor: CUSTOM_COLOR.grayBoder
  },
  activeDot: {
    backgroundColor: CUSTOM_COLOR.White,
    borderWidth: scale(2)
  },
  line: {
    height: scale(3),
    backgroundColor: CUSTOM_COLOR.Alto,
    zIndex: -2,
    position: 'absolute',
    top: scale(10.5),
    left: SPACING.Small,
    right: SPACING.Small
  },
  nodeContainer: {},
  name: {
    alignSelf: 'center',
    marginTop: SPACING.Normal,
    textAlign: 'center',
    fontSize: FONT_SIZE.SubHead
  },
  activeText: {},
  index: {
    textAlignVertical: 'center',
    paddingTop: scale(1)
  }
});
