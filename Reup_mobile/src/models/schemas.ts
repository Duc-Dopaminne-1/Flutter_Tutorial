import moment from 'moment';
import { schema } from 'normalizr';

const user = new schema.Entity(
  'users',
  {},
  {
    idAttribute: item => `${item.user_id}`,
  },
);

const newsFeed = new schema.Entity(
  'newsFeeds',
  {},
  {
    idAttribute: item => `${item.id}`,
    processStrategy: (item: any) => {
      return {
        ...item,
        createdDate: moment(new Date(item.createdDate)).toDate(),
      };
    },
  },
);

const newsFeedComment = new schema.Entity(
  'newsFeedComments',
  {},
  {
    idAttribute: item => `${item.id}`,
  },
);

const newsFeedReply = new schema.Entity(
  'newsFeedReplys',
  {},
  {
    idAttribute: item => `${item.id}`,
  },
);

const contact = new schema.Entity(
  'contacts',
  {},
  {
    idAttribute: item => `${item.id}`,
  },
);

const notification = new schema.Entity(
  'notifications',
  {},
  {
    idAttribute: item => `${item.id}`,
    processStrategy: (item: any) => {
      return {
        ...item,
      };
    },
  },
);

export { user, newsFeed, newsFeedComment, newsFeedReply, contact, notification };
