import React, { Component } from 'react';
import {
  View, Text, ScrollView, TouchableWithoutFeedback,
  RefreshControl
} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import I18n from 'app/i18n'
import { AppContext, ProfileHeader, Button } from 'app/components';
import { CampaignController, AnswerController } from 'app/controllers';
import { QuestionType } from 'app/constants';
import { alert, success } from 'app/utils/Alert';

import styles from './style';

import PlaceholderImage from 'app/assets/images/placeholder.png';
import EarnedIcon from 'app/assets/images/earned_icon.png';
import PaidIcon from 'app/assets/images/paid_icon.png';
import {typeError} from "../../constants/error";

class RewardScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      total: 0,
      refreshing: false,
      data: [],
      show: false
    };
  }

  async componentDidMount() {
    this.props.navigation.addListener('willFocus', async (route) => {
      await this.reload();
    });
  }

  reload = async () => {
    try {
      this.setState({ refreshing: true });
      let campaigns = await CampaignController.getCampaigns();
      let tasks = campaigns.map(campaign => {
        return AnswerController.getAnswerByUserCampaign(campaign.id);
      });
      let answers = await Promise.all(tasks);

      let data = [];
      campaigns.map((campaign, index) => {
        let answer = answers[index];
        let isCompleted = true;
        if (!answer) {
          isCompleted = false;
        } else {
          for (let index = 0; index < campaign.questions.length; index++) {
            let question = campaign.questions[index];
            if (question.type === QuestionType.INSTRUCTION_QUESTION && !answer.answers[index]) {
              isCompleted = false;
            } else if (
              question.type === QuestionType.OPEN_TEXT_QUESTION && !answer.answers[index]) {
              isCompleted = false;
            } else if (
              question.type === QuestionType.ONE_CHOICE_QUESTION &&
              answer.answers[index] === -1
            ) {
              isCompleted = false;
            } else if (
              question.type === QuestionType.MULTIPLE_CHOICE_QUESTION &&
              answer.answers[index].length === 0
            ) {
              isCompleted = false;
            } else if (
              question.type === QuestionType.RANKING_CHOICE_QUESTION &&
              answer.answers[index].length !== question.answers.length) {
              isCompleted = false;
            }
          }
        }
        if (isCompleted) {
          data.push({
            ...campaign,
            completed: answer.completed
          });
        }
      });
      let total = 0;
      data.map(item => {
        total += item.total_points;
      });
      this.setState({
        total,
        data,
        refreshing: false,
        show: data.length > 0
      });
    } catch (error) {
      this.setState({ refreshing: false });
      if (error.code === typeError.networkError) {
        alert(I18n.t('networkError'));
      } else {
        alert(error.message);
      }
    }
  };

  handleHeaderPress = () => {
    this.setState({
      show: !this.state.show
    });
  };

  handleRedeem = async () => {
    let { user, showLoading, hideLoading } = this.context;
    try {
      showLoading();
      // eslint-disable-next-line max-len
      let message = `<strong>${user.firstName} ${user.lastName}</strong> (${user.email}) has submitted for redemption on the date for the following campaigns: `;
      let ary = this.state.data.filter(
        item => item.completed !== 'completed' && item.completed !== 'rejected'
      );
      ary.map(item => {
        // eslint-disable-next-line max-len
        message += `<br/><br/><strong>${item.name}</strong> campaign for <strong>$${item.total_points}</strong>`;
      });
      await AnswerController.requestPayment(message);
      hideLoading();
      success(I18n.t('gotIt'));
    } catch (error) {
      hideLoading();
      alert(error?.response?.data?.error ? error.response.data.error : error.message);
    }
  }

  renderCampaign = ({ item, index }) => {
    return (
      <View style={styles.campaignContainer} key={item.id}>
        <View style={styles.logoContainer}>
          {item.logo ? (
            <FastImage
              source={{ uri: item.logo }}
              style={styles.logo}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
              <FastImage
                source={PlaceholderImage}
                style={styles.logo}
                resizeMode={FastImage.resizeMode.contain}
              />
            )}
        </View>
        <View style={styles.infoContainer}>
          <FastImage
            source={item.completed === 'completed' ? PaidIcon : EarnedIcon}
            style={styles.infoIcon}
            resizeMode={FastImage.resizeMode.contain}
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              {item.completed === 'completed' ? I18n.t('paid') : I18n.t('earned')}
            </Text>
            <Text style={styles.infoDescriptionText} numberOfLines={3}>
              {item.description}
            </Text>
            <Text style={styles.infoText}>
              {I18n.t('value', {
                money: item.total_points,
              })}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    let { total, data } = this.state;

    return (
      <View style={styles.wrapper}>
        <ProfileHeader
          containerStyle={styles.profile}
          navigation={this.props.navigation}
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.reload}
              title={I18n.t('loading')}
            />
          }
          scrollEventThrottle={100}
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.points}>
              {I18n.t('totalEarned', {
                money: total
              })}
            </Text>
            <TouchableWithoutFeedback onPress={this.handleHeaderPress}>
              <View style={styles.groupHeader}>
                <View style={styles.icon}>
                  <Ionicons
                    name={this.state.show ? 'md-arrow-dropdown' : 'md-arrow-dropright'}
                    color='#fff'
                    size={36}
                  />
                </View>
                <Text style={styles.title}>{I18n.t('completedActivities')}</Text>
              </View>
            </TouchableWithoutFeedback>
            {
              this.state.show ? (
                <View style={ styles.list }>
                  {
                    data.map((item, i) => this.renderCampaign({item}))
                  }
                </View>
              ) : null
            }
            <View style={styles.btnGroup}>
              <Button
                containerStyle={styles.btnRedeem}
                text={I18n.t('redeem')}
                textStyle={styles.btnText}
                onPress={this.handleRedeem}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

RewardScreen.contextType = AppContext;

RewardScreen.propTypes = {
  navigation: PropTypes.object
};

export default RewardScreen;
