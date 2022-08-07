import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {configDecorator} from '../../../../storybook/utils/configDecorator';
import {HTMLText} from './HTMLText';

storiesOf('Text/HTMLText', module) // fomat
  .addDecorator(
    configDecorator({
      notHaveTestId: 'isHtmlLoading',
    }),
  )
  .add('default', () => {
    return <HTMLText text={longHTML} />;
  });

const longHTML =
  'Veniam irure pariatur nisi sit voluptate minim eiusmod irure aute Lorem incididunt sunt veniam quis. Dolore ea incididunt sunt ea anim ea ipsum ipsum quis esse sint. Ullamco nostrud veniam officia est. Deserunt consectetur consequat dolor non dolor ullamco nisi qui velit dolor ullamco. Anim ut elit reprehenderit dolore.';
