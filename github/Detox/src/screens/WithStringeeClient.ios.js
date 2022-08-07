/* eslint-disable no-unused-vars */
import React, {Component, createRef} from 'react';
import {Alert, AppState, Modal, View} from 'react-native';
import RNCallKeep from 'react-native-callkeep';
import uuid from 'react-native-uuid';
import VoipPushNotification from 'react-native-voip-push-notification';
import {StringeeCall2, StringeeClient, StringeeServerAddress} from 'stringee-react-native';

import {HELPERS} from '../assets/theme/helpers';
import Configs from '../configs';
import {logStringee} from '../service/logService';
import {getServerAddresses} from '../service/stringee/getServerAddresses';
import CallScreen from './Call/CallScreen';
import SyncCall from './Call/SyncCall';

const options = {
  ios: {
    appName: 'Stringee',
    includesCallsInRecents: false,
  },
};

class WithStringeeClient extends Component {
  constructor(props) {
    super(props);
    this.stringeeClient = props.stringeeClient;
    this.stringeeCall = createRef();
    this.state = {
      appState: AppState.currentState,

      toUserId: 'user2',
      // toUserId: '',
      currentUserId: '',
      userId: '',

      syncCall: null,
      allSyncCalls: [], // luu lai tat ca cac sync da tung xu ly
      fakeCallIds: [], // luu uuid cua tat ca fake call da show
      endTimeout: null,

      answeredCall: false, // da answer call cua stringee
      isActivateAudioSession: false,

      callId: '',
      callState: '', // Su dung de hien thi text cho trang thai call

      showCallingView: false,
      hasReceivedLocalStream: false,
      hasReceivedRemoteStream: false,

      enableVideo: true,
      isSpeaker: false,
      isMute: false,

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
      onObjectChange: props.onObjectChange,
      onCustomMessage: this.clientReceiveCustomMessage,
    };

    this.callEventHandlers = {
      onChangeSignalingState: this.callDidChangeSignalingState,
      onChangeMediaState: this.callDidChangeMediaState,
      onReceiveLocalStream: this.callDidReceiveLocalStream,
      onReceiveRemoteStream: this.callDidReceiveRemoteStream,
      onReceiveDtmfDigit: this.didReceiveDtmfDigit,
      onReceiveCallInfo: this.didReceiveCallInfo,
      onHandleOnAnotherDevice: this.didHandleOnAnotherDevice,
    };

    RNCallKeep.setup(options);
    RNCallKeep.setAvailable(true);
    // VoipPushNotification.requestPermissions();
    // VoipPushNotification.registerVoipToken();
  }

  /// MARK: - CONNECT EVENT HANDLER
  // The client connects to Stringee server
  clientDidConnect = ({userId}) => {
    logStringee('_clientDidConnect - ' + userId);
    this.setState({
      currentUserId: userId,
      // hasConnected: true,
    });
    this.props.setConnected(true);

    /*
          Handle cho truong hop A goi B, nhung A end call rat nhanh, B nhan duoc push nhung khong nhan duoc incoming call
          ==> Sau khi ket noi den Stringee server 3s ma chua nhan duoc cuoc goi thi xoa Callkit Call va syncCall
        **/
    this.startEndTimeout();
    // this.registerTokenForStringee();
    // Fix loi A goi B, nhung A End luon
  };

  // The client disconnects from Stringee server
  clientDidDisConnect = data => {
    logStringee('clientDidDisConnect', data);
    this.props.setConnected(false);
    this.stopEndTimeout();
  };

  // The client fails to connects to Stringee server
  clientDidFailWithError = error => {
    logStringee('clientDidFailWithError', error);
  };

  // Access token is expired. A new access token is required to connect to Stringee server
  clientRequestAccessToken = data => {
    logStringee('clientRequestAccessToken', data);
    // this.refs.client.connect('NEW_YOUR_ACCESS_TOKEN');
  };

  // IncomingCall event

  callIncomingCall = ({callId, from, to, fromAlias, toAlias, callType, isVideoCall}) => {
    logStringee('callIncomingCall', callId, from, to, fromAlias, toAlias, callType, isVideoCall);
  };

  callIncomingCall2 = ({
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

    let newSyncCall;
    // Alert.alert('_callIncomingCall');

    this.setState({
      userId: from,
      callState: 'Incoming Call',
    });

    // Chua show callkit thi show
    if (this.state.syncCall == null) {
      logStringee('Call + Show new call kit');
      newSyncCall = new SyncCall();
      newSyncCall.callId = callId;
      newSyncCall.serial = serial;
      newSyncCall.callkitId = uuid.v1();
      newSyncCall.receivedStringeeCall = true;
      newSyncCall.isVideoCall = isVideoCall;

      // Callkit
      RNCallKeep.displayIncomingCall(newSyncCall.callkitId, 'Stringee', fromAlias, 'generic', true);

      // Call screen
      this.setState({
        syncCall: newSyncCall,
        showCallingView: true,
      });

      this.stringeeCall.current.initAnswer(callId, (status, code, message) => {
        logStringee('initAnswer', {callId, status, code, message});
      });

      this.answerCallAction();
      return;
    }

    // Cuoc goi moi toi khong phai la current sync call
    // Alert.alert('INCOMING CALL, callId: ' + this.state.syncCall.callId + ' serial: ' + this.state.syncCall.serial);

    if (!this.state.syncCall.isThisCall(callId, serial)) {
      logStringee('INCOMING CALL -> REJECT, CUOC GOI MOI KHONG TRUNG VOI SYNC CALL');
      this.stringeeCall.current.reject(callId, (status, code, message) => {
        logStringee('reject', {callId, status, code, message});
      });
      return;
    }

    if (this.state.syncCall.rejected) {
      // nguoi dung da click nut reject cuoc goi
      logStringee('INCOMING CALL -> REJECT, NGUOI DUNG DA REJECT CUOC GOI');
      this.stringeeCall.current.reject(callId, (status, code, message) => {
        logStringee('reject', {callId, status, code, message});
      });
      return;
    }

    // Da show callkit => update UI
    if (this.state.syncCall.callkitId !== '') {
      logStringee('Call + Update');
      RNCallKeep.updateDisplay(this.state.syncCall.callkitId, fromAlias, '');

      newSyncCall = this.state.syncCall;
      newSyncCall.callId = callId;
      newSyncCall.receivedStringeeCall = true;
      newSyncCall.isVideoCall = isVideoCall;

      this.setState({
        syncCall: newSyncCall,
        showCallingView: true,
      });

      this.stringeeCall.current.initAnswer(callId, (status, code, message) => {
        logStringee('initAnswer', {callId, status, code, message});
      });

      this.answerCallAction();
      return;
    }

    // Chua show callkit thi show
    newSyncCall = this.state.syncCall;
    newSyncCall.callId = callId;
    newSyncCall.serial = serial;
    newSyncCall.callkitId = uuid.v1();
    newSyncCall.receivedStringeeCall = true;
    newSyncCall.isVideoCall = isVideoCall;

    // Callkit
    RNCallKeep.displayIncomingCall(newSyncCall.callkitId, 'Stringee', fromAlias, 'generic', true);

    // Call screen
    this.setState({
      syncCall: newSyncCall,
      showCallingView: true,
    });

    this.stringeeCall.current.initAnswer(callId, (status, code, message) => {
      logStringee('initAnswer', {status, code, message});
    });

    this.answerCallAction();
  };

  clientReceiveCustomMessage = ({data}) => {
    logStringee('clientReceiveCustomMessage', data);
    try {
      const {avatar} = JSON.parse(data);
      this.setState({avatar});
    } catch (error) {}
  };

  /// MARK: - CALL EVENT HANDLER
  // Invoked when the call signaling state changes
  callDidChangeSignalingState = ({callId, code, reason, sipCode, sipReason}) => {
    logStringee('callDidChangeSignalingState', {callId, code, reason, sipCode, sipReason});
    if (this.state.syncCall != null) {
      const newSyncCall = this.state.syncCall;
      newSyncCall.callCode = code;

      // Neu la end hoac reject call thi cap nhat trang thai endedStringeeCall cho sync call
      if (code === 3 || code === 4) {
        newSyncCall.endedStringeeCall = true;
      }

      this.setState({
        callState: reason,
        syncCall: newSyncCall,
      });
    } else {
      this.setState({
        callState: reason,
      });
    }

    switch (code) {
      case 3: // Rejected
      case 4: // Ended
        this.endCallAndUpdateView();
        break;
    }
  };

  // Invoked when the call media state changes
  callDidChangeMediaState = ({callId, code, description}) => {
    logStringee('callDidChangeMediaState', {callId, code, description});
    switch (code) {
      case 0:
        this.setState({callState: 'Started'});
        break;
      case 1:
        break;
    }

    this.stringeeCall.current.setSpeakerphoneOn(
      this.state.currentStringeeCallId,
      true,
      // eslint-disable-next-line no-shadow
      (status, code, message) => {
        logStringee('setSpeakerphoneOn', {status, code, message});
      },
    );
  };

  // Invoked when the local stream is available
  callDidReceiveLocalStream = ({callId}) => {
    logStringee(`_callDidReceiveLocalStream ${callId}`);
    this.setState({hasReceivedLocalStream: true});
  };

  // Invoked when the remote stream is available
  callDidReceiveRemoteStream = ({callId}) => {
    logStringee(`_callDidReceiveRemoteStream ${callId}`);
    this.setState({hasReceivedRemoteStream: true});
  };

  // Invoked when receives a DMTF
  didReceiveDtmfDigit = ({callId, dtmf}) => {
    logStringee('didReceiveDtmfDigit', {callId, dtmf});
  };

  // Invoked when receives info from other clients
  didReceiveCallInfo = ({callId, data}) => {
    logStringee('didReceiveCallInfo', {callId, data});
  };

  // Invoked when the call is handled on another device
  didHandleOnAnotherDevice = ({callId, code, description}) => {
    logStringee('didHandleOnAnotherDevice', {callId, code, description});
  };

  // Action handler

  makeCall = ({from, to, fullName, avatar, isVideoCall, onSuccess, onError}) => {
    const myObj = {
      from: from ?? this.state.currentUserId, // caller
      to: to, // callee
      isVideoCall: isVideoCall, // Cuộc gọi là video call hoặc voice call
      videoResolution: 'HD', // chất lượng hình ảnh 'NORMAL' hoặc 'HD'. Mặc định là 'NORMAL'.
    };
    const parameters = JSON.stringify(myObj);
    logStringee('makeCall', myObj);

    this.stringeeCall.current.makeCall(parameters, (status, code, message, callId) => {
      logStringee('makeCall', {status, code, message, callId});

      if (status) {
        const newSyncCall = new SyncCall();
        newSyncCall.callId = callId;
        newSyncCall.callCode = 0;
        newSyncCall.answered = true;
        newSyncCall.isVideoCall = isVideoCall;

        this.setState({
          syncCall: newSyncCall,
          showCallingView: true,
          userId: fullName,
          avatar,
          answeredCall: true,
          callId,
          callState: 'Outgoing Call',
        });
        onSuccess(callId);
      } else {
        onError(status);
      }
    });
  };

  endCallAndUpdateView = () => {
    // End callkit call
    if (this.state.syncCall != null && this.state.syncCall.callkitId !== '') {
      RNCallKeep.endCall(this.state.syncCall.callkitId);
    }

    // End tat ca ongoing call cho chac
    RNCallKeep.endAllCalls();

    // reset trang thai va view
    this.setState({
      callState: 'Ended',
    });

    // Xoa sync call neu can
    this.deleteSyncCallIfNeed();

    // Show CallScreen them 0.5s de hien thi trang thai ended (Cho giong native call cua ios)
    setTimeout(() => {
      this.setState({
        showCallingView: false,
        hasReceivedLocalStream: false,
        hasReceivedRemoteStream: false,
        isActivateAudioSession: false,
        answeredCall: false,
        enableVideo: true,
        isSpeaker: false,
        isMute: false,
      });
    }, 500);
  };

  deleteSyncCallIfNeed = () => {
    if (this.state.syncCall == null) {
      logStringee('SyncCall is deleted');
      return;
    }

    if (this.state.syncCall.isEnded()) {
      // cache lai call da xu ly
      this.addSyncCallToCacheArray(this.state.syncCall);

      this.setState({
        syncCall: null,
      });
    } else {
      logStringee(
        'deleteSyncCallIfNeed, endedCallkit: ' +
          this.state.syncCall.endedCallkit +
          ' endedStringeeCall: ' +
          this.state.syncCall.endedStringeeCall,
      );
    }
  };

  addSyncCallToCacheArray = sCall => {
    // Xoa call cu neu da save
    const newAllSyncCalls = this.state.allSyncCalls.filter(
      call => !(call.callId === sCall.callId && call.serial === sCall.serial),
    );

    newAllSyncCalls.push(sCall);
    this.setState({
      allSyncCalls: newAllSyncCalls,
    });
  };

  removeSyncCallInCacheArray = (callId, serial) => {
    // Xoa call cu neu da save
    const newAllSyncCalls = this.state.allSyncCalls.filter(
      call => !(call?.callId === callId && call.serial === serial),
    );

    this.setState({
      allSyncCalls: newAllSyncCalls,
    });
  };

  // Kiem tra xem call da duoc xu ly lan nao chua
  handledCall = (callId, serial) => {
    // Xoa call cu neu da save
    const newAllSyncCalls = this.state.allSyncCalls.filter(
      call => call?.callId === callId && call.serial === serial,
    );
    return newAllSyncCalls != null && newAllSyncCalls.length > 0;
  };

  answerCallAction = () => {
    /*
          Voi iOS, Answer StringeeCall khi thoa man cac yeu to:
          1. Da nhan duoc su kien onIncomingCall (có callId)
          2. User da click answer
          3. Chua goi ham answer cua StringeeCall lan nao
          3. AudioSession da active
        **/
    if (
      this.state?.syncCall == null ||
      this.state?.syncCall?.callId === '' ||
      !this.state?.isActivateAudioSession ||
      !this.state?.syncCall.answered ||
      this.state?.answeredCall
    ) {
      logStringee(
        'Chua du dieu kien de answer call, AudioSessionActived: ' +
          this.state?.isActivateAudioSession +
          ' - syncCall: ' +
          this.state?.syncCall +
          ' - syncCall.callId: ' +
          this.state?.syncCall?.callId +
          ' - AnsweredAction: ' +
          this.state?.syncCall?.answered +
          ' - AnsweredCall: ' +
          this.state?.answeredCall,
      );

      return;
    }

    this.stringeeCall.current.answer(this.state.syncCall?.callId, (status, code, message) => {
      logStringee('answer', {status, code, message});
      this.setState({answeredCall: true});
      // if (status) {
      //   Sucess
      // } else {
      //   Fail
      // }
    });
  };

  showFakeCall = () => {
    // rule moi cua apple la nhan duoc Voip push bat buoc phai show callkit => voi cac truong hop khong can thiet thi show roi end luon
    const callKitUUID = uuid.v1();
    RNCallKeep.displayIncomingCall(callKitUUID, 'Stringee', 'CallEnded', 'generic', true);
    const newFakeCallIds = this.state.fakeCallIds.push(callKitUUID);
    this.setState({fakeCallIds: newFakeCallIds});
    logStringee(
      'SHOW FAKE CALL, UUID: ' + callKitUUID + ' fakeCallIds: ' + this.state.fakeCallIds.toString,
    );
  };

  startEndTimeout = () => {
    if (this.state.endTimeout == null || this.state.syncCall != null) {
      const endTimeout = setTimeout(() => {
        if (this.state.syncCall == null) {
          return;
        }

        // Sau 3s tu khi connected ma chua nhan duoc call thi end call
        if (!this.state.syncCall.receivedStringeeCall) {
          // End callkit
          if (this.state.syncCall.callkitId !== '') {
            RNCallKeep.endCall(this.state.syncCall.callkitId);
          }
          this.addSyncCallToCacheArray(this.state.syncCall);

          this.setState({
            syncCall: null,
          });
        }
      }, 5000);

      this.setState({
        endTimeout: endTimeout,
      });
    }
  };

  stopEndTimeout = () => {
    if (this.state.endTimeout != null) {
      clearTimeout(this.state.endTimeout);
      this.setState({
        endTimeout: null,
        // hasConnected: false,
      });
    }
  };

  muteAction = () => {
    if (this.state.syncCall == null || this.state.syncCall.callId === '') {
      return;
    }

    this.stringeeCall.current.mute(
      this.state.syncCall.callId,
      !this.state.isMute,
      (status, code, message) => {
        logStringee('mute', {status, code, message});
        this.setState({isMute: !this.state.isMute});
        if (this.state.syncCall != null && this.state.syncCall.callkitId !== '') {
          RNCallKeep.setMutedCall(this.state.syncCall.callkitId, this.state.isMute);
        }
      },
    );
  };

  speakerAction = () => {
    if (this.state.syncCall == null || this.state.syncCall.callId === '') {
      return;
    }

    this.stringeeCall.current.setSpeakerphoneOn(
      this.state.syncCall?.callId,
      !this.state.isSpeaker,
      (status, code, message) => {
        logStringee('setSpeakerphoneOn', {status, code, message});
        this.setState({isSpeaker: !this.state.isSpeaker});
      },
    );
  };

  enableVideoAction = () => {
    if (this.state.syncCall == null || this.state.syncCall?.callId === '') {
      return;
    }

    this.stringeeCall.current.enableVideo(
      this.state.syncCall?.callId,
      !this.state.enableVideo,
      (status, code, message) => {
        this.setState({enableVideo: !this.state.enableVideo});
      },
    );
  };

  switchCameraAction = () => {
    if (this.state.syncCall == null || this.state.syncCall?.callId === '') {
      return;
    }

    this.stringeeCall.current.switchCamera(this.state.syncCall?.callId, (status, code, message) => {
      logStringee(message);
    });
  };

  componentDidMount() {
    this.stringeeClient.current.connect(this.props.token);
    this.addEventListeners();
  }

  componentWillUnmount() {
    this.stringeeClient.current.disconnect();
    this.props.setConnected(false);
    //   VoipPushNotification.removeEventListener('register');
    //   VoipPushNotification.removeEventListener('notification');
    //   RNCallKeep.removeEventListener('didDisplayIncomingCall');
    //   RNCallKeep.removeEventListener('didActivateAudioSession');
    //   RNCallKeep.removeEventListener('didReceiveStartCallAction');
    //   RNCallKeep.removeEventListener('didPerformSetMutedCallAction');
    //   RNCallKeep.removeEventListener('answerCall');
    //   RNCallKeep.removeEventListener('endCall');
  }

  addEventListeners = () => {
    VoipPushNotification.addEventListener('register', token => {
      logStringee('LAY DUOC VOIP TOKEN: ' + token);
      this.props.setDeviceToken(token);
    });

    VoipPushNotification.addEventListener('notification', notification => {
      const callKitUUID = notification.uuid;
      const callSerial = notification.serial;
      const callId = notification?.callId;
      logStringee(
        'Notification CallSerial: ' + callSerial + ' callId: ' + callId + 'uuid: ' + callKitUUID,
      );
      // Neu call da duoc xu ly roi thi end callkit vua show
      if (this.handledCall(callId, callSerial)) {
        RNCallKeep.endCall(callKitUUID);
        this.removeSyncCallInCacheArray(callId, callSerial);
        this.deleteSyncCallIfNeed();
        return;
      }

      // Chua co sync call thi tao
      if (this.state.syncCall == null) {
        // Chua co call thi khoi tao
        const newSyncCall = new SyncCall();
        newSyncCall.callId = callId;
        newSyncCall.serial = callSerial;
        newSyncCall.callkitId = callKitUUID;
        this.setState({syncCall: newSyncCall});
        return;
      }

      // Co sync call roi nhung thong tin cuoc goi khong trung khop => end callkit vua show
      if (!this.state.syncCall.isThisCall(callId, callSerial)) {
        logStringee('END CALLKIT KHI NHAN DUOC PUSH, PUSH MOI KHONG PHAI SYNC CALL');
        RNCallKeep.endCall(callKitUUID);
        return;
      }

      // Co sync call roi + thong tin cuoc goi trung khop nhung da show callkit roi => end callkit vua show
      if (this.state.syncCall.showedCallkit() && !this.state.syncCall.showedFor(callKitUUID)) {
        logStringee('END CALLKIT KHI NHAN DUOC PUSH, SYNC CALL DA SHOW CALLKIT');
        RNCallKeep.endCall(callKitUUID);
      }

      // if (this.state.currentCallKitId == '') {
      //   logStringee('set uuid: ' + callKitUUID);
      //   this.setState({ currentCallKitId: callKitUUID });
      // } else {
      //   // if Callkit already exists then end Callkit wiht the callKitUUID
      //   logStringee('end call uuid: ' + callKitUUID);
      //   RNCallKeep.endCall(callKitUUID);
      // }
    });

    RNCallKeep.addEventListener(
      'didDisplayIncomingCall',
      ({error, callUUID, handle, localizedCallerName, hasVideo, fromPushKit, payload}) => {
        // Call back khi show callkit cho incoming call thanh cong, end fakeCall da show o day
        if (this.state?.fakeCallIds.includes(callUUID)) {
          RNCallKeep.endCall(callUUID);
          // eslint-disable-next-line no-shadow
          const newFakeCallIds = this.state?.fakeCallIds.filter(uuid => uuid !== callUUID);
          this.setState({fakeCallIds: newFakeCallIds});
          logStringee(
            'END FAKE CALL, UUID: ' +
              callUUID +
              ' fakeCallIds: ' +
              this.state?.fakeCallIds.toString,
          );
        }

        this.deleteSyncCallIfNeed();
      },
    );

    RNCallKeep.addEventListener('didActivateAudioSession', data => {
      this.setState({isActivateAudioSession: true});
      this.answerCallAction();
    });

    RNCallKeep.addEventListener('didReceiveStartCallAction', ({handle, callUUID, name}) => {});

    RNCallKeep.addEventListener('didPerformSetMutedCallAction', ({muted, callUUID}) => {
      if (muted !== this.state.isMute) {
        this.muteAction();
      }
    });

    RNCallKeep.addEventListener('answerCall', ({callUUID}) => {
      if (this.state.syncCall == null) {
        return;
      }
      // Alert.alert('Người dùng click answer, Sync CallKitId: ' + this.state.syncCall.callkitId + ' callUUID: ' + callUUID.toLowerCase());

      if (callUUID !== this.state.syncCall.callkitId) {
        return;
      }

      // Luu lai hanh dong answer cua nguoi dung
      const newSyncCall = this.state.syncCall;
      newSyncCall.answered = true;

      this.setState({
        // cacheAction: 1,
        syncCall: newSyncCall,
      });

      // Answer call neu can
      this.answerCallAction();
    });

    RNCallKeep.addEventListener('endCall', ({callUUID}) => {
      logStringee('EVENT END CALLKIT, callUUID: ' + callUUID);

      if (this.state.syncCall == null) {
        logStringee('EVENT END CALLKIT - syncCall = null');
        return;
      }

      if (this.state.syncCall.callkitId === '' || callUUID !== this.state.syncCall.callkitId) {
        logStringee('EVENT END CALLKIT - uuid khac, callkitId: ' + this.state.syncCall.callkitId);
        return;
      }

      // Cap nhat trang thai cho syncCall
      const newSyncCall = this.state.syncCall;
      newSyncCall.endedCallkit = true;
      newSyncCall.rejected = true;

      this.setState({
        syncCall: newSyncCall,
      });

      // StringeeCall van chua duoc end thi can end
      logStringee(
        'EVENT END CALLKIT, syncCall: ' +
          this.state.syncCall +
          ' callId: ' +
          this.state.syncCall?.callId +
          ' callCode: ' +
          this.state.syncCall.callCode,
      );
      if (
        this.state.syncCall?.callId !== '' &&
        this.state.syncCall?.callCode !== 3 &&
        this.state.syncCall?.callCode !== 4
      ) {
        if (this.state.answeredCall) {
          logStringee('HANGUP CALL KHI END CALLKIT');
          this.stringeeCall.current.hangup(this.state.syncCall?.callId, (status, code, message) => {
            logStringee(`stringeeCall.hangup: ${code} ${status} ${message} `);
            // if (status) {
            //   Sucess
            // } else {
            //   Fail
            // }
          });
        } else {
          logStringee('REJECT CALL KHI END CALLKIT');
          this.stringeeCall.current?.reject(
            this.state.syncCall?.callId,
            (status, code, message) => {
              logStringee(`stringeeCall.reject: ${code} ${status} ${message} `);
              // if (status) {
              //   Sucess
              // } else {
              //   Fail
              // }
            },
          );
        }

        // var newSCall = this.state.syncCall;
        // newSCall.endedStringeeCall = true;
        // this.setState({
        //   syncCall: newSCall
        // });
      }

      this.deleteSyncCallIfNeed();
    });

    VoipPushNotification.registerVoipToken();
  };

  endButtonPress = () => {
    if (this.state.syncCall != null && this.state.syncCall?.callId !== '') {
      this.stringeeCall.current.hangup(this.state.syncCall?.callId, (status, code, message) => {
        logStringee('hangup', {status, code, message});
        if (!status) {
          // That bai thi update UI
          this.endCallAndUpdateView();
        }
      });
    } else {
      // Update UI
      this.endCallAndUpdateView();
      logStringee(
        'KHONG THE END CALL, syncCall: ' +
          this.state?.syncCall +
          ' callId: ' +
          this.state.syncCall?.callId,
      );
    }
  };

  rejectButtonPress = () => {
    // Cap nhat trang that rejected cho syncCall
    const newSyncCall = this.state?.syncCall;
    newSyncCall.rejected = true;
    this.setState({
      syncCall: newSyncCall,
    });

    if (this.state.syncCall != null && this.state.syncCall?.callId !== '') {
      this.stringeeCall.current.reject(this.state.syncCall?.callId, (status, code, message) => {
        logStringee('reject', {status, code, message});
        if (!status) {
          // That bai thi update UI
          this.endCallAndUpdateView();
        }
      });
    } else {
      // Update UI
      this.endCallAndUpdateView();
      logStringee(
        'KHONG THE REJECT CALL, syncCall: ' +
          this.state.syncCall +
          ' callId: ' +
          this.state.syncCall?.callId,
      );
    }
  };

  acceptButtonPress = () => {
    const newSyncCall = this.state.syncCall;
    newSyncCall.answered = true;
    this.setState({
      syncCall: newSyncCall,
    });

    // Gọi hàm answer của Callkit rồi xử lý luồng như khi người dùng click answer từ callkit
    RNCallKeep.answerIncomingCall(this.state.syncCall.callkitId);
  };

  sendDTMF = dtmf => {
    const callId = this.state.callId;
    this.stringeeCall.current.sendDTMF(callId, dtmf, (status, code, message) => {
      logStringee('sendDTMF', {status, code, message});
    });
  };

  render() {
    const {getClientId} = this.props;
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showCallingView}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          {this.state.showCallingView && (
            <View style={HELPERS.fill}>
              <CallScreen
                hasLocalStream={this.state.hasReceivedLocalStream}
                hasRemoteStream={this.state.hasReceivedRemoteStream}
                stringeeCallId={this.state.syncCall != null ? this.state.syncCall?.callId : ''}
                isVideoCall={this.state.syncCall != null ? this.state.syncCall.isVideoCall : false}
                userId={this.state.userId}
                avatar={this.state.avatar}
                isAnswered={
                  this.state.syncCall != null
                    ? this.state.syncCall.answered
                    : this.state.answeredCall
                }
                callState={this.state.callState}
                endButtonHandler={this.endButtonPress}
                rejectButtonHandler={this.rejectButtonPress}
                acceptButtonHandler={this.acceptButtonPress}
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
