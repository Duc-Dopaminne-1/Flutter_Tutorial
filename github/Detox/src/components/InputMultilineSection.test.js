import React from 'react';
import renderer from 'react-test-renderer';

import InputMultiLineView from './InputMultiLineView';

it('renders correctly', () => {
  const tree = renderer.create(<InputMultiLineView />).toJSON();
  expect(tree).toMatchSnapshot();
});
