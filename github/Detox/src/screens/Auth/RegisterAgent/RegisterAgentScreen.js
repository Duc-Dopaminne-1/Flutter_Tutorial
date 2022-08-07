import React from 'react';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Host} from 'react-native-portalize';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import BaseScreen from '../../../components/BaseScreen';
import BasicAgentProfileComponent from '../../Profile/CreateEditProfile/BasicAgentProfileComponent';
import ScreenIds from '../../ScreenIds';
import HeaderContainer from './components/HeaderContainer';

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});

const RegisterAgentScreen = props => {
  return (
    <Host>
      <BaseScreen
        testID={ScreenIds.RegisterAgent}
        title={translate(STRINGS.CREATE_AGENT_INFO_HEADER)}>
        <KeyboardAwareScrollView>
          <View style={styles.body}>
            <HeaderContainer
              sectionDescription={translate(STRINGS.CREATE_AGENT_INFO_DESCRIPTION)}
            />
            <BasicAgentProfileComponent {...props} />
          </View>
        </KeyboardAwareScrollView>
      </BaseScreen>
    </Host>
  );
};

export default RegisterAgentScreen;
