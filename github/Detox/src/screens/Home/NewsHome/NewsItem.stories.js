import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {ScrollView} from 'react-native';

import {NewsListItem, NewsListItemTop} from './NewListItem';

storiesOf('NewsItem', module) // format
  .add('default!', () => {
    return (
      <ScrollView>
        <NewsListItemTop {...props} />
        <NewsListItem item={{...props}} />
      </ScrollView>
    );
  });

const props = {
  title: 'Muốn mua nhà giá hời hãy học lỏm những bí quyết này',
  createdDatetime: '2022-04-29 02:08:42',
  previewImageUrl: '',
  id: '60',
  isSmallStyle: true,
  body: 'Những người buôn bán bất động sản họ có rất nhiều kinh nghiệm thực tế trong việc mua bán nhà',
  onPressItem: () => {},
};
