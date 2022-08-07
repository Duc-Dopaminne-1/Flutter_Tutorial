import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  FlatList,
  Platform,
  TouchableHighlight, Alert,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FastImage from "react-native-fast-image";
import Video from "react-native-video";
import YouTube from "react-native-youtube";
import Ionicons from "react-native-vector-icons/Ionicons";
import ActionSheet from "react-native-actionsheet";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import ImagePicker from 'react-native-image-crop-picker';
import { GOOGLE_API_KEY } from "app/config";
import { AppContext, ProfileHeader, Button, VideoModal } from "app/components";
import { QuestionType } from "app/constants";
import _ from 'lodash'
import styles from "./styles";
import UploadIcon from "app/assets/images/upload_icon.png";
import { updateParticipantStartStatusOfCampaign } from "../../../controllers/Participant";
import firebase from "react-native-firebase";
import {convertQuestion} from "../../../shared/processing";
import I18n from 'app/i18n'

class QuestionDetailsScreen extends React.Component {

  isChangeSelect = false

  constructor(props) {
    super(props);

    let category = props.navigation.state.params.category;
    let isCompleted =
      category.key === "pending_applications" ||
      category.key === "completed_activities";
    this.state = {
      ...props.navigation.state.params, // campaign, answer, qIndex, category, update
      isCompleted,
      qVideoPaused: true,
      height: 199,
      currentUri: {},
      // answer inputs
      answerText: "",
      answerSingleChoice: -1,
      answerMultipleChoice: [],
      answerRankingChoice: [],
      // medias
      medias: [],
      mediaStates: [],
    };

    this.options = [
      I18n.t('recordVideo'),
      I18n.t('takeAPhoto'),
      I18n.t('selectVideoLibrary'),
      I18n.t('selectImageLibrary'),
      I18n.t('cancel'),
    ];

    this.players = {};
  }

  async componentDidMount() {
    let { campaign, answer, qIndex } = this.state;
    let question = campaign.questions[qIndex];

    const temp = await this.loadTemp(question.question);

    if (!temp) {
      if (question.type === QuestionType.OPEN_TEXT_QUESTION) {
        this.setState({ answerText: answer.answers[qIndex] });
      } else if (question.type === QuestionType.ONE_CHOICE_QUESTION) {
        this.setState({ answerSingleChoice: answer.answers[qIndex] });
      } else if (question.type === QuestionType.MULTIPLE_CHOICE_QUESTION) {
        this.setState({ answerMultipleChoice: answer.answers[qIndex] });
      } else if (question.type === QuestionType.RANKING_CHOICE_QUESTION) {
        this.setState({ answerRankingChoice: answer.answers[qIndex] });
      } else if (question.type === QuestionType.BLANK_QUESTION) {
        this.setState({ answerSingleChoice: answer.answers[qIndex][0] });
        this.setState({ answerText: answer.answers[qIndex][1] });
      }

      let mediaStates = Array(answer.medias[qIndex].length).fill(true);
      this.setState({ medias: answer.medias[qIndex], mediaStates });
      this.dataCatch = _.cloneDeep(this.state)
    } else {
      this.dataCatch = _.cloneDeep(temp)
      this.setState(temp);
    }
  }

  playQuestionVideo = (source) => {
    if (Platform.OS === "ios") {
      this.qVideoPlayer.seek(0);
      this.setState({ qVideoPaused: false });
      this.qVideoPlayer.presentFullscreenPlayer();
    } else {
      this.setState(
        {
          currentUri: source,
        },
        () => {
          this.videoModalRef.show();
        }
      );
    }
  };

  stopQuestionVideo = () => {
    this.setState({ qVideoPaused: true });
  };

  playVideo = (index, source) => {
    if (Platform.OS === "ios") {
      let { mediaStates } = this.state;
      mediaStates[index] = false;
      this.setState({ mediaStates });
      this.players[this.state.medias[index].id].seek(0);
      this.players[this.state.medias[index].id].presentFullscreenPlayer();
    } else {
      this.setState(
        {
          currentUri: source,
        },
        () => {
          this.videoModalRef.show();
        }
      );
    }
  };

  stopVideo = (index) => {
    let { mediaStates } = this.state;
    mediaStates[index] = true;
    this.setState({ mediaStates });
  };

  handleUploadMedia = () => {
    this.ActionSheet.show();
  };

  addToMedias = (response, type) => {
    if (response.didCancel) {
    } else if (response.error) {
    } else {
      let { mediaStates } = this.state;
      let medias = [...this.state.medias];
      let id = uuidv4();
      let uri =
        Platform.OS === "ios"
          ? response.replace("file://", "")
          : response;

      medias.push({ id, uri, type });
      mediaStates.push(true);
      this.setState({ medias, mediaStates });
    }
  };

  removeFromMedias = (index) => () => {
    let { medias, mediaStates } = this.state;
    medias.splice(index, 1);
    mediaStates.splice(index, 1);
    this.setState({ medias, mediaStates });
  };

  handleActionSheet = (index) => {
    switch (index) {
      case 0: //record a new video
        ImagePicker.openCamera({
          mediaType: 'video',
        }).then(video => {
          this.addToMedias(video.path, "video");
        });
        break;
      case 1: // take a new photo
        ImagePicker.openCamera({
        }).then(image => {
          this.addToMedias(image.path, "image");
        });
        break;
      case 2: // select video from library
        ImagePicker.openPicker({
          mediaType: "video",
        }).then((video) => {
          this.addToMedias(video.path, "video");
        });
        break;
      case 3: // select image from library
        ImagePicker.openPicker({
          mediaType: 'photo',
        }).then(image => {
          this.addToMedias(image.path, "image");
        });
        break;
      default:
        break;
    }
  };

  handleBack = () => {
      if(JSON.stringify(this.dataCatch.answerMultipleChoice) !==JSON.stringify(this.state.answerMultipleChoice)) {
        this.isChangeSelect = true
      }
      if(JSON.stringify(this.dataCatch.answerRankingChoice)!==JSON.stringify(this.state.answerRankingChoice)) {
        this.isChangeSelect = true
      }
      if( this.dataCatch.answerSingleChoice !== this.state.answerSingleChoice) {
        this.isChangeSelect = true
      }
      if( this.dataCatch.answerText !== this.state.answerText) {
        this.isChangeSelect = true
      }
      if( this.dataCatch.medias.length !== this.state.medias.length) {
        this.isChangeSelect = true
      } else {
        this.dataCatch.medias.map( (item, index) => {
          if(JSON.stringify(item)!==JSON.stringify(this.state.medias[index])) {
            this.isChangeSelect = true
          }
        })
      }
      if(this.isChangeSelect) {
        Alert.alert(
            I18n.t('exit'),
            I18n.t('notSaved'),
            [
              {
                style: 'destructive',
                text: I18n.t('discardChanges'),
                onPress: () => {
                  this.props.navigation.goBack();
                },
              },
              {
                text: I18n.t('cancel'),
                onPress: () => { },
              },
            ],
            { cancelable: false }
        )
        return
      }
    this.props.navigation.goBack();
  };

  validate = () => {
    let { campaign, qIndex } = this.state;
    let question = campaign.questions[qIndex];

    if (question.type === QuestionType.OPEN_TEXT_QUESTION) {
      if (!this.state.answerText) {
        alert(I18n.t('answerEmpty'));
        return false;
      }
    } else if (question.type === QuestionType.ONE_CHOICE_QUESTION) {
      if (this.state.answerSingleChoice === -1) {
        alert(I18n.t('selectAnswer'));
        return false;
      }
    } else if (question.type === QuestionType.MULTIPLE_CHOICE_QUESTION) {
      if (this.state.answerMultipleChoice.length === 0) {
        alert(I18n.t('oneAnswer'));
        return false;
      }
    } else if (question.type === QuestionType.RANKING_CHOICE_QUESTION) {
      if (this.state.answerRankingChoice.length !== question.answers.length) {
        alert(I18n.t('rankAnswers'));
        return false;
      }
    }
    else if (question.type === QuestionType.BLANK_QUESTION) {
      if (this.state.answerSingleChoice === -1) {
        alert(I18n.t('selectAnswer'));
        return false;
      }
      if (!this.state.answerText) {
        alert(I18n.t('answerEmpty'));
        return false;
      }
    }
    return true;
  };

  saveTemp = async (question) => {
    const { campaign, qIndex } = this.state;

    const tempInfoStr = await AsyncStorage.getItem(campaign.id);
    let tempInfo = {};
    if (tempInfoStr) {
      tempInfo = JSON.parse(tempInfoStr);
    }

    tempInfo[qIndex] = {
      answerText: this.state.answerText,
      answerSingleChoice: this.state.answerSingleChoice,
      answerMultipleChoice: this.state.answerMultipleChoice,
      answerRankingChoice: this.state.answerRankingChoice,
      medias: this.state.medias,
      mediaStates: this.state.mediaStates,
    };
    AsyncStorage.setItem(campaign.id, JSON.stringify(tempInfo));
  };

  loadTemp = async (question) => {
    const { campaign, qIndex } = this.state;

    let tempInfoStr = await AsyncStorage.getItem(campaign.id);
    if (!tempInfoStr) {
      return null;
    }

    const tempInfo = JSON.parse(tempInfoStr)[qIndex];
    if (!tempInfo) {
      return null;
    }

    return {
      answerText: tempInfo.answerText,
      answerSingleChoice: tempInfo.answerSingleChoice,
      answerMultipleChoice: tempInfo.answerMultipleChoice,
      answerRankingChoice: tempInfo.answerRankingChoice,
      // medias
      medias: tempInfo.medias,
      mediaStates: tempInfo.mediaStates,
    };
  };

  handleSave = async () => {
    let { campaign, answer, update, medias, qIndex } = this.state;
    let question = campaign.questions[qIndex];

    if (!this.validate()) {
      return;
    }

    // check if this question requires media
    const { userMediaEnable } = question;
    if (userMediaEnable && medias.length === 0) {
      Alert.alert(
          I18n.t('alert'),
          I18n.t('uploadVideo'),
          [
            {
              text: I18n.t('ok'),
              onPress: async () => {},
            },
          ],
          { cancelable: false }
      );
      return;
    }

    // save into local storage for future sessions
    await this.saveTemp(question.question);

    if (question.type === QuestionType.INSTRUCTION_QUESTION) {
      answer.answers[qIndex] = true;
    } else if (question.type === QuestionType.OPEN_TEXT_QUESTION) {
      answer.answers[qIndex] = this.state.answerText;
    } else if (question.type === QuestionType.ONE_CHOICE_QUESTION) {
      answer.answers[qIndex] = this.state.answerSingleChoice;
    } else if (question.type === QuestionType.MULTIPLE_CHOICE_QUESTION) {
      answer.answers[qIndex] = this.state.answerMultipleChoice;
    } else if (question.type === QuestionType.RANKING_CHOICE_QUESTION) {
      answer.answers[qIndex] = this.state.answerRankingChoice;
    } else if (question.type === QuestionType.BLANK_QUESTION) {
      answer.answers[qIndex] = [this.state.answerSingleChoice, this.state.answerText];
    }

    answer.medias[qIndex] = medias;

    const isRejected =
      answer.completed === "rejected" &&
      answer.feedbacks !== null &&
      answer.feedbacks.length !== 0 &&
      answer.feedbacks[qIndex] !== "";

    update(answer, qIndex);
    //update(answer, isRejected ? qIndex : -1);


    let user = firebase.auth().currentUser;
    await updateParticipantStartStatusOfCampaign(
      campaign.participant_group_id,
      user.email
    );
    this.props.navigation.goBack();
  };

  // youtube related event handlers
  handleReady = () => {
    setTimeout(() => this.setState({ height: 200 }), 500);
  };

  handleChangeFullScreen = () => {
    setTimeout(() => {
      this.setState({
        height: this.state.height === 200 ? 199 : 200,
      });
    }, 500);
  };

  openTextInput = (isCompleted, question) => {
    return (
        <TextInput
            style={styles.answerInput}
            editable={!isCompleted}
            multiline={true}
            value={this.state.answerText}
            onChangeText={(value) => this.setState({ answerText: value })}
        />
    );
  }

  openOneChoice = (isCompleted, question) => {
    return (
        <View style={styles.list}>
          {question.answers.map((item, index) => (
              <TouchableWithoutFeedback
                  key={`${index}`}
                  disabled={isCompleted}
                  onPress={() => this.setState({ answerSingleChoice: index })}
              >
                <View
                    style={[
                      styles.listItem,
                      this.state.answerSingleChoice === index &&
                      styles.listItemSelected,
                    ]}
                >
                  <Text style={styles.listItemText}>{item}</Text>
                </View>
              </TouchableWithoutFeedback>
          ))}
        </View>
    );
  }

  openMultipleChoice = (isCompleted, question) => {
    return (
        <View style={styles.list}>
          {question.answers.map((item, index) => (
              <TouchableWithoutFeedback
                  key={`${index}`}
                  disabled={isCompleted}
                  onPress={() => {
                    let { answerMultipleChoice } = this.state;
                    let i = answerMultipleChoice.indexOf(index);
                    if (i === -1) {
                      answerMultipleChoice.push(index);
                    } else {
                      answerMultipleChoice.splice(i, 1);
                    }
                    this.setState({ answerMultipleChoice });
                  }}
              >
                <View
                    style={[
                      styles.listItem,
                      this.state.answerMultipleChoice.includes(index) &&
                      styles.listItemSelected,
                    ]}
                >
                  <Text style={styles.listItemText}>
                    {String.fromCharCode(65 + index)}. {item}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
          ))}
        </View>
    );
  }

  openRakingChoice = (isCompleted, question) => {
    return (
        <View style={styles.list}>
          {this.state.answerRankingChoice.map((item, index) => (
              <TouchableWithoutFeedback
                  key={`${item}`}
                  disabled={isCompleted}
                  onPress={() => {
                    let { answerRankingChoice } = this.state;
                    let i = answerRankingChoice.indexOf(item);
                    answerRankingChoice.splice(i, 1);
                    this.setState({ answerRankingChoice });
                  }}
              >
                <View style={[styles.listItem, styles.listItemSelected]}>
                  <Text style={styles.listItemText}>
                    {String.fromCharCode(65 + item)}. {question.answers[item]}
                  </Text>
                  <Text style={styles.orderText}>{index + 1}</Text>
                </View>
              </TouchableWithoutFeedback>
          ))}
          {question.answers.map((item, index) => {
            if (this.state.answerRankingChoice.includes(index)) return;
            return (
                <TouchableWithoutFeedback
                    key={`${item}`}
                    disabled={isCompleted}
                    onPress={() => {
                      let { answerRankingChoice } = this.state;
                      answerRankingChoice.push(index);
                      this.setState({ answerRankingChoice });
                    }}
                >
                  <View style={styles.listItem}>
                    <Text style={styles.listItemText}>
                      {String.fromCharCode(65 + index)}. {item}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
            );
          })}
        </View>
    );
  }

  openOneChoiceAndInput = (isCompleted, question) => {
    return (
        <>
          {this.openOneChoice(isCompleted, question)}
          {this.openTextInput(isCompleted, question)}
        </>
    )
  }

  renderQuestionAnswer = () => {
    let { campaign, qIndex, isCompleted } = this.state;
    let question = campaign.questions[qIndex];

    if (question.type === QuestionType.INSTRUCTION_QUESTION) {
      return;
    }
    if (question.type === QuestionType.OPEN_TEXT_QUESTION) {
      return this.openTextInput(isCompleted, question)
    }
    if (question.type === QuestionType.ONE_CHOICE_QUESTION) {
      return this.openOneChoice(isCompleted, question)
    }
    if (question.type === QuestionType.MULTIPLE_CHOICE_QUESTION) {
      return this.openMultipleChoice(isCompleted, question)
    }
    if (question.type === QuestionType.RANKING_CHOICE_QUESTION) {
      return this.openRakingChoice(isCompleted, question)
    }
    if (question.type === QuestionType.BLANK_QUESTION) {
      return this.openOneChoiceAndInput(isCompleted, question)
    }
    return <View />;
  };

  renderMedia = ({ item, index }) => {
    let uri = "";
    if (item.downloadUrl) {
      uri = item.downloadUrl;
    } else {
      uri = item.uri;
    }

    return item.type === "image" ? (
      <View style={styles.mediaItem}>
        <FastImage
          source={{ uri }}
          style={styles.media}
          resizeMode={FastImage.resizeMode.contain}
        />
        {!this.state.isCompleted && (
          <TouchableHighlight
            style={styles.mediaCloseBtn}
            onPress={this.removeFromMedias(index)}
            underlayColor="#c3c3c3"
          >
            <Text style={styles.mediaClose}>X</Text>
          </TouchableHighlight>
        )}
      </View>
    ) : (
      <View style={styles.mediaItem}>
        <Video
          ref={(ref) => (this.players[item.id] = ref)}
          source={{ uri }}
          style={styles.media}
          paused={this.state.mediaStates[index]}
          onLoad={()=> {
              let { mediaStates } = this.state;
              mediaStates[index] = true;
              this.setState({ mediaStates });}}
          onLoadStart={() => {
            let { mediaStates } = this.state;
            mediaStates[index] = false;
            this.setState({ mediaStates });
          }}
           onFullscreenPlayerDidDismiss={() => this.stopVideo(index)}
        />
        <View style={styles.mediaOverlay}>
          <TouchableOpacity onPress={() => this.playVideo(index, { uri })}>
            <Ionicons
              name="md-arrow-dropright-circle"
              style={styles.mediaPlayBtn}
            />
          </TouchableOpacity>
        </View>
        {!this.state.isCompleted && (
          <TouchableHighlight
            style={styles.mediaCloseBtn}
            onPress={this.removeFromMedias(index)}
            underlayColor="#c3c3c3"
          >
            <Text style={styles.mediaClose}>X</Text>
          </TouchableHighlight>
        )}
      </View>
    );
  };

  renderMediaAttachment = () => {
    return (
      <View style={styles.mediaAttachment}>
        <TouchableOpacity
          style={styles.mediaUploadBtn}
          disabled={this.state.isCompleted}
          onPress={this.handleUploadMedia}
        >
          <FastImage
            source={UploadIcon}
            style={styles.mediaUploadIcon}
            resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableOpacity>
        {this.state.medias.length > 0 ? (
          <FlatList
            style={styles.mediaList}
            numColumns={2}
            data={this.state.medias}
            renderItem={this.renderMedia}
            keyExtractor={(item) => item.id}
            extraData={this.state}
          />
        ) : (
          <Text style={styles.nomedia}>{I18n.t('noMedia')}</Text>
        )}
      </View>
    );
  };

  reviewResult = (question) => {
    if(question.type === QuestionType.BLANK_QUESTION) {
      let questions = ''
      if(this.state.answerSingleChoice === -1 && this.state.answerText.length === 0) {
        questions = I18n.t('noAnswer')
      } else {
        questions = this.state.answerSingleChoice === -1 ? '' : question.answers[this.state.answerSingleChoice] + '; '
        questions =  questions + (this.state.answerText.length === 0 ? '' :this.state.answerText)
      }
      return (
          <View style={{flexDirection: 'column'}} >
            <Text style={styles.titleResult}>{I18n.t('answer')}:</Text>
            <Text style={styles.textResult}>{questions}</Text>
          </View>
      )
    }
  }

  render() {
    let { campaign, qIndex, answer } = this.state;
    let question = campaign.questions[qIndex];
    let youtubeVideoId = "";
    if (question.media_type === "youtube") {
      let elements = question.media.split("/");
      youtubeVideoId = elements[elements.length - 1];
    }
    let feedback = "";
    if (answer.feedbacks && answer.feedbacks.length > 0) {
      feedback = answer.feedbacks[qIndex];
    }

    return (
      <View style={styles.wrapper}>
        <ProfileHeader
          containerStyle={styles.profile}
          navigation={this.props.navigation}
        />
        <KeyboardAwareScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={120}
        >
          {convertQuestion(question, styles.textOption, styles.wrapQuestion, null)}
          {question.media_type &&
            (question.media_type.includes("image/") ? (
              <FastImage
                source={{ uri: question.media.downloadUrl }}
                style={styles.qImage}
                resizeMode={FastImage.resizeMode.contain}
              />
            ) : question.media_type.includes("video/") ? (
              <View style={styles.qVideoContainer}>
                <Video
                  ref={(ref) => (this.qVideoPlayer = ref)}
                  source={{ uri: question.media.downloadUrl }}
                  style={styles.qVideo}
                  paused={this.state.qVideoPaused}
                  onFullscreenPlayerDidDismiss={this.stopQuestionVideo}
                />
                <View style={styles.qVideoOverlay}>
                  <TouchableOpacity
                    onPress={() =>
                      this.playQuestionVideo({
                        uri: question.media.downloadUrl,
                      })
                    }
                  >
                    <Ionicons
                      name="md-arrow-dropright-circle"
                      style={styles.qVideoPlayBtn}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.qVideoContainer}>
                <YouTube
                  ref={(ref) => (this.youtubePlayer = ref)}
                  apiKey={GOOGLE_API_KEY}
                  videoId={youtubeVideoId}
                  play={false}
                  origin="http://www.youtube.com"
                  // fullscreen={true}
                  loop={false}
                  controls={1}
                  onReady={this.handleReady}
                  onChangeFullscreen={this.handleChangeFullScreen}
                  style={[styles.qVideo, { height: this.state.height }]}
                />
              </View>
            ))}
          {this.renderQuestionAnswer()}
          {this.reviewResult(question)}
          {this.renderMediaAttachment()}
          {answer.completed === "rejected" && feedback !== "" && (
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackTitle}>{I18n.t('feedback')}</Text>
              <Text style={styles.feedbackText}>{feedback}</Text>
            </View>
          )}
          {!this.state.isCompleted ? (
            <View style={styles.btnGroup}>
              <Button
                containerStyle={styles.btnSave}
                text={I18n.t('saveQuestion')}
                textStyle={styles.btnText}
                onPress={this.handleSave}
              />
              <Button
                containerStyle={styles.btnBack}
                text={I18n.t('back')}
                textStyle={styles.btnText}
                onPress={this.handleBack}
              />
            </View>
          ) : (
            <View style={styles.btnGroup}>
              <Button
                containerStyle={styles.btnBack}
                text={I18n.t('back')}
                textStyle={styles.btnText}
                onPress={this.handleBack}
              />
            </View>
          )}
        </KeyboardAwareScrollView>
        <ActionSheet
          ref={(ref) => (this.ActionSheet = ref)}
          title={I18n.t('selectYouWant')}
          options={this.options}
          cancelButtonIndex={4}
          destructiveButtonIndex={3}
          onPress={this.handleActionSheet}
        />
        <VideoModal
          ref={(ref) => (this.videoModalRef = ref)}
          uri={this.state.currentUri}
        />
      </View>
    );
  }
}

QuestionDetailsScreen.contextType = AppContext;

QuestionDetailsScreen.propTypes = {
  navigation: PropTypes.object,
};

export default QuestionDetailsScreen;
