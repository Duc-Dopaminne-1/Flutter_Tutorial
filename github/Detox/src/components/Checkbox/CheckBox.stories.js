import {storiesOf} from '@storybook/react-native';
import React from 'react';

import CheckboxList from './CheckboxList';

storiesOf('Checkbox/List', module) //format
  .add('default', () => (
    <CheckboxList title="Title" items={ITEMS} selectedItems={SELECTED_ITEMS} isHorizontal={false} />
  ));

const ITEMS = [
  {
    id: 1,
    description: 'Commodo officia ullamco labore nostrud.',
  },
  {
    id: 2,
    description: 'Ex aliquip amet reprehenderit adipisicing.',
  },
];

const SELECTED_ITEMS = [{id: 1}];
