/* eslint-env detox/detox, mocha */

import {execSync} from 'child_process';
import jestExpect from 'expect';
import RnsstChannel from 'rnsst/dist/utils/channel';

import {StoryConfig} from '../storybook/utils/StoryConfig';

const {toMatchImageSnapshot} = require('jest-image-snapshot');
const fs = require('fs');

jestExpect.extend({toMatchImageSnapshot});

const channel = new RnsstChannel(7007);

const {
  //format
  IS_TEST_IMAGE_SNAPSHOT,
  ENABLE_SCROLL_TO_BOTTOM_WHEN_CAPTURE,
} = process.env;

const expectImage = async (imageName: string, imagePath: string) => {
  const imageName1 = imageName.replace(/[^A-Za-z0-9]/g, '_');
  let imagePath1 = imagePath;
  if (!imagePath1) {
    imagePath1 = await device.takeScreenshot(imageName1 + '-snap');
  }
  const image = fs.readFileSync(imagePath1);
  await jestExpect(image).toMatchImageSnapshot({
    failureThreshold: 0.1 / 100,
    failureThresholdType: 'percent',
    customSnapshotIdentifier: imageName1,
  });
};

describe('', () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: {
        notifications: 'YES',
      },
    });
    await setDemoMode();
    await device.shake();
    await element(by.text('Enable Fast Refresh')).tap();
    await device.shake();
    await element(by.text('Disable Fast Refresh')).tap();

    if (IS_TEST_IMAGE_SNAPSHOT) {
      // eslint-disable-next-line no-console
      console.log({IS_TEST_IMAGE_SNAPSHOT});
    } else {
      // await expectImage('LaunchScreen');
      await device.shake();
      await element(by.text('Storybook')).tap();
      // await element(by.id('Storybook.OnDeviceUI.toggleUI')).tap();
    }
  });

  afterAll(async () => {
    await channel.stop();
    await device.terminateApp();
  });

  const stories = require('../storybook/stories.json');
  for (const story of stories) {
    const {id, kind, name} = story;
    if (name[0] === '.') {
      console.warn(`Skip ${id}`);
      continue;
    }
    it(`${kind}-${name}`, async () => {
      await channel.setStory(id);

      const config = await getStoryConfig();
      if (config?.notHaveTestId) {
        await waitForIdNotVisible(config?.notHaveTestId);
      }

      if (config?.timeout > 0) {
        await waitTimeout();
      }

      let captureURL;
      if (config?.isCaptureScrollViewContent) {
        if (ENABLE_SCROLL_TO_BOTTOM_WHEN_CAPTURE) {
          await element(by.id('captureScrollView')).scrollTo('bottom');
        }
        await element(by.id('captureButton')).tap();
        const attributes = await element(by.id('captureURL')).getAttributes();
        captureURL = attributes.text;
      }

      await expectImage(`${kind}.${name}`, captureURL);
    });
  }
});

async function waitTimeout(timeout = 1000) {
  await new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, timeout),
  );
}

async function waitForIdNotVisible(id, timeout = 1000, numberOfRetry = 10) {
  // eslint-disable-next-line no-console
  console.log('wait for id', id, 'not visible with timeout', timeout, numberOfRetry);

  if (numberOfRetry === 0) {
    throw Error('maximum retry');
  }

  try {
    const elements = await element(by.id(id)).getAttributes();
    await waitTimeout(timeout);
    if (elements.length === 0) {
      return;
    }
    await waitForIdNotVisible(id, timeout, numberOfRetry - 1);
  } catch (e) {}
}

async function getStoryConfig(): StoryConfig {
  try {
    const attributes = await element(by.id('storyConfigId')).getAttributes();
    const config = JSON.parse(attributes.text);
    return config;
  } catch (error) {}
  return null;
}

async function setDemoMode() {
  if (device.getPlatform() === 'ios') {
    execSync(
      'xcrun simctl status_bar "iPhone 8" override --time "09:41" --batteryState charged --batteryLevel 100 --wifiBars 3 --cellularMode active --cellularBars 4',
    );
  } else {
    // enter demo mode
    execSync('adb shell settings put global sysui_demo_allowed 1');
    // display time 09:41
    execSync('adb shell am broadcast -a com.android.systemui.demo -e command clock -e hhmm 09:41');
    // Display full mobile data with 4g type and no wifi
    execSync(
      'adb shell am broadcast -a com.android.systemui.demo -e command network -e mobile show -e level 4 -e datatype 4g -e wifi false',
    );
    // Hide notifications
    execSync(
      'adb shell am broadcast -a com.android.systemui.demo -e command notifications -e visible false',
    );
    // Show full battery but not in charging state
    execSync(
      'adb shell am broadcast -a com.android.systemui.demo -e command battery -e plugged false -e level 100',
    );
  }
}
