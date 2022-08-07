export type PageDataTypes = {
  chatDefault: ChatDefaultTypes,
  introData: IntroDataTypes,
};

export type ChatDefaultTypes = {
  botIcon: String,
  botName: String,
  botChatOne: String,
  userChatOne: String,
  botChatTwo: String,
  botChatThree: String,
  botChatFour1: String,
  botChatFourHyperLink: String,
  botChatFour2: String,
};

export type IntroDataTypes = Array<IntroDataItem>;

export type IntroDataItem = {
  title: String,
  image: int,
  description: String,
  chatData: Array<ChatDataTypes>,
};

export type ChatDataTypes = {
  servicesName: String,
  type: String,
  id: String,
};
