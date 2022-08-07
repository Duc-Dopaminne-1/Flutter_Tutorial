import React from 'react';
import renderer from 'react-test-renderer';

import SearchBoxComponent from './SearchBoxComponent';

it('renders correctly', () => {
  const tree = renderer.create(<SearchBoxComponent />).toJSON();
  expect(tree).toMatchSnapshot();
});
