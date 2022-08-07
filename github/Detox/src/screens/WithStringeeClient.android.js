/* eslint-disable no-unused-vars */
import messaging from '@react-native-firebase/messaging';
import React, {Component, createRef} from 'react';
import {Alert, Modal, PermissionsAndroid, View} from 'react-native';
import {StringeeCall2, StringeeClient} from 'stringee-react-native';

import {HELPERS} from '../assets/theme/helpers';
import {logStringee} from '../service/logService';
import {getServerAddresses} from '../service/stringee/getServerAddresses';
import CallScreen from './Call/CallScreen';

class WithStringeeClient extends Component {
  constructor(props) {
    super(props);
    this.stringeeClient = props.stringeeClient;
    this.stringeeCall = createRef();
    this.state = {
      toUserId: '',
      currentUserId: '',
      userId: '',
      callId: '',
      // clientId: null,

      answeredCall: false, // da answer call cua stringee
      isStringeeCall: false,

      // Push notification
      pushToken: '',
      registeredToken: false, // da register push token vs Stringee

      callState: '', // Su dung de hien thi text cho trang thai call

      showCallingView: false,
      hasReceivedLocalStream: false,
      hasReceivedRemoteStream: false,

      enableVideo: false,
      isSpeaker: false,
      isMute: false,
      isVideoCall: false,

      myUserId: '',
      content: '',
      // hasConnected: false,
      convId: 'conv-vn-1-WEETF2N6ZC-1552746203529',
      dateTime: 0,
      sequence: 0,
      isUser1: false,
    };

    this.clientEventHandlers = {
      onConnect: this.clientDidConnect,
      onDisConnect: this.clientDidDisConnect,
      onFailWithError: this.clientDidFailWithError,
      onRequestAccessToken: this.clientRequestAccessToken,
      onIncomingCall: this.callIncomingCall,
      onIncomingCall2: this.callIncomingCall2,
      onCustomMessage: this.clientReceiveCustomMessage,
      onObjectChange: props.onObjectChange,
    };

    this.callEventHandlers = {
      onChangeSignalingState: this.callDidChangeSignalingState,
      onChangeMediaState: this.callDidChangeMediaState,
      onReceiveLocalStream: this.callDidReceiveLocalStream,
      onReceiveRemoteStream: this.callDidReceiveRemoteStream,
      onReceiveDtmfDigit: this.didReceiveDtmfDigit,
      onReceiveCallInfo: this.didReceiveCallInfo,
      onHandleOnAnotherDevice: this.didHandleOnAnotherDevice,
      onAudioDeviceChange: this.didAudioDeviceChange, ///only available on android
    };
  }

  componentDidMount() {
    const {token} = this.props;
    this.stringeeClient.current.connect(token);
  }

  componentWillUnmount() {
    this.stringeeClient.current.disconnect();
    this.props.setConnected(false);
  }

  registerPusNotification = () => {
    messaging()
      .getToken()
      .then(token => {
        this.props.setDeviceToken(token);
      });
    messaging().onTokenRefresh(token => {
      this.props.setDeviceToken(token);
    });
  };

  clientDidConnect = ({userId}) => {
    logStringee('_clientDidConnect - ' + userId);
    this.setState({
      currentUserId: userId,
      // hasConnected: true,
      // clientId: this.stringeeClient.current.getId(),
    });
    this.props.setConnected(true);
    this.registerPusNotification();
  };

  // The client disconnects from Stringee server
  clientDidDisConnect = data => {
    logStringee('_clientDidDisConnect', data);
    // this.setState({
    //   hasConnected: false,
    // });
    this.stringeeClient?.current?.disconnect();
    this.props.setConnected(false);
  };

  // The client fails to connects to Stringee server
  clientDidFailWithError = ({code, message}) => {
    logStringee('_clientDidFailWithError \ncode-' + code + ' message-' + message);
  };

  // Access token is expired. A new access token is required to connect to Stringee server
  clientRequestAccessToken = () => {
    logStringee('_clientRequestAccessToken');
  };

  // Receive custom message
  clientReceiveCustomMessage = ({data}) => {
    logStringee('clientReceiveCustomMessage', data);
    try {
      const {avatar} = JSON.parse(data);
      this.setState({avatar});
    } catch (error) {}
  };

  // IncomingCall event

  callIncomingCall = ({callId, from, to, fromAlias, toAlias, callType, isVideoCall}) => {
    logStringee('callIncomingCall', {callId, from, to, fromAlias, toAlias, callType, isVideoCall});
  };

  callIncomingCall2 = async ({
    callId,
    from,
    to,
    fromAlias,
    toAlias,
    callType,
    isVideoCall,
    customDataFromYourServer,
    serial,
  }) => {
    logStringee('callIncomingCall2', {
      callId,
      from,
      to,
      fromAlias,
      toAlias,
      callType,
      isVideoCall,
      customDataFromYourServer,
      serial,
    });

    await checkPermissions();

    this.setState({
      userId: from,
      callState: 'Incoming Call',
      showCallingView: true,
      callId: callId,
      isStringeeCall: true,
      isVideoCall: isVideoCall,
      enableVideo: isVideoCall,
      isSpeaker: isVideoCall,
    });

    this.stringeeCall.current.initAnswer(callId, (status, code, message) => {
      logStringee('initAnswer ' + message);
    });
  };

  /// MARK: - CALL EVENT HANDLER
  // Invoked when the call signaling state changes
  callDidChangeSignalingState = ({callId, code, reason, sipCode, sipReason}) => {
    logStringee(
      '_callDidChangeSignalingState ' +
        '\ncallId-' +
        callId +
        '\ncode-' +
        code +
        '\nreason-' +
        reason +
        '\nsipCode-' +
        sipCode +
        '\nsipReason-' +
        sipReason,
    );

    this.setState({
      callState: reason,
    });

    switch (code) {
      case 3: // Rejected
      case 4: // Ended
        this.endCallAndUpdateView();
        break;
    }
  };

  // Invoked when the call media state changes
  callDidChangeMediaState = ({callId, code, description}) => {
    logStringee(
      '_callDidChangeMediaState' +
        ' callId-' +
        callId +
        'code-' +
        code +
        ' description-' +
        description,
    );
    switch (code) {
      case 0:
        this.setState({callState: 'Started'});
        break;
      case 1:
        break;
    }
    this.stringeeCall.current.setSpeakerphoneOn(
      callId,
      this.state.isSpeaker,
      // eslint-disable-next-line no-shadow
      (status, code, message) => {
        logStringee(message);
      },
    );
  };

  // Invoked when the local stream is available
  callDidReceiveLocalStream = ({callId}) => {
    logStringee('_callDidReceiveLocalStream ' + callId);
    this.setState({hasReceivedLocalStream: true});
  };
  // Invoked when the remote stream is available
  callDidReceiveRemoteStream = ({callId}) => {
    logStringee('_callDidReceiveRemoteStream ' + callId);
    this.setState({hasReceivedRemoteStream: true});
  };

  // Invoked when receives a DMTF
  didReceiveDtmfDigit = ({callId, dtmf}) => {
    logStringee('_didReceiveDtmfDigit ' + callId + ' &dtmf: ' + dtmf);
  };

  // Invoked when receives info from other clients
  didReceiveCallInfo = ({callId, data}) => {
    logStringee('_didReceiveCallInfo: ' + callId + ' data: ' + data);
  };

  // Invoked when the call is handled on another device
  didHandleOnAnotherDevice = ({callId, code, description}) => {
    logStringee('_didHandleOnAnotherDevice ' + callId + '***' + code + '***' + description);
  };

  // Invoked when audio device has change
  didAudioDeviceChange = ({selectedAudioDevice, availableAudioDevices}) => {
    logStringee(
      '_didHandleOnAnotherDevice selectedAudioDevice-k' +
        selectedAudioDevice +
        ' availableAudioDevices-' +
        availableAudioDevices,
    );
  };

  // Action handler

  makeCall = async ({from, to, fullName, avatar, isVideoCall, onSuccess, onError}) => {
    await checkPermissions();

    const myObj = {
      from: from ?? this.state.currentUserId, // caller
      to: to, // callee
      isVideoCall: isVideoCall, // Cuộc gọi là video call hoặc voice call
      videoResolution: 'HD', // chất lượng hình ảnh 'NORMAL' hoặc 'HD'. Mặc định là 'NORMAL'.
    };
    const parameters = JSON.stringify(myObj);
    logStringee('makeCall', myObj);

    setTimeout(() => {
      this.stringeeCall.current.makeCall(parameters, (status, code, message, callId) => {
        logStringee('makeCall', {status, code, message, callId});

        if (status) {
          this.setState({
            showCallingView: true,
            callId: callId,
            // userId: this.state.toUserId,
            userId: fullName,
            avatar: avatar,
            answeredCall: true,
            callState: 'Outgoing Call',
            isVideoCall: isVideoCall,
            enableVideo: isVideoCall,
            isSpeaker: isVideoCall,
          });
          onSuccess(callId);
        } else {
          onError(status);
        }
      });
    }, 100);
  };

  endCallAndUpdateView = () => {
    // reset trang thai va view
    this.setState({
      callState: 'Ended',
    });

    setTimeout(() => {
      this.setState({
        showCallingView: false,
        hasReceivedLocalStream: false,
        hasReceivedRemoteStream: false,
        answeredCall: false,
        enableVideo: false,
        isSpeaker: false,
        isMute: false,
        isVideoCall: false,
      });
    }, 500);
  };

  endCallAction = (isHangUp: boolean) => {
    if (isHangUp) {
      this.stringeeCall.current.hangup(this.state.callId, (status, code, message) => {
        logStringee('Stringee code 3');
        this.endCallAndUpdateView();
      });
    } else {
      this.stringeeCall.current.reject(this.state.callId, (status, code, message) => {
        logStringee('Stringee code 4');
        this.endCallAndUpdateView();
      });
    }
  };

  answerCallAction = () => {
    this.stringeeCall.current.answer(this.state.callId, (status, code, message) => {
      this.setState({answeredCall: true});
      logStringee('call did answer ' + code + '-status' + status + ' - message: ' + message);
      // if (status) {
      //   Sucess
      // } else {
      //   Fail
      // }
    });
  };

  muteAction = () => {
    this.stringeeCall.current.mute(
      this.state.callId,
      !this.state.isMute,
      (status, code, message) => {
        this.setState({isMute: !this.state.isMute});
      },
    );
  };

  speakerAction = () => {
    this.stringeeCall.current.setSpeakerphoneOn(
      this.state.callId,
      !this.state.isSpeaker,
      (status, code, message) => {
        this.setState({isSpeaker: !this.state.isSpeaker});
      },
    );
  };

  enableVideoAction = () => {
    this.stringeeCall.current.enableVideo(
      this.state.callId,
      !this.state.enableVideo,
      (status, code, message) => {
        this.setState({enableVideo: !this.state.enableVideo});
      },
    );
  };

  switchCameraAction = () => {
    this.stringeeCall.current.switchCamera(this.state.callId, (status, code, message) => {
      logStringee(message);
    });
  };

  sendDTMF = dtmf => {
    const callId = this.state.callId;
    this.stringeeCall.current.sendDTMF(callId, dtmf, (status, code, message) => {
      logStringee('sendDTMF', {status, code, message});
    });
  };

  render() {
    const {getClientId} = this.props;
    const {showCallingView} = this.state;
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={showCallingView}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          {this.state.showCallingView && (
            <View style={HELPERS.fill}>
              <CallScreen
                hasLocalStream={this.state.hasReceivedLocalStream}
                hasRemoteStream={this.state.hasReceivedRemoteStream}
                stringeeCallId={this.state.callId}
                userId={this.state.userId}
                avatar={this.state.avatar}
                isAnswered={this.state.answeredCall}
                callState={this.state.callState}
                isVideoCall={this.state.isVideoCall}
                endButtonHandler={() => {
                  this.endCallAction(true);
                }}
                rejectButtonHandler={() => {
                  this.endCallAction(false);
                }}
                acceptButtonHandler={this.answerCallAction}
                switchCameraHandler={this.switchCameraAction}
                isSpeaker={this.state.isSpeaker}
                speakerButtonHandler={this.speakerAction}
                isMute={this.state.isMute}
                muteButtonHandler={this.muteAction}
                enableVideo={this.state.enableVideo}
                enableVideoButtonHandler={this.enableVideoAction}
                enabledAnimation
                sendDTMF={this.sendDTMF}
              />
            </View>
          )}
        </Modal>

        <View>
          <StringeeClient
            ref={this.stringeeClient}
            eventHandlers={this.clientEventHandlers}
            {...getServerAddresses()}
          />
          {!!getClientId() && (
            <StringeeCall2
              ref={this.stringeeCall}
              clientId={getClientId()}
              eventHandlers={this.callEventHandlers}
            />
          )}
        </View>
      </View>
    );
  }
}

export default WithStringeeClient;

const checkPermissions = async () => {
  try {
    const userResponse = PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    return userResponse;
  } catch (error) {
    logStringee('permission', error);
  }
};
