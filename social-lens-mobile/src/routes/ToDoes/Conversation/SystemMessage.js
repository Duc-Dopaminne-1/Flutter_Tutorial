import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import I18n from 'app/i18n'
import RewardIcon from 'app/assets/images/reward_icon.png';
import TimeIcon from 'app/assets/images/time_icon.png';
import ChatIcon from 'app/assets/images/chat_full_icon.png';
import {fonts ,colors } from "../../../constants";

class SystemMessage extends React.Component {
  render() {
    let { campaign, answer, category } = this.props;

    let bgColorStyle = { backgroundColor: category.color };
    let daysRemaining = parseInt((moment(campaign.to).unix() - moment().unix()) / 86400);
    
    let reward = 0;
    if ( answer ) {
      reward = campaign.total_points;
    }

    return (
      <View style={ styles.campaignContainer }>
        <View style={ styles.logoContainer }>
          {campaign.logo ? (
            <FastImage 
              source={{ uri: campaign.logo }} 
              style={ styles.logo } 
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <Text style={ styles.nologo }>{I18n.t('noLogo')}</Text>
          )}
        </View>
        <View style={[ styles.infoContainer, bgColorStyle ]}>
          <View style={ styles.infoItemDescription}>
            <FastImage 
              source={ChatIcon} 
              style={ styles.infoIcon } 
              resizeMode={FastImage.resizeMode.contain}
            />
            <Text 
              style={ styles.infoDescriptionText }
              numberOfLines={3}
            >
              {campaign.description}
            </Text>
          </View>
          <View style={ styles.infoItem }>
            <FastImage 
              source={RewardIcon} 
              style={ styles.infoIcon } 
              resizeMode={FastImage.resizeMode.contain}
            />
            <Text style={ styles.infoText }>
              {`$${reward} out of $${campaign.total_points} earned`}
            </Text>
          </View>
          <View style={ styles.infoItem }>
            <FastImage 
              source={TimeIcon} 
              style={ styles.infoIcon } 
              resizeMode={FastImage.resizeMode.contain}
            />
            <Text style={ styles.infoText }>
              {daysRemaining} days remaining
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  campaignContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
    borderColor: colors.light_gray,
    marginBottom: 20
  },
  logoContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    alignSelf: 'stretch',
    height: 150
  },
  nologo: {
    fontFamily: fonts.family.HNMedium,
    fontSize: 24,
    color: colors.dark
  },
  infoContainer: {
    flex: 1,
    height: 150,
    padding: 10
  },
  infoItem: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  infoIcon: {
    width: 20,
    height: 20,
    marginRight: 10
  },
  infoText: {
    flex: 1,
    fontFamily: fonts.family.HNBold,
    fontSize: 10,
    color: colors.white
  },
  infoItemDescription: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    marginBottom: 5
  },
  infoDescriptionText: {
    flex: 1,
    fontFamily: fonts.family.HNBold,
    fontSize: 10,
    color: colors.white
  }
});

SystemMessage.propTypes = {
  campaign: PropTypes.object,
  answer: PropTypes.bool,
  category: PropTypes.object
};

export default SystemMessage;