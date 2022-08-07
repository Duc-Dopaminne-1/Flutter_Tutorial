/* eslint-disable sonarjs/no-duplicate-string */
import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {View} from 'react-native';

import {LiveChatRoomContainer} from './LiveChatRoomScreen';

storiesOf('z|social/LiveChatRoom', module) //format
  .add('Default', () => {
    return (
      <View style={{flex: 1}}>
        <LiveChatRoomContainer {...data} />
      </View>
    );
  });

const data = {
  onSend: () => {},
  loading: false,
  userId: '1TIumThd7gLSbfTOmHAUfqkd-1633504879',
  messages: [
    {
      _id: 'msg-vn-1-2HNSEHBCDG-1633457803661',
      text: 'Quis voluptate ex cupidatat adipisicing ea sit velit veniam minim minim dolore anim. Minim non pariatur Lorem anim consectetur do irure elit officia duis veniam irure dolore qui. Amet laboris ullamco aute sit ea deserunt fugiat id cupidatat. Anim cillum eiusmod do dolor nostrud eu elit reprehenderit deserunt laborum mollit reprehenderit et. Eu pariatur officia occaecat excepteur ex mollit eu ullamco culpa qui. In cupidatat proident esse quis pariatur aute minim dolore nulla laboris consectetur.',
      user: {
        _id: 'ACWF75NONI',
        name: 'Nguyễn Văn A',
      },
    },
    {
      _id: 'msg-vn-1-2HNSEHBCDG-1633457803422',
      text: 'Cillum officia ea commodo adipisicing nostrud irure aliqua et.',
      user: {
        _id: 'ACWF75NONI',
        name: 'Nguyễn Văn A',
      },
    },
    {
      text: 'Anim ea ipsum quis elit amet laboris enim.',
      user: {
        _id: '1TIumThd7gLSbfTOmHAUfqkd-1633504879',
      },
      _id: 'c9833345-1863-4adb-b19d-cdc151c28cd7',
    },
    {
      text: 'Cupidatat ut ex exercitation excepteur.',
      user: {
        _id: '1TIumThd7gLSbfTOmHAUfqkd-1633504879',
      },
      _id: 'c9833345-1863-4adb-b19d-cdc151c28cd6',
    },
    {
      _id: 'msg-vn-1-2HNSEHBCDG-1633457803090',
      text: 'Officia do occaecat labore aliqua ipsum deserunt laboris dolore officia in officia.',
      user: {
        _id: 'ACWF75NONI',
        name: 'Nguyễn Văn A',
      },
    },
    {
      _id: 'msg-vn-1-2HNSEHBCDG-1633457802784',
      text: 'Aute ut occaecat eu ullamco non aute eu magna duis mollit.',
      user: {
        _id: 'ACWF75NONI',
        name: 'Nguyễn Văn A',
      },
    },
    {
      _id: 1,
      text: 'Enim consectetur est exercitation laborum nulla labore reprehenderit. Adipisicing eiusmod sunt veniam sit Lorem. Adipisicing enim laboris dolore nulla voluptate. Labore veniam ad eu laborum qui non enim Lorem veniam et eu sint. Aliqua aute aute irure reprehenderit veniam adipisicing et fugiat incididunt sint. Aute sit aliquip culpa elit veniam velit pariatur eu amet ad. Excepteur sit sunt ad ut dolor sunt laboris dolor aute anim velit nisi incididunt laboris.',
      user: {
        _id: '1TIumThd7gLSbfTOmHAUfqkd-1633504879',
      },
    },
  ],
};
