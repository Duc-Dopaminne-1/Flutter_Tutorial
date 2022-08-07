import React from 'react';
import {StyleSheet} from 'react-native';
import {Host} from 'react-native-portalize';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import BaseScreen from '../../../components/BaseScreen';
import BasicAgentProfileComponent from './BasicAgentProfileComponent';

const UpdateAgentScreen = props => {
  return (
    <Host>
      <BaseScreen
        title={translate(STRINGS.AGENT_INFO)}
        containerStyle={styles.container}
        showHeaderShadow>
        <BasicAgentProfileComponent {...props} />
      </BaseScreen>
    </Host>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: COLORS.NEUTRAL_WHITE},
});

export default UpdateAgentScreen;
