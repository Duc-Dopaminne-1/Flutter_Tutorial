import React, { useEffect } from 'react';
import { View, Text, ViewStyle } from 'react-native';
//@ts-ignore
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import { TabView } from '../TabView';

interface CustomTabbarProps {
  titles: string[];
  views: any[];
  initPage?: number;
  styleContainer?: ViewStyle | ViewStyle[];
  styleContentContainer?: ViewStyle | ViewStyle[];
  page?: any
  onChangePage?: (index: number) => void
}

const CustomTabbar = (props: CustomTabbarProps) => {
  let page: any = null

  useEffect(() => {
    if (props?.page) {
      page && page(props.page - 1)
    }
  }, [props.page])

  return (
    <View style={[{ flex: 1 }, props.styleContainer]}>
      <ScrollableTabView
        initialPage={props.initPage && props.initPage <= props.titles.length - 1 ? props.initPage : 0}
        renderTabBar={({ goToPage }) => {
          page = goToPage
          return (
            <TabView />
          );
        }}
        onChangeTab={(index: any) => {
          props.onChangePage && props.onChangePage(index.i)
        }}
        contentProps={{
          keyboardShouldPersistTaps: 'always',
          scrollEnabled: false,
        }}
      >
        {props.views.length > 0 &&
          props.views.map((view, index) => {
            return <View style={props.styleContentContainer} key={index} tabLabel={props.titles[index]}>{view}</View>;
          })}
      </ScrollableTabView>
    </View >
  );
};

export default React.memo(CustomTabbar);
