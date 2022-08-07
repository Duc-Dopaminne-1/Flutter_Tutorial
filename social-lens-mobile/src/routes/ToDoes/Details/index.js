import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import I18n from 'app/i18n'
import PropTypes from "prop-types";
import Dash from "react-native-dash";
import FastImage from "react-native-fast-image";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";

import { AppContext, ProfileHeader, Button } from "app/components";
import { AnswerController } from "app/controllers";
import { CampaignType, QuestionType } from "app/constants";

import styles from "./styles";

import PlaceholderImage from "app/assets/images/placeholder.png";
import ApplyIcon from "app/assets/images/apply_icon.png";
import CheckmarkIcon from "app/assets/images/checkmark_icon.png";
import CloseIcon from "app/assets/images/close_icon.png";
import RewardIcon from "app/assets/images/reward_icon.png";
import TimeIcon from "app/assets/images/time_icon.png";
import AddIcon from "app/assets/images/add_icon.png";
import ViewIcon from "app/assets/images/view_icon.png";
import InstructionIcon from "app/assets/images/instruction_icon.png";
import OpenTextIcon from "app/assets/images/open_text_icon.png";
import FillBlank from "app/assets/images/pencil_icon.png";
import SingleChoiceIcon from "app/assets/images/single_choice_icon.png";
import MultipleChoiceIcon from "app/assets/images/multiple_choice_icon.png";
import RankingIcon from "app/assets/images/ranking_icon.png";
import { alert } from "app/utils/Alert";
import {colors} from "../../../constants";
import {convertQuestion} from "../../../shared/processing";
import {processBar} from "../../../shared/global";
import {shareFirebase} from "../../../controllers/Answer";
import {typeError} from "../../../constants/error";

class TodoDetailsScreen extends React.Component {

  isOpenAlert = false

  constructor(props) {
    super(props);

    let { category } = props.navigation.state.params;
    let isCompleted =
      category.key === "pending_applications" ||
      category.key === "completed_activities";


    this.state = {
      ...props.navigation.state.params, // campaign, answer, category, reload,
      tempAnswer: {},
      isCompleted,
      rejectedSet: new Set([]),
    };
  }

  async componentDidMount() {
    const { campaign } = this.state;
    const tempAnswerStr = await AsyncStorage.getItem(campaign.id);
    const tempAnswer = tempAnswerStr ? JSON.parse(tempAnswerStr) : {};
    this.setState({ tempAnswer });
  }

  goBack = () => {
    this.props.navigation.goBack();
    if (
      this.state.category.key === "your_activities" ||
      this.state.category.key === "new_opportunities"
    ) {
      // not completed activities
      this.state.reload();
    }
  };

  update = (answer, qIndex = -1) => {
    let { campaign, tempAnswer, rejectedSet } = this.state;

    //Update answer with tempAnser
    Object.keys(tempAnswer).forEach((key) => {
      if (key != qIndex) {
        let question = campaign.questions[key];
        if (question.type === QuestionType.INSTRUCTION_QUESTION) {
          answer.answers[key] = true;
        } else if (question.type === QuestionType.OPEN_TEXT_QUESTION) {
          answer.answers[key] = tempAnswer[key].answerText;
        } else if (question.type === QuestionType.ONE_CHOICE_QUESTION) {
          answer.answers[key] = tempAnswer[key].answerSingleChoice;
        } else if (question.type === QuestionType.MULTIPLE_CHOICE_QUESTION) {
          answer.answers[key] = tempAnswer[key].answerMultipleChoice;
        } else if (question.type === QuestionType.RANKING_CHOICE_QUESTION) {
          answer.answers[key] = tempAnswer[key].answerRankingChoice;
        } else if (question.type === QuestionType.BLANK_QUESTION) {
          answer.answers[key] = [tempAnswer[key].answerSingleChoice, tempAnswer[key].answerText];
        }
        answer.medias[key] = tempAnswer[key].medias;
      }
    });

    let count = 0;
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
    campaign.completeness = count;

    if (qIndex !== -1) {
      rejectedSet.add(qIndex);
    }
    this.setState({ campaign, answer, rejectedSet });
  };

  goToQuestionDetails = (index) => () => {
    let { campaign, answer, category } = this.state;
    this.props.navigation.navigate(
      "questiondetails",
      // eslint-disable-next-line max-len
      {
        campaign,
        answer: JSON.parse(JSON.stringify(answer)),
        qIndex: index,
        category,
        update: this.update,
      }
    );
  };

  validate = () => {
    let { campaign, answer } = this.state;

    let validationResult = true;
    for (let index = 0; index < campaign.questions.length; index++) {
      let question = campaign.questions[index];

      if (
        question.type === QuestionType.INSTRUCTION_QUESTION &&
        !answer.answers[index]
      ) {
        validationResult = false;
      } else if (
        question.type === QuestionType.OPEN_TEXT_QUESTION &&
        !answer.answers[index]
      ) {
        validationResult = false;
      } else if (
        question.type === QuestionType.ONE_CHOICE_QUESTION &&
        answer.answers[index] === -1
      ) {
        validationResult = false;
      } else if (
        question.type === QuestionType.MULTIPLE_CHOICE_QUESTION &&
        answer.answers[index].length === 0
      ) {
        validationResult = false;
      } else if (
        question.type === QuestionType.RANKING_CHOICE_QUESTION &&
        answer.answers[index].length !== question.answers.length
      ) {
        validationResult = false;
      } else if (
          question.type === QuestionType.BLANK_QUESTION && (!answer.answers[index][0] === -1|| !answer.answers[index][1])
      ) {
        validationResult = false;
      }

      if (!validationResult) {
        Alert.alert(
            I18n.t('error'),
            I18n.t('notComplete'),
            [
              {
                text: I18n.t('ok'),
                onPress: () => { this.isOpenAlert = false},
              },
            ],
            { cancelable: false }
        )
        break;
      }
    }

    return validationResult;
  };

  convertTempToAnswer = async () =>
    new Promise((resolve, _) => {
      const { campaign, answer, tempAnswer } = this.state;
      campaign.questions.map((question, qIndex) => {
        if (question.type === QuestionType.INSTRUCTION_QUESTION) {
          answer.answers[qIndex] = true;
        } else if (question.type === QuestionType.OPEN_TEXT_QUESTION) {
          answer.answers[qIndex] = tempAnswer[qIndex].answerText;
        } else if (question.type === QuestionType.ONE_CHOICE_QUESTION) {
          answer.answers[qIndex] = tempAnswer[qIndex].answerSingleChoice;
        } else if (question.type === QuestionType.MULTIPLE_CHOICE_QUESTION) {
          answer.answers[qIndex] = tempAnswer[qIndex].answerMultipleChoice;
        } else if (question.type === QuestionType.RANKING_CHOICE_QUESTION) {
          answer.answers[qIndex] = tempAnswer[qIndex].answerRankingChoice;
        } else if (question.type === QuestionType.BLANK_QUESTION) {
          answer.answers[qIndex] = [tempAnswer[qIndex].answerSingleChoice, tempAnswer[qIndex].answerText];
        }
        answer.medias[qIndex] = tempAnswer[qIndex].medias;
      });

      this.setState({ answer }, () => {
        resolve();
      });
    });

  handleSubmit = async () => {

    if(this.isOpenAlert) {
      return
    }
    this.isOpenAlert = true

    let { campaign, answer, tempAnswer } = this.state;

    // check if async storage already has all answers
    if (Object.keys(tempAnswer).length === campaign.questions.length) {
      await this.convertTempToAnswer();
    }

    if (!this.validate()) {
      return;
    }

    try {
      let answerRefId = await AnswerController.submitAnswers(
        campaign.id,
        answer.answers,
        answer.medias,
        campaign.questions.length
      );

      await AnswerController.transcribeAnswer(
        campaign.questions.length,
        answerRefId
      );

      // clear answer for this campaign from async storage
      this.clearTemp();
      processBar.next({
        showLoading: true,
        total: shareFirebase + Math.floor(Math.random() * 10) + 1
      })

      setTimeout(() => {
        processBar.next({
          showLoading: false,
          total: 100
        })
        this.state.reload();
        this.props.navigation.goBack();
        this.isOpenAlert = false
      }, 500)

    } catch (error) {
      this.isOpenAlert = false
      processBar.next({
        showLoading: false,
        total: 0
      })
      if (error.code === typeError.unavailable) {
        alert(I18n.t('unavailable'));
      } else {
        alert(error.toString());
      }
    }
  };

  clearTemp = async () => {
    const { campaign } = this.state;
    await AsyncStorage.removeItem(campaign.id);
  };

  renderQuestion = (index) => {
    let { campaign, answer, tempAnswer, isCompleted, rejectedSet } = this.state;
    let question = campaign.questions[index];

    let icon = null,
      title = "",
      hasAnswer = false;

    if (answer) {
      if (
        question.type === QuestionType.INSTRUCTION_QUESTION &&
        answer.answers[index]
      ) {
        hasAnswer = true;
      } else if (
        question.type === QuestionType.OPEN_TEXT_QUESTION &&
        answer.answers[index] !== ""
      ) {
        hasAnswer = true;
      } else if (
        question.type === QuestionType.ONE_CHOICE_QUESTION &&
        answer.answers[index] !== -1
      ) {
        hasAnswer = true;
      } else if (
        question.type === QuestionType.MULTIPLE_CHOICE_QUESTION &&
        answer.answers[index].length !== 0
      ) {
        hasAnswer = true;
      } else if (
        question.type === QuestionType.RANKING_CHOICE_QUESTION &&
        answer.answers[index].length === question.answers.length
      ) {
        hasAnswer = true;
      } else if (tempAnswer[index]) {
        hasAnswer = true;
      } else if (
          question.type === QuestionType.BLANK_QUESTION && (answer.answers[index][0] !== -1|| answer.answers[index][1] !== "")
      ) {
        hasAnswer = true;
      }
    } else {
      hasAnswer = false;
    }

    switch (question.type) {
      case QuestionType.INSTRUCTION_QUESTION:
        icon = InstructionIcon;
        title = I18n.t('watch');
        break;
      case QuestionType.OPEN_TEXT_QUESTION:
        icon = OpenTextIcon;
        title =  I18n.t('share');
        break;
      case QuestionType.ONE_CHOICE_QUESTION:
        icon = SingleChoiceIcon;
        title = I18n.t('selectOne');
        break;
      case QuestionType.MULTIPLE_CHOICE_QUESTION:
        icon = MultipleChoiceIcon;
        title = I18n.t('multipleChoice');
        break;
      case QuestionType.RANKING_CHOICE_QUESTION:
        icon = RankingIcon;
        title = I18n.t('rank');
        break;
      case QuestionType.BLANK_QUESTION:
        icon = FillBlank;
        title = I18n.t('fillBlank');
        break;
      default:
        break;
    }

    const isRejected =
      answer.completed === "rejected" &&
      answer.feedbacks !== null &&
      answer.feedbacks.length !== 0 &&
      answer.feedbacks[index] !== "" &&
      !rejectedSet.has(index);

    return (
      <View key={`${index}`} style={styles.questionItem}>
        <View style={styles.questionContainer}>
          <TouchableOpacity
            style={styles.questionIconBtn}
            onPress={this.goToQuestionDetails(index)}
          >
            <FastImage
              source={icon}
              tintColor={colors.white}
              style={styles.questionIcon}
              resizeMode={FastImage.resizeMode.contain}
            />
          </TouchableOpacity>
          <View style={styles.questionInfo}>
            <Text style={styles.questionTitle}>{title}</Text>
            {convertQuestion(question, styles.questionText, styles.wrapQuestion, 2)}
          </View>
          <TouchableOpacity
            style={[styles.addBtn, isRejected && styles.addBtnRejected]}
            onPress={this.goToQuestionDetails(index)}
          >
            <FastImage
              source={
                isCompleted ? ViewIcon : hasAnswer ? CheckmarkIcon : AddIcon
              }
              style={styles.addIcon}
              resizeMode={FastImage.resizeMode.contain}
            />
          </TouchableOpacity>
        </View>
        <Dash
          style={styles.divider}
          dashLength={2}
          dashGap={4}
          dashColor="#abadb2"
        />
      </View>
    );
  };

  renderCampaign = () => {
    
    let { campaign, answer, category } = this.state;

    let bgColorStyle = { backgroundColor: category.color };
    let daysRemaining = parseInt(
      (moment(campaign.to).unix() - moment().unix()) / 86400
    );
    let description = "";

    if (
      campaign.type === CampaignType.STANDARD &&
      category.key == "your_activities"
    ) {
      description = I18n.t('campaignContent', {
        campaignLength: (campaign.questions.length -
            campaign.completeness),
        money: campaign.total_points
      });
    } else if (
      campaign.type === CampaignType.STANDARD &&
      category.key == "completed_activities"
    ) {
      description = I18n.t('campaignEarned', {
        money: campaign.total_points
      })
    } else {
      description = I18n.t('campaignAccepted', {
        money: campaign.total_points
      })
    }

    return (
      <View style={styles.campaignContainer}>
        <View style={styles.logoContainer}>
          {campaign.logo ? (
            <FastImage
              source={{ uri: campaign.logo }}
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
          {campaign.type === CampaignType.STANDARD && (
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
                      completeness: campaign.completeness,
                      questionsLength: campaign.questions.length
                    })}
              </Text>
            </View>
          )}
          {campaign.type === CampaignType.APPLICATION && (
            <View style={styles.infoItem}>
              <FastImage
                source={ApplyIcon}
                style={styles.infoIcon}
                resizeMode={FastImage.resizeMode.contain}
              />
              <Text style={styles.infoText}>
                {I18n.t('completenessApplied', {
                  completeness: campaign.completeness,
                  questionsLength: campaign.questions.length
                })}
              </Text>
            </View>
          )}
          <View style={styles.infoItemDescription}>
            <View style={styles.infoIcon} />
            <Text style={styles.infoDescriptionText} numberOfLines={3}>
              {campaign.description}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <FastImage
              source={RewardIcon}
              style={styles.infoIcon}
              resizeMode={FastImage.resizeMode.contain}
            />
            <Text style={styles.infoText}>{description}</Text>
          </View>
          <View style={styles.infoItem}>
            <FastImage
              source={TimeIcon}
              style={styles.infoIcon}
              resizeMode={FastImage.resizeMode.contain}
            />
            <Text style={styles.infoText}>
              {campaign.type !== CampaignType.APPLICATION
                ? I18n.t('daysRemaining', {
                    daysRemaining: daysRemaining
                  })
                : I18n.t('daysApply', {
                    daysApply: daysRemaining
                  })}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    

    let { campaign, answer, category, isCompleted } = this.state;

    let bgColorStyle = { backgroundColor: category.color };
    let description = "";
    if (
      campaign.type === CampaignType.STANDARD &&
      category.key == "your_activities"
    ) {
      // eslint-disable-next-line max-len
      description =  I18n.t('campaignContentBottom', {
        campaignLength: (campaign.questions.length -
            campaign.completeness),
        money: campaign.total_points
      })
    } else if (
      campaign.type === CampaignType.STANDARD &&
      category.key == "completed_activities"
    ) {
      description = I18n.t('campaignEarned', {
        money: campaign.total_points
      })
    } else {
      description = I18n.t('campaignAccepted', {
        money: campaign.total_points
      })
    }

    return (
      <View style={styles.wrapper}>
        <ProfileHeader
          containerStyle={styles.profile}
          navigation={this.props.navigation}
        />
        <TouchableWithoutFeedback onPress={this.goBack}>
          <View style={[styles.header, bgColorStyle]}>
            <View style={styles.icon}>
              <Ionicons name="md-arrow-back" color="#fff" size={24} />
            </View>
            <Text style={styles.title}>{category.label}</Text>
          </View>
        </TouchableWithoutFeedback>
        {this.renderCampaign()}
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {campaign.questions.map((question, index) =>
              this.renderQuestion(index)
            )}
          </View>
          {!isCompleted && (
            <View style={styles.btnGroup}>
              <Button
                containerStyle={styles.btnSubmit}
                text={I18n.t('submit')}
                textStyle={styles.btnText}
                onPress={this.handleSubmit}
              />
            </View>
          )}
        </ScrollView>
        <View
          style={[
            styles.bottombar,
            answer.completed === "rejected" && styles.bottombarRejected,
          ]}
        >
          <Text style={styles.bottombarDescription}>
            {answer.completed === "rejected"
              ? I18n.t('changesRequested')
              : description}
          </Text>
        </View>
      </View>
    );
  }
}

TodoDetailsScreen.contextType = AppContext;

TodoDetailsScreen.propTypes = {
  navigation: PropTypes.object,
};

export default TodoDetailsScreen;
