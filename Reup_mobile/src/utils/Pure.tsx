import { get, isEqual } from 'lodash';
import { Component } from 'react';

class Pure<Props, State> extends Component<Props & { watches: string[] }, State> {
  public shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    if (!this.props.watches || this.props.watches.length === 0) return false;
    const isChanged: boolean = this.props.watches.some((path: string) => {
      const next = {
        ...nextProps,
        ...nextState,
      };
      return !isEqual(get(this, path), get(next, path));
    });
    return isChanged;
  }
}

export default Pure;
