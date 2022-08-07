import PropTypes from 'prop-types';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, ViewPropTypes} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

import {parseGraphqlError} from '../../../../api/graphql/parseGraphqlError';
import {AppContext} from '../../../../appData/appContext/useAppContext';
import {FETCH_POLICY} from '../../../../assets/constants';
import {COLORS} from '../../../../assets/theme/colors';
import {METRICS} from '../../../../assets/theme/metric';

const styles = StyleSheet.create({
  indicator: {
    marginBottom: 54,
  },
});

const useGetItemMap = (queryGraphql, fieldData) => {
  const {showErrorAlert} = useContext(AppContext);
  const [getData, {loading, data, error}] = queryGraphql({...FETCH_POLICY.CACHE_AND_NETWORK});
  const [item, setItem] = useState({});

  useEffect(() => {
    if (error) {
      const errorMessage = parseGraphqlError(error);
      showErrorAlert(errorMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    setItem(data);
  }, [data]);

  const updateItem = updatedItem => {
    const tempItem = JSON.parse(JSON.stringify(item));
    if (tempItem[fieldData]) {
      tempItem[fieldData].isFollowed = updatedItem.isFollowed;
      setItem(tempItem);
    }
  };

  const actions = {updateItem};
  return [getData, loading, item, actions];
};

const PopupSearchItem = ({queryGraphql, fieldData, variables, renderItem, style}) => {
  const [getData, loading, data, updateItemAction] = useGetItemMap(queryGraphql, fieldData);
  useEffect(() => {
    getData({variables});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variables.propertyPostId, variables.projectId, variables.agentId]);

  if (loading && !data) {
    return (
      <ActivityIndicator
        style={[styles.indicator, style]}
        animating={loading}
        color={COLORS.PRIMARY_A100}
      />
    );
  }

  if (data && data[fieldData]) {
    return (
      <View style={[style, {...METRICS.marginBottom}]}>
        {renderItem(data[fieldData], updateItemAction)}
      </View>
    );
  }

  return <View />;
};

PopupSearchItem.propTypes = {
  queryGraphql: PropTypes.func.isRequired,
  fieldData: PropTypes.string.isRequired,
  variables: PropTypes.object.isRequired,
  style: ViewPropTypes.style,
};

export default PopupSearchItem;
