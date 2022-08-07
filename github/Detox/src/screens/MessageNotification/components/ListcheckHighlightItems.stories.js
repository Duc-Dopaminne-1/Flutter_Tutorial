import {storiesOf} from '@storybook/react-native';
import React from 'react';

import ListCheckHighlightItems from './ListCheckHighlightItems';

storiesOf('z|notification/ListCheckHighlightItems', module).add('default', () => {
  return <ListCheckHighlightItems {...props} />;
});

const props = {
  data: [
    {id: null, title: 'Tất cả (0)'},
    {id: 'Transaction', title: 'Giao dịch (0)'},
    {id: 'Suggestion', title: 'Gợi ý (0)'},
    {id: 'System', title: 'Hệ thống (0)'},
  ],
  currentItem: {id: null, title: 'Tất cả'},
  onSelect: () => {},
};
