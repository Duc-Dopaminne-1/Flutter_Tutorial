import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, Text } from 'react-native';
import PropTypes from 'prop-types';
import { GiftedChat, Actions } from 'react-native-gifted-chat';
import firebase from 'react-native-firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppContext, ProfileHeader } from 'app/components';
import { AuthController, MessageController } from 'app/controllers';
import styles from './styles';
import MessageVideo from './MessageVideo';
import SystemMessage from './SystemMessage';
import I18n from 'app/i18n'

const store = firebase.firestore();
const collection = store.collection('conversation');

class ConversationScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props.navigation.state.params,
      messages: [],
      host: {
        _id: 1,
        name: 'Julie',
        avatar: 'https://firebasestorage.googleapis.com/v0/b/social-lens-3a3d5.appspot.com/o/avatar%2Fjulie.jpeg?alt=media&token=5c0190b0-2fed-4595-8f8a-60e124981352'
      },
      user: null,
      unsubscribe: () => {}
    };

    this.players = {};
  }

  async componentDidMount() {
    this.context.showLoading();
    let user = await AuthController.getUser();
    if ( user.avatar ) {
      this.setState({
        user: {
          _id: user.id,
          name: user.firstName + ' ' + user.lastName,
          avatar: user.avatar
        }
      });
    } else {
      this.setState({
        user: {
          _id: user.id,
          name: user.firstName + ' ' + user.lastName
        }
      });
    }
    await this.initializeMessages(this.state.campaign);
  }

  goBack = () => {
    this.state.unsubscribe();
    this.props.navigation.goBack();
    this.state.reload();
  };

  initializeMessages = async (campaign) => {
    // reading messages
    let conversationRef = collection.doc(campaign.id);
    let doc = await conversationRef.get();
    if ( doc.exists ) {
      let unsubscribe = conversationRef.onSnapshot(snapshot => {
        let messages = snapshot.data().messages;

        // add questions
        let questionMessages = [];
        campaign.questions.map((question, index) => {
          let message = {
            _id: index + 1,
            text: question.question,
            user: this.state.host
          };
          if ( question.media_type ) {
            if ( question.media_type === 'youtube' ) {
              message.video = question.media;
              message.videoType = 'youtube';
            } else if ( question.media_type.includes('video') ) {
              message.video = question.media.downloadUrl;
              message.videoType = 'video';
            } else if ( question.media_type.includes('image') ) {
              message.image = question.media.downloadUrl;
            }
          }
          questionMessages.unshift(message);
        });
        messages = messages.concat(questionMessages);
        // messages.push({
        //   _id: 0,
        //   system: true
        // });
        this.setState({
          messages
        });
      });
      this.setState({
        unsubscribe
      });
      this.context.hideLoading();
    } else {
      // add questions
      let messages = [];
      campaign.questions.map((question, index) => {
        let message = {
          _id: index + 1,
          text: question.question,
          user: this.state.host
        };
        if ( question.media_type ) {
          if ( question.media_type === 'youtube' ) {
            message.video = question.media;
            message.videoType = 'youtube';
          } else if ( question.media_type.includes('video') ) {
            message.video = question.media.downloadUrl;
            message.videoType = 'video';
          } else if ( question.media_type.includes('image') ) {
            message.image = question.media.downloadUrl;
          }
        }
        messages.unshift(message);
      });
      // messages.push({
      //   _id: 0,
      //   system: true
      // });
      this.setState({
        messages
      });
      this.context.hideLoading();
    }
  };

  onSend = async (messages = []) => {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
    await MessageController.sendMessage(messages[0], this.state.campaign.id);
  }

  onAction = (index, props) => {
    switch(index) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      break;
    case 3:
      break;
    default:
      break;
    }
  };

  clone = (obj) => Object.assign({}, obj);

  renameKey = (object, key, newKey) => {
    const clonedObj = this.clone(object);
    const targetKey = clonedObj[key];
    delete clonedObj[key];
    clonedObj[newKey] = targetKey;
    return clonedObj;
  };

  renderCustomActions = (props) => {
    let options = {
      'Record a video': (props) => this.onAction(0, props),
      'Take a photo': (props) => this.onAction(1, props),
      'Select a video from library': (props) => this.onAction(2, props),
      'Select an image from library': (props) => this.onAction(3, props),
      'Cancel': () => {},
    };
    options = this.renameKey(options, 'Record a video', I18n.t('recordVideo'));
    options = this.renameKey(options, 'Take a photo', I18n.t('takeAPhoto'));
    options = this.renameKey(options, 'Select a video from library', I18n.t('selectVideoLibrary'));
    options = this.renameKey(options, 'Select an image from library', I18n.t('selectImageLibrary'));
    options = this.renameKey(options, 'Cancel', I18n.t('cancel'));

    return (
      <Actions
        {...props}
        options={options}
      />
    );
  };

  render() {
    let { campaign, answer, category, messages, user } = this.state;
    let bgColorStyle = { backgroundColor: category.color };

    return(
      <View style={styles.wrapper}>
        <ProfileHeader 
          containerStyle={ styles.profile } 
          navigation={this.props.navigation}
        />
        <TouchableWithoutFeedback onPress={this.goBack}>
          <View style={[ styles.header, bgColorStyle ]}>
            <View style={ styles.icon }>
              <Ionicons 
                name='md-arrow-back' 
                color='#fff'
                size={24}
              />
            </View>
            <Text style={ styles.title }>{category.label}</Text>
          </View>
        </TouchableWithoutFeedback>
        <GiftedChat
          showUserAvatar={true}
          label={I18n.t('send')}
          messages={messages}
          onSend={messages => this.onSend(messages)}
          user={user}
           renderActions={this.renderCustomActions}
          renderSystemMessage={props =>
            <SystemMessage
              campaign={campaign}
              answer={answer}
              category={category}
            />
          }
          renderMessageVideo={props => <MessageVideo {...props} />}
        />
      </View>
    );
  }
}

ConversationScreen.contextType = AppContext;

ConversationScreen.propTypes = {
  navigation: PropTypes.object
};

export default ConversationScreen;