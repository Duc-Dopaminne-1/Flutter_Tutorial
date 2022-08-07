import React from 'react';
import renderer from 'react-test-renderer';

import BaseScreen from './BaseScreen';

it('renders correctly', () => {
  const tree = renderer.create(<BaseScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
