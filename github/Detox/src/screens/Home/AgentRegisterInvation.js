import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS} from '../../assets/theme/metric';
import LinkTextButton from '../../components/LinkTextButton';
import styles from './styles';

const AgentRegisterInvation = ({percent, onPress, containerStyle = {}}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.invitationContainer, containerStyle]}>
      <Image source={IMAGES.IC_CASH_IN_HAND} />
      <View style={[HELPERS.fill, METRICS.horizontalMargin]}>
        <Text>
          <Text style={styles.textInvitation}>
            {translate(STRINGS.INVITATION_DESCRIPTION_FIRST)}
          </Text>
          <Text style={styles.textInvitationPercent}>{` ${percent} `}</Text>
          <Text style={styles.textInvitation}>
            {translate(STRINGS.INVITATION_DESCRIPTION_SECOND)}
          </Text>
        </Text>
        <LinkTextButton
          onPress={onPress}
          title={translate(STRINGS.JOIN_NOW)}
          textStyle={styles.invitaionButton}
        />
      </View>
    </TouchableOpacity>
  );
};

export default AgentRegisterInvation;
