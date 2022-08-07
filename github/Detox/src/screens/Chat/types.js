/* eslint-disable sonarjs/no-duplicate-string */

import moment from 'moment';

import {translate} from '../../assets/localize';
import {getCalendarDateTimeString, unixTimestampToTimeAmPm} from '../../utils/TimerCommon';

export type IConversation = {
  unreadCount: Number,
};

type RoleName = 'member' | 'agent' | 'admin';

export type IParticipant = {
  userId: String,
  name: String,
  avatar: String,
  isAgent: Boolean,
  isMember: Boolean,
  agentId?: String,
  roleNames: RoleName[],
};

export const MESSAGE_TYPE = {
  TEXT: 1,
  PHOTO: 2,
  VIDEO: 3,
  AUDIO: 4,
  FILE: 5,
  LINK: 6,
  CONVERSATION_CREATION_NOTIFICATION: 7,
  CONVERSATION_RENAME_NOTIFICATION: 8,
  LOCATION: 9,
  CONTACT: 10,
  STICKER: 11,
  NOTIFICATION: 100,
};

export const MESSAGE_STATE = {
  INITIALIZE: 0, //The message is initialized
  SENDING: 1, //The message is sent by the sender
  SENT: 2, //The message is sent to Stringee server
  DELIVERED: 3, //The message is delivered to the recipient
  READ: 4, //The message is read by the recipient
};

export type IChatMessage = {
  _id: String,
  text: String,
  createdAt: Date,
  image?: String,
  imageUrl?: String,
  imageRatio?: Number,
  user: {
    _id: String,
    name: String,
    avatar: String,
  },
  conversationId: String,
  fileUrl?: String,
  fileLength?: Number,
};

export const parseConversation = (value, currentUserId) => {
  const id = value.id;
  const isGroup = value.isGroup;
  const {userId, name, avatar} = value.participants
    .filter(participant => participant.userId !== currentUserId)
    .map(item => ({...item, name: item.name || item.userId}))[0];
  const rawDateTime = value.lastMessage.createdAt;
  const date = convertTimeToTimeAgo(rawDateTime);
  const lastMessage = value.lastMessage.content?.content || '--';
  const unreadCount = value.unreadCount;
  const participants = value.participants;
  return {
    id,
    userId,
    name,
    isGroup,
    groupName: value.name,
    avatar,
    unreadCount,
    lastMessage,
    lastMessageType: value.lastMessage.type,
    rawDateTime,
    date,
    participants,
  };
};

export const parseMessages = (data: typeof getLastMessages, participants) => {
  const result = data.map(value => {
    const message: IChatMessage = {
      _id: value.id,
      text: value.content?.content,
      createdAt: value.createdAt,
      sequence: value.sequence,
      user: getUserFromParticipants(participants, value.sender),
      conversationId: value.conversationId,
    };
    if (value.type === MESSAGE_TYPE.PHOTO) {
      message.image = value.content?.photo?.filePath;
    }
    if (value.type === MESSAGE_TYPE.FILE) {
      message.text = value.content?.file?.filename;
      message.fileUrl = value.content?.file?.filePath;
    }
    return message;
  });
  return result;
};

export const getMessageContentByType = (type, content) => {
  switch (type) {
    case MESSAGE_TYPE.PHOTO:
      return translate('chat.type.photo');
    case MESSAGE_TYPE.FILE:
      return translate('chat.type.file');
    default:
      return content;
  }
};

export const getUserFromParticipants = (participants, idOrName) => {
  const {
    userId: _id,
    name,
    avatar,
  } = participants.filter(value => value.userId === idOrName || value.name === idOrName)[0];
  return {_id, name, avatar};
};

export const convertTimeToTimeAgo = timestamp => {
  const diff = moment(new Date()).diff(moment(timestamp), 'day');
  if (diff === 0) {
    return unixTimestampToTimeAmPm(timestamp);
  }
  return getCalendarDateTimeString(timestamp);
};

export const createConversation = {
  id: 'conv-vn-1-8AT5T0P0ET-1634524961033',
  name: 'btncall_0000120493',
  isGroup: false,
  updatedAt: 1635146158214,
  creator: 'btncall_0000123452',
  created: 1635146158211,
  unreadCount: 0,
  participants: [
    {userId: 'btncall_0000123452', name: '', avatar: ''},
    {userId: 'btncall_0000120493', name: '', avatar: ''},
  ],
  lastMessage: {
    localId: null,
    id: 'msg-vn-1-8AT5T0P0ET-1634524963617',
    conversationId: 'conv-vn-1-8AT5T0P0ET-1634524961033',
    sender: '',
    createdAt: 1635146158214,
    state: 4,
    sequence: 1,
    type: 7,
    content: {
      participants: ['btncall_0000120493', 'btncall_0000123452'],
      creator: 'btncall_0000123452',
      groupName: 'btncall_0000120493',
    },
  },
};

export const getLastConversations = [
  {
    id: 'conv-vn-1-8AT5T0P0ET-1634524961048',
    name: 'binh020304',
    isGroup: true,
    updatedAt: 1635155773086,
    creator: 'btncall_0000123452',
    created: 1635155265332,
    unreadCount: 6,
    participants: [
      {userId: 'btncall_0000123452', name: '', avatar: ''},
      {userId: 'btncall_0000120493', name: '', avatar: ''},
      {userId: 'btncall_0000123404', name: '', avatar: ''},
    ],
    lastMessage: {
      localId: null,
      id: 'msg-vn-1-8AT5T0P0ET-1634524965643',
      conversationId: 'conv-vn-1-8AT5T0P0ET-1634524961048',
      sender: 'btncall_0000120493',
      createdAt: 1635155773086,
      state: 3,
      sequence: 11,
      type: 1,
      content: {messageType: 1, text: '10', content: '10'},
    },
  },
  {
    id: 'conv-vn-1-8AT5T0P0ET-1634524961033',
    name: 'btncall_0000120493',
    isGroup: false,
    updatedAt: 1635155484063,
    creator: 'btncall_0000123452',
    created: 1635146158211,
    unreadCount: 25,
    participants: [
      {userId: 'btncall_0000123452', name: '', avatar: ''},
      {userId: 'btncall_0000120493', name: '', avatar: ''},
    ],
    lastMessage: {
      localId: null,
      id: 'msg-vn-1-8AT5T0P0ET-1634524965466',
      conversationId: 'conv-vn-1-8AT5T0P0ET-1634524961033',
      sender: 'btncall_0000123452',
      createdAt: 1635155484063,
      state: 4,
      sequence: 62,
      type: 1,
      content: {metadata: {}, content: '57'},
    },
  },
];

const getLastMessages = [
  {
    localId: 'iOS-6B0F08E0-61B6-4009-BDBD-6D8A7769925C-1635150215340361',
    id: 'msg-vn-1-8AT5T0P0ET-1634524963650',
    conversationId: 'conv-vn-1-8AT5T0P0ET-1634524961033',
    sender: 'btncall_0000123452',
    createdAt: 1635150215454,
    state: 4,
    sequence: 2,
    type: 1,
    content: {content: 'i is a little bit'},
  },
  {
    localId: 'iOS-6B0F08E0-61B6-4009-BDBD-6D8A7769925C-1635150714053298',
    id: 'msg-vn-1-8AT5T0P0ET-1634524963617',
    conversationId: 'conv-vn-1-8AT5T0P0ET-1634524961033',
    sender: 'btncall_0000123452',
    createdAt: 1635146158214,
    state: 4,
    sequence: 1,
    type: 7,
    content: {
      participants: ['btncall_0000120493', 'btncall_0000123452'],
      creator: 'btncall_0000123452',
      groupName: 'btncall_0000120493',
    },
  },
];

export const realtimeConversation = {
  objectType: 0,
  objectChanges: [
    {
      id: 'conv-vn-1-WFHIO14TBS-1635589975318',
      name: 'app - web',
      isGroup: true,
      updatedAt: 1638866861310,
      creator: 'btncall_0000123452',
      created: 1635993700640,
      unreadCount: 2,
      participants: [
        {
          userId: 'btncall_0000123452',
          name: 'Nguyen Binh 02',
          avatar:
            'https://sandbox-citus.topenland.com/gateway/downloader/personal/24e9d3f9-539c-4d12-a5fe-ee4fe075daa0-1627115308781-ce73fb14-b285-47ac-a263-f1d1cf340da5.jpg',
        },
        {
          userId: 'btncall_0000120493',
          name: 'Binh03',
          avatar:
            'https://sandbox-citus.topenland.com/gateway/downloader/personal/805d50b6-435f-45b0-b76f-a9f1919512f9-1617355855183-0d65be4c-ca9a-4a40-b502-76208fd66abd.jpg',
        },
      ],
      lastMessage: {
        localId: null,
        id: 'msg-vn-1-BXCKDI4R11-1638446310301',
        conversationId: 'conv-vn-1-WFHIO14TBS-1635589975318',
        sender: 'btncall_0000120493',
        createdAt: 1638866861310,
        state: 3,
        sequence: 162,
        type: 1,
        content: {messageType: 1, text: '152', content: '152'},
      },
    },
  ],
  changeType: 0,
};

export const realtimeMessage = {
  objectType: 1,
  objectChanges: [
    {
      localId: 'iOS-879B4B86-849D-4445-BEAE-3ADC9DB3BF59-1638852104603241',
      id: 'msg-vn-1-BXCKDI4R11-1638446308979',
      conversationId: 'conv-vn-1-WFHIO14TBS-1635589975318',
      sender: 'btncall_0000120493',
      createdAt: 1638852104763,
      state: 4,
      sequence: 120,
      type: 1,
      content: {content: '111'},
    },
  ],
  changeType: 0,
};
