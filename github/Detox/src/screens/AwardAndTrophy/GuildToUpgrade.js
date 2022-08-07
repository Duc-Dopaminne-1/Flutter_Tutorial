import {useNavigation} from '@react-navigation/native';
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {IconButton} from 'react-native-paper';

import {PAGE_CHILD_TYPE, PAGE_TYPE} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {normal, small} from '../../assets/theme/metric';
import ScreenIds from '../ScreenIds';

const styles = StyleSheet.create({
  guild: {
    paddingVertical: normal,
    flex: 1,
  },
  guildTitle: {
    ...FONTS.semiBold,
    fontSize: 15,
    letterSpacing: 0.5,
    color: COLORS.BLACK_33,
    marginBottom: small,
  },
  guildDescription: {
    paddingHorizontal: 10,
    backgroundColor: COLORS.GRAY_EO,
    alignSelf: 'flex-start',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guidDescriptionText: {
    ...FONTS.regular,
    fontSize: 13,
    color: COLORS.BLACK_4F,
  },
  guildDescriptionIcon: {
    margin: 0,
  },
});

const GuildToUPgrade = ({title}) => {
  const navigation = useNavigation();

  const detailAgentBenefit = () => {
    navigation.navigate(ScreenIds.PageDetailQuery, {
      query: {
        objectType: PAGE_TYPE.INTRODUCTION,
        pageType: PAGE_CHILD_TYPE.AGENT_BENEFIT,
      },
      title: translate(STRINGS.AGENT_BENEFIT),
    });
  };

  return (
    <View style={styles.guild}>
      <Text style={styles.guildTitle}>{title}</Text>
      <View style={styles.guildDescription}>
        <IconButton
          icon="information-outline"
          size={12}
          color={COLORS.BLACK_4F}
          style={styles.guildDescriptionIcon}
        />
        <TouchableOpacity onPress={() => detailAgentBenefit()}>
          <Text style={styles.guidDescriptionText}>{translate(STRINGS.DETAIL_RIGHT_OF_AGENT)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

GuildToUPgrade.propTypes = {
  title: PropTypes.string,
};

GuildToUPgrade.defaultProps = {
  title: '',
};

export default GuildToUPgrade;
