import {storiesOf} from '@storybook/react-native';
import React from 'react';

import {TabPopup} from './TabPopup';

storiesOf('z|home/BottomMenu', module) //format
  .add('topener', () => <TabPopup visible />)
  .add('member', () => <TabPopup visible needUpgradeTopener />);
