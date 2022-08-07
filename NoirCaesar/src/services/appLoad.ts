import wait from '@utils/wait';

const appLoad = async () => {
  await wait(50);
  return {
    extendData: 'sample',
  };
};

export default appLoad;
