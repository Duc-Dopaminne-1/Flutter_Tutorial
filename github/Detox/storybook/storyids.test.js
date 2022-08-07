import initStoryshots from '@storybook/addon-storyshots';

const stories = [];
const writeStories = () => {
  const fs = require('fs');
  fs.writeFileSync('storybook/stories.json', JSON.stringify(stories));
};

initStoryshots({
  asyncJest: true, // this is the option that activates the async behaviour
  test: ({
    story,
    done, // --> callback passed to test method when asyncJest option is true
  }) => {
    const {id, kind, name} = story;
    stories.push({id, kind, name});
    writeStories();
    done();
  },
});
