import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {ScrollView} from 'react-native';

import {ResultSearch} from '.';

storiesOf('z|search/ResultSearch', module).add('default', () => {
  return (
    <ScrollView>
      <ResultSearch />
      <ResultSearch isShowSort={false} />
      <ResultSearch filterKeyword="Eu commodo deserunt elit eu id duis eiusmod eu dolor in." />
      <ResultSearch filterKeyword="Sit sunt ipsum eiusmod dolor. Elit veniam sit reprehenderit cupidatat ut reprehenderit reprehenderit magna fugiat in nostrud minim." />
    </ScrollView>
  );
});
