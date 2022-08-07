import {storiesOf} from '@storybook/react-native';
import React, {useContext} from 'react';
import {View} from 'react-native';

import {appProviderDecorator} from '../../../storybook/utils/appProviderDecorator';
import {AppContext} from '../../appData/appContext/useAppContext';
import {useMount} from '../../screens/commonHooks';

storiesOf('Alert', module)
  .addDecorator(appProviderDecorator)
  .add('ConfirmAlert!', () => {
    const ConfirmAlert = () => {
      const {showAppModal} = useContext(AppContext);
      useMount(() => {
        showAppModal({
          isVisible: true,
          title: 'Thông báo',
          message: 'Bạn có chắc chắn muốn thực hiện thao tác này hay không?',
          cancelText: 'Không',
          okText: 'Xác nhận',
        });
      });
      return <View />;
    };
    return <ConfirmAlert />;
  })
  .add('ErrorAlert!', () => {
    const ErrorAlert = () => {
      const {showErrorAlert} = useContext(AppContext);
      useMount(() => {
        showErrorAlert('Dự án đã được theo dõi với người dùng này rồi');
      });
      return <View />;
    };
    return <ErrorAlert />;
  })
  .add('MessageAlert!', () => {
    const MessageAlert = () => {
      const {showMessageAlert} = useContext(AppContext);
      useMount(() => {
        showMessageAlert('Thành công', 'Bỏ quan tâm dự án thành công');
      });
      return <View />;
    };
    return <MessageAlert />;
  })
  .add('LongMessageAlert!', () => {
    const LongMessageAlert = () => {
      const {showMessageAlert} = useContext(AppContext);
      useMount(() => {
        showMessageAlert('Thành công', LONG_TEXT);
      });
      return <View />;
    };
    return <LongMessageAlert />;
  });

const LONG_TEXT =
  'Et exercitation nisi laboris velit fugiat ut culpa consequat incididunt nostrud. Occaecat aliquip ad incididunt ea eu amet adipisicing. Aute irure ut pariatur aliqua dolore proident tempor nulla veniam adipisicing do non deserunt sint. Elit voluptate non amet irure reprehenderit incididunt. Eu commodo dolor veniam culpa dolore. Irure mollit velit qui eiusmod quis. Anim ad enim ad qui deserunt elit laborum magna commodo cillum. Magna nisi sit consequat consequat officia et proident eu. Est eu veniam duis duis cillum. Lorem anim Lorem qui magna do laborum proident eu sunt. Consequat id non ut adipisicing velit sunt qui sit adipisicing consequat sint in cillum. Amet velit excepteur officia ut. Consequat culpa tempor anim dolore tempor id quis nostrud consequat dolore et. Ex elit excepteur velit voluptate laborum elit eiusmod reprehenderit ad consequat veniam ullamco. Aute cillum duis velit excepteur velit proident enim in tempor id irure elit. Consectetur veniam reprehenderit eiusmod quis consectetur fugiat exercitation eiusmod mollit est dolore amet. Lorem elit cillum nisi ea sint. Enim sunt cupidatat qui laboris mollit sunt laborum. Cupidatat duis enim est veniam.';
