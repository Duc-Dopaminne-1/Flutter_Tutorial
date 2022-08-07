import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {configDecorator} from '../../../storybook/utils/configDecorator';
import {BadWordModal} from './BadWordModal';

const data = [
  {
    originalContent: 'Ban nha con heo',
    highlightedContent:
      'Lorem ipsum dolor sit amet, <b>consectetur</b> adipiscing elit, sed do eiusmod tempor <b>incididunt</b> ut labore et dolore magna aliqua.',
    badWords: ['con_heo'],
    __typename: 'CheckBadWordResult',
  },
  {
    originalContent: 'Ban nha con heo',
    highlightedContent:
      'Lorem ipsum dolor sit amet, <b>consectetur</b> adipiscing elit, sed do eiusmod tempor <b>incididunt</b> ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in <b>voluptate</b> velit esse cillum dolore eu fugiat nulla pariatur. <b>Excepteur</b> sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    badWords: ['con_heo'],
    __typename: 'CheckBadWordResult',
  },
];

storiesOf('z|c2c/BadWordModal', module)
  .addDecorator(
    configDecorator({
      notHaveTestId: 'isHtmlLoading',
    }),
  )
  .add('default', () => {
    return <BadWordModal errorKeyword={data} />;
  });
