import React, { useContext } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import themeContext from '../../../constants/theme/themeContext';
import { ICTabBottoms } from '../../../assets/icons';
import AppText from '../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { TEXT_COLOR } from '../../../constants/colors';
import SCREENS_NAME from '../../../constants/screens';
import { BOTTOM_TAB_HEIGHT, SPACING } from '../../../constants/size';
import { scale } from '../../../utils/responsive';

export const tabHeight = BOTTOM_TAB_HEIGHT;

const { width } = Dimensions.get('window');

const StaticTabBar = props => {
  const { value, state, descriptors, navigation } = props;

  const tabWidth = width / state?.routes?.length;
  const theme = useContext(themeContext);
  // const values = useMemo(
  //   () => state.routes.map((tab, index) => new Animated.Value(index === 0 ? 1 : 0)),
  //   [state.routes]
  // );

  return (
    <View style={styles.container}>
      {state?.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const icon = options.tabBarIcon;
        const label = options.tabBarLabel;

        const key = options.key;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key
          });
        };
        // const activeValue = values[index];

        // const opacity = value.interpolate({
        //   inputRange: [
        //     -width + tabWidth * (index - 1),
        //     -width + tabWidth * index,
        //     -width + tabWidth * (index + 1)
        //   ],
        //   outputRange: [1, 0, 1],
        //   extrapolate: 'clamp'
        // });
        // const translateY = activeValue.interpolate({
        //   inputRange: [0, 1],
        //   outputRange: [tabHeight, 0]
        // });

        if (route.name === SCREENS_NAME.LEAD_STACK_SCREEN) {
          return (
            <TouchableOpacity
              style={[
                styles.leadWrapper,
                {
                  left: index * tabWidth,
                  width: tabWidth
                }
              ]}
              onPress={onPress}
              key={key}>
              <View style={styles.leadBtn}>
                <ICTabBottoms width={scale(60)} height={scale(60)} />
              </View>
              <AppText
                translate
                style={{
                  ...styles.tabTitle,
                  color: isFocused ? theme?.text?.primary : TEXT_COLOR.PrimaryDisable
                }}>
                {label}
              </AppText>
            </TouchableOpacity>
          );
        }

        return (
          <React.Fragment key={key}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[
                styles.tab,
                {
                  left: index * tabWidth,
                  width: tabWidth
                }
              ]}
              activeOpacity={1}>
              <View style={styles.rowContainer}>{isFocused ? icon.active : icon.inactive}</View>
              <View style={styles.rowContainer}>
                <AppText
                  translate
                  style={{
                    ...styles.tabTitle,
                    color: isFocused ? theme?.text?.primary : TEXT_COLOR.PrimaryDisable
                  }}>
                  {label}
                </AppText>
              </View>
            </TouchableOpacity>
          </React.Fragment>
        );
      })}
    </View>
  );
};

export default React.memo(StaticTabBar);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tab: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: tabHeight,
    position: 'absolute',
    paddingBottom: SPACING.Small
  },
  activeIcon: {
    position: 'absolute',
    zIndex: -1
  },
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  leadWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingBottom: SPACING.Small
  },
  leadBtn: {
    zIndex: 8,
    bottom: SPACING.XNormal,
    alignSelf: 'center',
    borderRadius: scale(30)
  },

  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 3
  },
  tabTitle: {
    textAlign: 'center',
    fontSize: FONT_SIZE.Small,
    lineHeight: LINE_HEIGHT.Small
  },
  ios: {
    height: BOTTOM_TAB_HEIGHT + scale(25)
  },
  android: {
    height: BOTTOM_TAB_HEIGHT + scale(25)
  }
});
