import React from 'react';
import renderer from 'react-test-renderer';

import ModalPopup from './ModalPopup';

it('renders correctly', () => {
  const tree = renderer.create(<ModalPopup />).toJSON();
  expect(tree).toMatchSnapshot();
});
