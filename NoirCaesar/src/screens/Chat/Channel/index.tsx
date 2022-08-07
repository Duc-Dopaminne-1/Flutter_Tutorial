import React, { useState, useEffect, useRef } from 'react';
import { View, AppState, AppStateStatus, KeyboardAvoidingView, Platform } from 'react-native';
import { CustomHeader } from '@src/components/CustomHeader';
import { BACK } from '@src/constants/icons';
import { SELECT_USER_SCREEN } from '@src/constants/screenKeys';
import { IScreenType } from '../SelectUser';
import { useDispatch } from 'react-redux';
import { getChannelList } from '@src/modules/chat/channel/actions';
import { throttle } from 'lodash';
import { usePrevious } from '@src/hooks/usePrevious';
import { IError } from '@src/modules/base';
import Container from '@src/components/Container';
import NavigationActionsService from '@src/navigation/navigation';
import NEWMESS from '@res/icons/newMessage.png';
import SearchChannel from './SearchChannel';
import ListChannel from './ListChannel';

interface IListChannelUIState {
  page: number;
  isRefreshing: boolean;
  loading: boolean;
}

const initialState: IListChannelUIState = {
  page: 1,
  isRefreshing: false,
  loading: false,
};

const Channel = () => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState<string>('');
  const [uiState, setUIState] = useState<IListChannelUIState>(initialState);
  const { page, isRefreshing, loading } = uiState;
  const previousLoading = usePrevious(loading);

  const throttled = useRef<any>(
    throttle((text: string) => {
      // Handle search
      setUIState({
        ...uiState,
        page: 1,
        loading: true,
      });
    }, 1000),
  );

  useEffect(() => {
    throttled.current(searchText);
  }, [searchText]);

  useEffect(() => {
    if (loading && previousLoading !== loading) {
      dispatch(
        getChannelList({
          q: searchText,
          page: page,
          onSuccess: onLoadChannelListSuccess,
          onFail: onLoadChannelListFail,
        }),
      );
    }
  }, [loading]);

  useEffect(() => {
    registerAppStateChangeListener();

    return () => {
      removeAppStateChangeListener();
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      dispatch(getChannelList({ page: 1 }));
    }
  }

  const registerAppStateChangeListener = () => {
    AppState.addEventListener('change', handleAppStateChange);
  }

  const removeAppStateChangeListener = () => {
    AppState.removeEventListener('change', handleAppStateChange);
  }

  const onPressBack = () => {
    NavigationActionsService.toggleDrawer(true);
  };

  const onPressRightAction = () => {
    NavigationActionsService.push(SELECT_USER_SCREEN, { screenType: IScreenType.ADD_USER }, true);
  };

  const onLoadChannelListSuccess = () => {
    setUIState({
      page: page + 1,
      isRefreshing: false,
      loading: false,
    });
  };

  const onLoadChannelListFail = (error?: IError) => {
    setUIState({
      ...uiState,
      isRefreshing: false,
      loading: false,
    });
  };

  const handleRefresh = () => {
    setUIState({
      page: 1,
      isRefreshing: true,
      loading: true,
    });
  };

  const handleLoadMore = () => {
    setUIState({
      ...uiState,
      loading: true,
    });
  };

  const onChangeText = (text: string) => {
    setSearchText(text);
  };

  const renderHeader = () => {
    return (
      <CustomHeader leftImage={BACK} rightImage={NEWMESS} title={'Messages'} leftAction={onPressBack} rightAction={onPressRightAction} />
    );
  };

  const renderSearch = () => {
    return <SearchChannel search={searchText} onSearchTextChange={onChangeText} />;
  };

  const renderChatList = () => {
    return <ListChannel isRefreshing={isRefreshing} loading={loading} onRefresh={handleRefresh} onLoadMore={handleLoadMore} />;
  };

  return (
    <Container >
      <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'android' ? -500 : 0}>
        {renderHeader()}
        {renderSearch()}
        {renderChatList()}
      </KeyboardAvoidingView>
    </Container>
  );
};

export default Channel;
