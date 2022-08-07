import React from 'react';
import renderer from 'react-test-renderer';

import RequestConsultNoteView from '../../ContactDetail/RequestDetailScreenComponents/RequestConsultNoteView';

it('renders correctly', () => {
  const tree = renderer.create(<RequestConsultNoteView />).toJSON();
  expect(tree).toMatchSnapshot();
});
