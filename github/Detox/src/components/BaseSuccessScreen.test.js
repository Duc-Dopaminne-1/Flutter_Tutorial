import React from 'react';
import renderer from 'react-test-renderer';

import BaseSuccessScreen from './BaseSuccessScreen';

it('renders correctly', () => {
  const tree = renderer.create(<BaseSuccessScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
