export type ChatProfileType = typeof getChatProfile;

export type SendMessageType = typeof onObjectChangeSend;

export type ReceiveMessageType = typeof onObjectChangeReceive;

export type UIMessage = {
  _id: String,
  text: String,
  createdAt: Date,
  user: {
    _id: String,
    name: String,
    avatar: String,
  },
};

export const parseReceiveMessage = ({
  objectChanges,
  changeType,
  objectType,
}: ReceiveMessageType) => {
  if (objectType !== 0 || changeType !== 0) {
    return null;
  }
  const {participants, lastMessage} = objectChanges[0];
  const isReceiveMessage =
    participants?.length > 1 &&
    lastMessage &&
    lastMessage.content?.content &&
    !lastMessage.content?.text;
  if (!isReceiveMessage) {
    return null;
  }
  const sender = participants.find(item => item.userId === lastMessage.sender);
  const senderId = sender?.userId;
  if (!senderId) {
    return null;
  }
  const message: UIMessage = {
    _id: lastMessage.id,
    text: lastMessage.content.content,
    createdAt: lastMessage.createdAt,
    user: {
      _id: senderId,
      name: sender?.name,
    },
  };
  return message;
};

export const getChatProfile = {
  id: 'CPR_K3UHH8FQ',
  queues: [{name: 'Hàng đợi Hỗ trợ khách hàng 1', id: 'QUWUZ64L'}],
  background: 'rgb(0, 172, 185)',
  popupAnswerUrl: '',
  logoUrl:
    'https://v2.stringee.com/stringeexchat/upload/1069/1f8d87e1161af68b81bace188a1ec624/2021/07/22/HNEPFUHKLL-1626941099323.png',
  zaloAsLivechat: true,
  enabled: false,
  facebookAsLivechat: true,
  portal: 'PTR0BRZYJZ',
  projectId: 11334,
  language: 'vi',
  hour: '',
  autoCreateTicket: true,
};
export const onObjectChangeSend = {
  objectType: 1,
  objectChanges: [
    {
      localId: 'iOS-733B52F3-9B1C-4F6D-B377-C6110763671D-1632470040970296',
      id: 'msg-vn-1-15B9GVDC04-1631893219481',
      conversationId: 'conv-vn-1-15B9GVDC04-1631892425666',
      // eslint-disable-next-line sonarjs/no-duplicate-string
      sender: 'tnjdQHsG0K5wgBu64XomcIbF-1632470008',
      createdAt: 1632470041097,
      state: 2,
      sequence: 2,
      type: 1,
      content: {
        content: 'message 1',
      },
    },
  ],
  changeType: 1,
};

export const onObjectChangeReceive = {
  objectType: 0,
  objectChanges: [
    {
      id: 'conv-vn-1-15B9GVDC04-1631892425737',
      name: 'QUWUZ64L',
      isGroup: true,
      updatedAt: 1632470134308,
      creator: 'tnjdQHsG0K5wgBu64XomcIbF-1632470008',
      created: 1632470119571,
      unreadCount: 2,
      participants: [
        {
          userId: 'ACWF75NONI',
          name: 'Nguyễn Trọng Bình',
          avatar: '',
        },
        {
          userId: 'tnjdQHsG0K5wgBu64XomcIbF-1632470008',
          name: 'binh1',
          avatar: '',
        },
      ],
      lastMessage: {
        localId: null,
        id: 'msg-vn-1-15B9GVDC04-1631893219796',
        conversationId: 'conv-vn-1-15B9GVDC04-1631892425737',
        sender: 'ACWF75NONI',
        createdAt: 1632470134308,
        state: 3,
        sequence: 3,
        type: 1,
        content: {
          metadata: '',
          content: 'hello',
        },
      },
    },
  ],
  changeType: 0,
};
