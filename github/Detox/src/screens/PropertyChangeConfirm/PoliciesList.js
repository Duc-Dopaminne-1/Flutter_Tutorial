import isEmpty from 'lodash/isEmpty';
import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';

import {AppContext} from '../../appData/appContext/useAppContext';
import {translate} from '../../assets/localize';
import {Message} from '../../assets/localize/message/Message';
import {COLORS} from '../../assets/theme/colors';
import DocumentItem from '../../components/DocumentItem';
import UrlUtils from '../../utils/UrlUtils';

const styles = StyleSheet.create({
  container: {
    // ...METRICS.horizontalMargin,
  },
  documentItem: {
    paddingHorizontal: 8,
    backgroundColor: COLORS.NEUTRAL_BACKGROUND,
    borderRadius: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.NEUTRAL_BORDER,
  },
});

const Policies = ({policies = []}) => {
  const {showErrorAlert} = useContext(AppContext);

  const onPress = url => {
    UrlUtils.openUrl(url, () => {
      showErrorAlert(translate(Message.NTW_UNKNOWN_ERROR));
    });
  };

  return policies.map((it, index) => (
    <DocumentItem
      containerStyle={styles.documentItem}
      key={index.toString()}
      name={it.policyName}
      onPress={() => onPress(it.attachment)}
    />
  ));
};

const PoliciesList = ({style, policies = []}) => {
  const validatedPolicies = policies?.filter(value => UrlUtils.getValidUrl(value?.attachment));

  if (isEmpty(validatedPolicies)) {
    return <View />;
  }

  return (
    <View style={[styles.container, style]}>
      <Policies policies={validatedPolicies} />
    </View>
  );
};

export default PoliciesList;
