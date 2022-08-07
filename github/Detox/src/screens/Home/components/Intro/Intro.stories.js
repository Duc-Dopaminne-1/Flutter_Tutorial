import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {PageOne, PageTwo} from './';
import {pageData} from './data';

storiesOf('z|Home/Intro', module)
  .add('PageOne', () => {
    return <PageOne data={pageData.introData[0]} defaultData={pageData.chatDefault} />;
  })
  .add('PageTwo', () => {
    return (
      <PageTwo
        defaultData={pageData.chatDefault}
        servicesSelected={pageData.introData[0].chatData[0]}
      />
    );
  });
