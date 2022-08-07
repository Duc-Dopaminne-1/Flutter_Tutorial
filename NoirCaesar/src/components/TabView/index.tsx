import React from 'react';
import styles from './styles';
import { View, Animated } from 'react-native';
import { CustomText } from '../CustomText';
import { CustomTouchable } from '../CustomTouchable';

export type ATabViewProps = {
  scrollValue?: any;
  goToPage?: any;
  tabs?: any;
  activeTab?: any;
  style?: any;
};

type ATabViewState = Readonly<{}>;

export class TabView extends React.PureComponent<ATabViewProps, ATabViewState> {
  listHeight = new Map();

  static defaultProps = {};

  onPressTab = (index: number) => () => {
    this.props.goToPage(index);
  };
  onLayout = (event: any, i: number) => {
    const { height } = event.nativeEvent.layout;
    this.listHeight.set(i, height);
  };
  renderTab = () => {
    const { tabs, activeTab } = this.props;
    return tabs.map((tab: any, i: number) => {
      return (
        <View
          key={tab}
          style={{ flex: 1 }}
          onLayout={event => {
            this.onLayout(event, i);
          }}
        >
          <CustomTouchable key={tab} onPress={this.onPressTab(i)} style={[styles.tab]}>
            <CustomText numberOfLines={1} style={[styles.tabBarText, activeTab === i && styles.activeTabBarText]} text={tab} />
            <View style={[styles.borderBottom, activeTab === i && styles.activeBorderBottom]} />
          </CustomTouchable>
        </View>
      );
    });
  };

  render() {
    const { style } = this.props;

    return <Animated.View style={[styles.container, style]}>{this.renderTab()}</Animated.View>;
  }
}
