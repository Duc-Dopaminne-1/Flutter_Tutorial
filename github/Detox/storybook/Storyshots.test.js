import 'react-native';

import initStoryshots, {Stories2SnapsConverter} from '@storybook/addon-storyshots';
import renderer from 'react-test-renderer';

beforeAll(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

initStoryshots({
  asyncJest: true, // this is the option that activates the async behaviour
  storyNameRegex: new RegExp(/\w$/g),
  test: ({
    story,
    context,
    done, // --> callback passed to test method when asyncJest option is true
  }) => {
    const converter = new Stories2SnapsConverter();
    const snapshotFilename = converter.getSnapshotFileName(context);
    const storyElement = story.render();

    // mount the story
    // const tree = mount(storyElement);
    const tree = renderer.create(storyElement);

    // wait until the mount is updated, in our app mostly by Relay
    // but maybe something else updating the state of the component
    // somewhere
    const waitTime = 1;
    setTimeout(() => {
      if (snapshotFilename) {
        // expect(toJson(tree.update())).toMatchSpecificSnapshot(snapshotFilename);
        expect(tree.toJSON()).toMatchSpecificSnapshot(snapshotFilename);
      }

      done();
    }, waitTime);
  },
});
