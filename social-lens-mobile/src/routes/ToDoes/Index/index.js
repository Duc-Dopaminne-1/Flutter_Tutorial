import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  RefreshControl,
  Platform,
  Alert,
} from "react-native";
import { AuthController } from "app/controllers";
import firebase from 'react-native-firebase';
import PropTypes from "prop-types";
import Ionicons from "react-native-vector-icons/Ionicons";
import OneSignal from "react-native-onesignal";
import FastImage from "react-native-fast-image";
import moment from "moment";
import { alert } from "app/utils/Alert";
import I18n from 'app/i18n'
import { AppContext, ProfileHeader } from "app/components";
import {
  CampaignController,
  AnswerController,
  MessageController,
} from "app/controllers";
import { CampaignType, QuestionType } from "app/constants";
import styles from "./styles";
import PlaceholderImage from "app/assets/images/placeholder.png";
import ApplyIcon from "app/assets/images/apply_icon.png";
import CheckmarkIcon from "app/assets/images/checkmark_icon.png";
import CloseIcon from "app/assets/images/close_icon.png";
import RewardIcon from "app/assets/images/reward_icon.png";
import TimeIcon from "app/assets/images/time_icon.png";
import ChatIcon from "app/assets/images/chat_full_icon.png";
import AsyncStorage from "@react-native-community/async-storage";
import QuestionModal from "../Modal";
import {processBar} from "../../../shared/global";
import {shareFirebase, StoreUploading, Uploading} from "../../../controllers/Answer";
import {typeError} from "../../../constants/error";
import {languageUSer} from "../../../i18n";
const categories = [
  { key: "your_activities", label: I18n.t('yourActivities'), color: "#2a8ec9" },
  { key: "new_opportunities", label: I18n.t('newOpportunities'), color: "#20bf1c" },
  {
    key: "pending_applications",
    label: I18n.t('pendingApplications'),
    color: "#9b59b6",
  },
  {
    key: "completed_activities",
    label: I18n.t('completedActivities'),
    color: "#f56622",
  },
];

class TodoScreen extends React.Component {
  constructor(props) {
    super(props);

    let emptydata = { show: false, data: [], answers: [] };
    this.state = {
      your_activities: emptydata,
      new_opportunities: emptydata,
      pending_applications: emptydata,
      completed_activities: emptydata,
      refreshing: false,
    };

    OneSignal.addEventListener("received", this.onReceived);
    OneSignal.addEventListener("opened", this.onOpened);
  }

  async componentDidMount() {
    let user = this.context.user
    user.language = languageUSer
     await AuthController.updateUser(user);
    this.context.setUser(user)
    this.checkUploading()
    if (Platform.OS === "ios") {
      this.context.showLoading();
      await this.reload();
      this.context.hideLoading();
    } else {
      await this.reload();
    }
  }

  componentWillUnmount() {
    OneSignal.removeEventListener("received", this.onReceived);
    OneSignal.removeEventListener("opened", this.onOpened);
  }

  checkUploading = async () => {
    const result = await AsyncStorage.getItem(StoreUploading.UPLOADING);
    const data = JSON.parse(result)

    if(data) {
      const {campaignId, answers, medias, uploaded, totalMedia, totalQuestion } = data
      try {
        let answerRefId = await AnswerController.submitAnswers(
            campaignId,
            answers,
            medias,
            totalQuestion,
            uploaded,
            totalMedia
        );
        await AnswerController.transcribeAnswer(
            totalQuestion,
            answerRefId
        );

        await AsyncStorage.removeItem(campaignId);

        processBar.next({
          showLoading: true,
          total: shareFirebase + Math.floor(Math.random() * 10) + 1
        })

        setTimeout(() => {
          processBar.next({
            showLoading: false,
            total: 100
          })
          this.reload();
        }, 500)

      } catch (error) {
        processBar.next({
          showLoading: false,
          total: 0
        })
        if (error.code === typeError.networkError) {
          alert(I18n.t('networkError'));
        } else {
          alert(error.toString());
        }
      }
    }
  }

  onReceived = (notification) => this.reload();

  onOpened = (openResult) => this.reload();

  generateNewAnswers = (campaign) => {
    let answers = {},
      medias = {};
    campaign.questions.map((question, index) => {
      if (question.type === QuestionType.INSTRUCTION_QUESTION) {
        answers[index] = false;
      } else if (question.type === QuestionType.OPEN_TEXT_QUESTION) {
        answers[index] = "";
      } else if (question.type === QuestionType.ONE_CHOICE_QUESTION) {
        answers[index] = -1;
      } else if (question.type === QuestionType.MULTIPLE_CHOICE_QUESTION) {
        answers[index] = [];
      } else if (question.type === QuestionType.RANKING_CHOICE_QUESTION) {
        answers[index] = [];
      } else if (question.type === QuestionType.BLANK_QUESTION) {
        answers[index] = [-1, ""];
      }
      medias[index] = [];
    });
    return {
      answers,
      medias,
    };
  };

  reload = async () => {
    try {
      this.setState({ refreshing: true });
      let your_activities = { show: false, data: [], answers: [] };
      let new_opportunities = { show: false, data: [], answers: [] };
      let pending_applications = { show: false, data: [], answers: [] };
      let completed_activities = { show: false, data: [], answers: [] };

      let campaigns = await CampaignController.getCampaigns();

      let tasks = campaigns.map((campaign) => {
        if (
          campaign.type === CampaignType.STANDARD ||
          campaign.type === CampaignType.APPLICATION
        ) {
          return AnswerController.getAnswerByUserCampaign(campaign.id);
        } else {
          return MessageController.checkConversation(campaign.id);
        }
      });
      let answers = await Promise.all(tasks);

      // check if user has answers saved in async storage
      tasks = campaigns.map((campaign) => AsyncStorage.getItem(campaign.id));
      const tempAnswers = await Promise.all(tasks);

      campaigns.map((campaign, index) => {
        let answer = answers[index];
        let tempAnswer = tempAnswers[index]
          ? JSON.parse(tempAnswers[index])
          : {};

        if (
          campaign.type === CampaignType.STANDARD ||
          campaign.type === CampaignType.APPLICATION
        ) {
          let count = 0;
          let isTemp = false;
          if (!answer) {
            count = Object.keys(tempAnswer).length;
            answer = this.generateNewAnswers(campaign);
            isTemp = true;
          } else {
            let answers = answer.answers;
            Object.keys(answers).forEach((key) => {
              if (answers[key] === false) {
                return;
              }
              if (answers[key] === "") {
                return;
              }
              if (answers[key] === -1) {
                return;
              }
              if (answers[key].length === 0) {
                return;
              }
              count++;
            });
          }
          let newCampaignData = {
            ...campaign,
            completeness: count,
          };
          if (count === campaign.questions.length && !isTemp) {
            if (campaign.type === CampaignType.STANDARD) {
              if (answer.completed === "rejected") {
                your_activities.data.push(newCampaignData);
                your_activities.answers.push(answer);
              } else {
                completed_activities.data.push(newCampaignData);
                completed_activities.answers.push(answer);
              }
            } else {
              pending_applications.data.push(newCampaignData);
              pending_applications.answers.push(answer);
            }
          } else {
            let from = new Date(campaign.from),
              to = new Date(campaign.to);
            let today = new Date();
            if (today < from || today > to) {
              return;
            }
            if (campaign.type === CampaignType.STANDARD) {
              your_activities.data.push(newCampaignData);
              your_activities.answers.push(answer);
            } else {
              new_opportunities.data.push(newCampaignData);
              new_opportunities.answers.push(answer);
            }
          }
        } else {
          let from = new Date(campaign.from),
            to = new Date(campaign.to);
          let today = new Date();
          if (today < from || today > to) {
            return;
          }
          your_activities.data.push(campaign);
          your_activities.answers.push(answer);
        }
      });
      // calculating completeness for campaign answers
      if (your_activities.data.length) {
        your_activities.show = true;
      } else if (new_opportunities.data.length) {
        new_opportunities.show = true;
      } else if (pending_applications.data.length) {
        pending_applications.show = true;
      } else if (completed_activities.data.length) {
        completed_activities.show = true;
      }
      this.setState({
        your_activities,
        new_opportunities,
        pending_applications,
        completed_activities,
        refreshing: false,
      });
    } catch (error) {
      this.setState({ refreshing: false });


      if (error.code === typeError.networkError) {
        alert(I18n.t('networkError'));
      } else if (error.code === typeError.unavailable) {
        alert(I18n.t('unavailable'));
      } else {
        alert(error.message);
      }
    }
  };

  handleHeaderPress = (category) => () => {
    let data = this.state[category.key];
    data.show = !data.show;
    this.setState({
      [category.key]: data,
    });
  };

  handleCampaignPress = (index, category) => {
    let campaign = this.state[category.key].data[index];
    let answer = this.state[category.key].answers[index];

    if (
      campaign.type === CampaignType.STANDARD ||
      campaign.type === CampaignType.APPLICATION
    ) {
      this.props.navigation.navigate("tododetails", {
        campaign,
        answer,
        category,
        reload: this.reload,
      });
    } else {
      this.props.navigation.navigate("conversation", {
        campaign,
        answer,
        category,
        reload: this.reload,
      });
    }
  };

  renderCampaign = ({ item, index }, category) => {
    const answer = this.state[category.key].answers[index];

    let bgColorStyle = { backgroundColor: category.color };
    let daysRemaining = parseInt(
      (moment(item.to).unix() - moment().unix()) / 86400
    );
    let reward = parseInt(
      (item.completeness / item.questions.length) * item.total_points
    );
    if (item.type === CampaignType.CONVERSATION) {
      if (answer) {
        reward = item.total_points;
      } else {
        reward = 0;
      }
    }

    return (
      <TouchableOpacity
        key={index}
        style={styles.campaignContainer}
        onPress={() => this.handleCampaignPress(index, category)}
      >
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
        <View style={[styles.infoContainer, bgColorStyle]}>
          {item.type === CampaignType.STANDARD && (
            <View style={styles.infoItem}>
              <FastImage
                source={
                  answer.completed === "rejected" ? CloseIcon : CheckmarkIcon
                }
                style={styles.infoIcon}
                tintColor="#fff"
                resizeMode={FastImage.resizeMode.contain}
              />
              <Text style={styles.infoText}>
                {answer.completed === "rejected"
                  ? I18n.t('changesRequested')
                  : I18n.t('completeness', {
                      completeness: item.completeness,
                      questionsLength: item.questions.length
                    })}
              </Text>
            </View>
          )}
          {item.type === CampaignType.APPLICATION && (
            <View style={styles.infoItem}>
              <FastImage
                source={ApplyIcon}
                style={styles.infoIcon}
                resizeMode={FastImage.resizeMode.contain}
              />
              <Text style={styles.infoText}>
                {I18n.t('completenessApplied', {
                  completeness: item.completeness,
                  questionsLength: item.questions.length
                })}
              </Text>
            </View>
          )}
          <View style={styles.infoItemDescription}>
            {item.type === CampaignType.CONVERSATION ? (
              <FastImage
                source={ChatIcon}
                style={styles.infoIcon}
                resizeMode={FastImage.resizeMode.contain}
              />
            ) : (
              <View style={styles.infoIcon} />
            )}
            <Text style={styles.infoDescriptionText} numberOfLines={3}>
              {item.description}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <FastImage
              source={RewardIcon}
              style={styles.infoIcon}
              resizeMode={FastImage.resizeMode.contain}
            />
            <Text style={styles.infoText}>
              {item.type !== CampaignType.APPLICATION
                ?  I18n.t('rewardEarned', {
                      reward: reward,
                      total_points: item.total_points
                    })
                : I18n.t('campaignAccepted', {
                    money: item.total_points
                  })}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <FastImage
              source={TimeIcon}
              style={styles.infoIcon}
              resizeMode={FastImage.resizeMode.contain}
            />
            <Text style={styles.infoText}>
              {item.type !== CampaignType.APPLICATION
                ? I18n.t('daysRemaining', {
                    daysRemaining: daysRemaining
                  })
                :  I18n.t('daysApply', {
                    daysApply: daysRemaining
                  })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderGroup = (category) => {
    let bgColorStyle = { backgroundColor: category.color };
    let data = this.state[category.key];

    return (
      <View key={category.key} style={styles.groupContainer}>
        <TouchableWithoutFeedback onPress={this.handleHeaderPress(category)}>
          <View style={[styles.groupHeader, bgColorStyle]}>
            <View style={styles.icon}>
              <Ionicons
                name={data.show ? "md-arrow-dropdown" : "md-arrow-dropright"}
                color="#fff"
                size={36}
              />
            </View>
            <Text style={styles.title}>{category.label}</Text>
          </View>
        </TouchableWithoutFeedback>
        {data.show ? (
          <View style={styles.list}>
            {data.data.map((item, i) =>
              this.renderCampaign({ item, index: i }, category)
            )}
          </View>
        ) : null}
      </View>
    );
  };


  render() {

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
            {categories.map((category) => {
              return this.renderGroup(category);
            })}
          </View>
          <QuestionModal />
        </ScrollView>
      </View>
    );
  }
}

TodoScreen.contextType = AppContext;

TodoScreen.propTypes = {
  navigation: PropTypes.object,
};

export default TodoScreen;
