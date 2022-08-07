import * as actions from './actions';
import { IListDispatch, IListItemState, IListOwnProps } from './interface';
import ListComponent, { IListProps } from '@src/components/List/List';
import React, { Component } from 'react';
import createListSelector, { getDenormalizedListState } from './selector';
import connectHelper from '@src/utils/connect';

type Props = IListProps & IListDispatch & IListItemState & IListOwnProps;
export class List extends Component<Props, {}> {
  componentDidMount() {
    if (!this.props.inited) {
      this.props.init({
        listName: this.props.listName,
        onLoad: this.props.onLoad,
        limit: this.props.limit,
      });
    }
  }

  componentDidUpdate(oldProps: Props) {
    if (this.props.inited && !oldProps.inited) {
      this.onLoad();
    }
  }

  onClear = () => this.props.clear({ listName: this.props.listName });

  onLoad = () => this.onLoadData();

  onRefresh = () => this.onLoadData(true);

  onAddItem = (id: string) => this.props.addItem({ id, listName: this.props.listName });

  onRemoveItem = (id: string) => this.props.removeItem({ id, listName: this.props.listName });

  onRemoveItemAllList = (id: string) => this.props.removeItem({ id, listName: '*' });

  goToTop = () => this.list.current && this.list.current.goToTop();
  /*
   * ComponentWillUnmount() {
   *   // This.props.clear({ listName: this.props.listName });
   * }
   */

  onLoadData = (isRefresh = false) => {
    if (this.props.loading || this.props.refreshing) return;
    if (!this.props.canLoadMore && !isRefresh) return;
    this.props.load({
      isRefresh,
      listName: this.props.listName,
      query: this.props.query,
    });
  };

  list = React.createRef<ListComponent>();

  render() {
    if (this.props.render) {
      return this.props.render({
        ...this.props,
        onLoad: this.onLoad,
        onRefresh: this.onRefresh,
        onEndReached: this.props.limit === 0 ? undefined : this.onLoad,
      });
    }
    return (
      <ListComponent
        {...this.props.listProps}
        {...this.props}
        onLoad={this.onLoad}
        onRefresh={this.onRefresh}
        onEndReached={this.props.limit === 0 ? undefined : this.onLoad}
        ref={this.list}
        onScrollBeginDrag={() => {
          this.props.onScrollBeginDrag && this.props.onScrollBeginDrag();
        }}
      />
    );
  }
}

export type IConnectListProps = IListOwnProps;
export default connectHelper<IConnectListProps>({
  state: (state, ownProps) => {
    if (ownProps.render) {
      return {
        ...getDenormalizedListState(ownProps.listName, ownProps.schema!)(state),
        ...ownProps,
      };
    }
    return {
      ...createListSelector(ownProps.listName)(state),
      ...ownProps,
    };
  },
  actions,
})(List);
