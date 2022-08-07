import _ from 'lodash';
import faker from 'faker';
const wait = (time: number) => new Promise(rs => setTimeout(rs, time));

const createMedia = () => ({
  id: faker.random.uuid(),
  type: 'IMAGE',
  /*
   * Source: faker.image.nature(200, 150),
   * image: faker.image.nature(),
   */
  source: 'https://dummyimage.com/600x400/ebebeb/fff',
  image: 'https://dummyimage.com/600x400/ebebeb/fff',
});

const createUser = () => ({
  id: faker.random.uuid(),
  // Avatar: faker.image.avatar(),
  avatar: 'https://dummyimage.com/600x400/ebebeb/fff',
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
});

const createDate = () => faker.date.between('09/01/2019', '10/01/2019');

export const createNewsFeed = () => ({
  id: faker.random.uuid(),
  content: faker.lorem.paragraphs(),
  medias: _.range(0, _.random(0, 10)).map(createMedia),
  liked: faker.random.boolean(),
  likeTotal: faker.random.number(1000),
  commentTotal: faker.random.number(1000),
  shareTotal: faker.random.number(1000),
  user: createUser(),
  createdDate: createDate(),
});

export const createComment = () => ({
  id: faker.random.uuid(),
  content: faker.lorem.paragraph(),
  media: faker.random.arrayElement([undefined, createMedia()]),
  liked: faker.random.boolean(),
  likeTotal: faker.random.number(1000),
  replyTotal: faker.random.number(1000),
  user: createUser(),
  createdDate: createDate(),
});

export const createReply = () => ({
  id: faker.random.uuid(),
  content: faker.lorem.paragraph(),
  media: faker.random.arrayElement([undefined, createMedia()]),
  liked: faker.random.boolean(),
  likeTotal: faker.random.number(1000),
  replyTotal: faker.random.number(1000),
  user: createUser(),
  createdDate: createDate(),
});

export const createChanel = () => ({
  id: faker.random.uuid(),
  avatar: faker.image.avatar(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  lastMessage: faker.lorem.paragraph(),
  members_count: faker.random.number(10),
  messages_count: faker.random.number(30),
  isOnline: faker.random.boolean(),
  updatedDate: createDate(),
  members: _.range(1, _.random(10)).map(createUser),
  isGroup: faker.random.boolean(),
  to: createUser(),
});

export const createMessage = () => ({
  id: faker.random.uuid(),
  channelId: faker.random.number(10),
  text: faker.lorem.paragraph(),
  createdAt: createDate(),
  user: {
    id: faker.random.arrayElement(['0', '1']),
    avatar: faker.image.avatar(),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  },
  image: faker.image.imageUrl(),
});

export const like = async (id: string) => {
  await wait(1000);
  return {
    result: {
      id,
      likeTotal: faker.random.number(1000),
      liked: true,
    },
  };
};
export const unlike = async (id: string) => {
  await wait(1000);
  return {
    result: {
      id,
      likeTotal: faker.random.number(1000),
      liked: false,
    },
  };
};
export const addNewsFeed = async () => {
  await wait(1000);
  return createNewsFeed();
};

export const addComment = async () => {
  await wait(1000);
  return createComment();
};

export const addReply = async () => {
  await wait(1000);
  return createReply();
};

export const addChanel = async () => {
  await wait(1000);
  return createChanel();
};

export const addMessage = async () => {
  await wait(1000);
  return createMessage();
};

export const loadNewsFeed = async () => {
  await wait(1000);
  return _.range(0, 10).map(createNewsFeed);
};

export const loadComment = async () => {
  await wait(1000);
  return _.range(0, 10).map(createComment);
};

export const loadReply = async () => {
  await wait(1000);
  return _.range(0, 10).map(createReply);
};

export const loadChanel = async () => {
  await wait(1000);
  return _.range(0, 10).map(createChanel);
};

export const loadMessage = async () => {
  await wait(1000);
  return _.range(0, 10).map(createMessage);
};

export const loadUser = async () => {
  await wait(1000);
  return _.range(0, 10).map(createUser);
};
