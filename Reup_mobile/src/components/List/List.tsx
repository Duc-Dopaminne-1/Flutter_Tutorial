import { ActivityIndicator, FlatList, FlatListProps, Text, TouchableOpacity, View } from 'react-native';
import { IListDispatch, IListItemState, IListOwnProps, IOnLoad } from '@src/modules/list/interface';
import React, { ReactElement } from 'react';
import Pure from '@utils/Pure';
import { styles } from './styles';
import translate from '@src/localize';

export interface IListProps extends Partial<FlatListProps<string>> {
  error: Error;
  loading: boolean;
  refreshing: boolean;
  canLoadMore: boolean;
  noItemText: string;
  data: string[];
  renderLoadmore: boolean;
  loadMoreText: string;
  renderScrollToTop: boolean;
  renderItem: ({ item }: { item: string }) => ReactElement<string>;
  onLoad: () => void;
  onRefresh: () => void;
  onChangeQuery: () => void;
  goToTop: () => void;
}
type Props = IListProps;
class List extends Pure<Props, {}> {
  static defaultProps = {
    loadMoretext: translate('list.load_more'),
    refresh: () => {
      return true;
    },
    watches: [
      'props.data',
      'props.error',
      'props.canLoadMore',
      'props.data',
      'props.loading',
      'props.refreshing',
      'props.extraData',
      'props.refreshing',
    ],
  };

  flatList = React.createRef<FlatList<string>>();

  goToTop = () => {
    if (this.flatList.current) {
      this.flatList.current.scrollToOffset({
        animated: true,
        offset: 0,
      });
    }
  };

  renderListFooter = () => {
    if (this.props.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      );
    }
    if (this.props.refreshing) return null;
    if (this.props.renderLoadmore)
      return (
        <View style={styles.loadMoreWrap}>
          <TouchableOpacity onPress={this.props.onLoad}>
            <Text style={styles.actionText}>{this.props.loadMoreText}</Text>
          </TouchableOpacity>
          {this.props.renderScrollToTop && (
            <TouchableOpacity onPress={this.props.goToTop || this.goToTop}>
              <Text style={styles.actionText}>{translate('list.scroll_to_top')}</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    return null;
  };

  render() {
    return (
      <FlatList
        {...this.props}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={!this.props.loading ? this.props.ListEmptyComponent : undefined}
        style={[styles.container, this.props.style]}
        ref={this.flatList}
        data={this.props.data}
        renderItem={this.props.renderItem}
        ListFooterComponent={this.renderListFooter}
        keyExtractor={(item: string, index: number) => {
          if (this.props.keyExtractor) return this.props.keyExtractor(item, index);
          return item;
        }}
        onEndReached={this.props.renderLoadmore ? undefined : this.props.onEndReached}
        onEndReachedThreshold={0.1}
      />
    );
  }
}

export default List;
