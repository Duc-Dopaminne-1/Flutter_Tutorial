import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {ContactTradingB2CBanner} from './ContactTradingB2CBanner';

storiesOf('Banner/ContactTradingB2CBanner', module) //format
  .add('one item!', () => <ContactTradingB2CBanner data={oneItem} />)
  .add('three items!', () => <ContactTradingB2CBanner data={threeItems} />);

const oneItem = [
  {
    id: '1',
    message:
      'Laboris laborum adipisicing exercitation amet eiusmod id nisi non duis minim id. Incididunt dolor enim dolor ullamco dolore. Adipisicing ad officia dolor labore est ipsum magna. Ut pariatur laboris in id non proident. Anim ullamco reprehenderit amet deserunt labore est exercitation esse elit nisi cupidatat sit. Labore excepteur exercitation minim deserunt duis ex elit ipsum in ex.',
  },
];

const threeItems = [
  {
    id: 'id-1',
    message: 'Laboris laborum adipisicing exercitation amet',
  },
  {
    id: 'id-2',
    message: 'Amet ullamco nostrud do dolor officia nulla voluptate dolore et.',
  },
  {
    id: 'id-3',
    message:
      'Et ipsum velit aute cupidatat aute. Nostrud enim anim voluptate cupidatat id et adipisicing excepteur cupidatat. Do deserunt cupidatat deserunt labore anim id esse commodo anim non tempor exercitation.',
  },
];
