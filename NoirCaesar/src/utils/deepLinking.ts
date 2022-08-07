import { Linking } from 'react-native';
import { Navigation } from 'react-native-navigation';

interface Params {
  name: string;
  passProps?: any;
  options?: any;
  tab?: number;
  url?: string;
}
// Screen Listener
let currentComponentId = '';
const inittialLinkHandled = false;

// Parse params from url
const getParamsFromUrl = (url: string): Params => {
  return {
    url,
    name: 'Home',
  };
};

// Navigate helper
const navigate = (component: Params, tab?: number) => {
  if (tab) {
    Navigation.mergeOptions(currentComponentId, {
      bottomTabs: {
        currentTabIndex: 1,
      },
    });
    setTimeout(() => {
      Navigation.push(currentComponentId, { component });
    }, 300);
  } else {
    Navigation.push(currentComponentId, { component });
  }
};

// Handle Deeplinking
const handleDeepLinking = (event: { url: string }) => {
  const { tab, ...opts } = getParamsFromUrl(event.url);
  navigate(opts, tab);
};

// Handle Deeplinking
const registerHandleDeepLinking = () => {
  Navigation.events().registerComponentDidAppearListener(async ({ componentId }) => {
    if (!inittialLinkHandled) {
      const inittialLink = await Linking.getInitialURL();
      if (inittialLink) handleDeepLinking({ url: inittialLink });
    }
    currentComponentId = componentId;
  });
  return Linking.addEventListener('url', handleDeepLinking);
};

export default registerHandleDeepLinking;
