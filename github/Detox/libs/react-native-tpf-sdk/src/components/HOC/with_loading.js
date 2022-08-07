import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import AppLoading from '../app_loading';
import { getLoadingSelector } from '../../redux/selectors/loading';

function WithLoading(WrappedComponent, actionTypes) {
  function HOC({ isLoading, ...props }) {
    return (
      <View style={{ flex: 1 }}>
        <WrappedComponent {...props} />
        <AppLoading loading={isLoading} />
      </View>
    );
  }
  const mapStateToProps = state => ({
    isLoading: getLoadingSelector(state, actionTypes)
  });
  return connect(mapStateToProps, null)(HOC);
}
export default WithLoading;
