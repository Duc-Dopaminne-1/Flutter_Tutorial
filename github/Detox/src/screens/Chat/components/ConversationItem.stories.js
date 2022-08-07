import {storiesOf} from '@storybook/react-native';
import React from 'react';

import ConversationItem from './ConversationItem';

type Props = React.ComponentProps<typeof Conversation>;
const props: Props = {
  avatar: 'https://reactnative.dev/img/logo-og.png',
  name: 'Quis ipsum non minim aliquip elit sint eiusmod ex non eu anim ea.',
  date: '10w',
  lastMessage:
    'Cillum nisi deserunt nostrud adipisicing consequat id reprehenderit fugiat nulla cupidatat pariatur id.',
};

storiesOf('z|social/ConversationItem', module) //format
  .add('default', () => <ConversationItem {...props} />)
  .add('has unread count', () => <ConversationItem {...props} unreadCount={99} />);
