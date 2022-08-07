import React, { PureComponent } from 'react';
import MapView from 'react-native-maps';
import isEqual from 'lodash.isequal';

type State = {
  tracksViewChanges: boolean;
};

export default class MapMarker extends PureComponent<any, State> {
  state = {
    tracksViewChanges: true,
  };

  componentWillReceiveProps(nextProps: any) {
    if (!isEqual(this.props, nextProps)) {
      this.setState(() => ({
        tracksViewChanges: true,
      }));
    }
  }

  componentDidUpdate() {
    if (this.state.tracksViewChanges) {
      this.setState(() => ({
        tracksViewChanges: false,
      }));
    }
  }

  render() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <MapView.Marker {...this.props}>{this.props.children}</MapView.Marker>;
  }
}
