import styles from './styles';
import Container from '@src/components/Container';
import React, { useEffect } from 'react';
import { View, Alert } from 'react-native';
import { CustomHeader } from '@src/components/CustomHeader';
import { MENU, CART } from '@src/constants/icons';
import NavigationActionsService from '@src/navigation/navigation';
//@ts-ignore
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { MostPopular } from './MostPopular';
import { Genres } from './Genres';
import { AToZ } from './AToZ';
import { useDispatch, useSelector } from 'react-redux';
import { showGenresMenu } from '@src/modules/books/actions';
import { toggleDrawer } from '@src/navigation';
import { RootState } from '@src/types/types';
import { getGenres as actionGetGenres } from '@src/modules/books/actions';
import { TabView } from '@src/components/TabView';
import { CART_SCREEN, PROFILE } from '@src/constants/screenKeys';
import { getPersonTypes } from '@src/modules/auth/actions';
import { IAPService } from '@src/modules/iap/IAPService';
import NotificationsService from '@src/modules/notifications/service';
import { IError } from '@src/modules/base';
import { SocketService } from '@src/modules/chat/socket/service';
import translate from '@src/localize';

interface Props {
  isFromSignUp: boolean;
  componentId: string;
}

const Books = (props: Props) => {
  const dispatch = useDispatch();

  const isShowGenresMenu = useSelector<RootState, boolean>((state: RootState) => state.book.isShowGenresMenu);

  useEffect(() => {
    NavigationActionsService.initInstance(props.componentId);
    NotificationsService.getInstance().initService();
    SocketService.getInstance().initConnection();
    IAPService.getInstance().initService();

    NavigationActionsService.hideLoading();

    return () => {
      SocketService.getInstance().closeSocket();
    };
  }, []);

  useEffect(() => {
    if (props.isFromSignUp) {
      setTimeout(() => {
        NavigationActionsService.push(PROFILE, {}, true);
      }, 1000);
    }
  }, [props.isFromSignUp]);

  useEffect(() => {
    getGenres();
    getListPerson();
  }, []);

  const getGenres = () => {
    dispatch(
      actionGetGenres({
        onFail: (error: IError) => {
          setTimeout(() => {
            NavigationActionsService.showErrorPopup(error);
          }, 500);
        },
      }),
    );
  };

  const getListPerson = () => {
    dispatch(getPersonTypes({
      onFail: (error) => {
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message)
        }, 500);
      }
    }));
  }

  const onChangeTab = (data: any) => {
    if (data && data.i == 1) {
      dispatch(
        showGenresMenu({
          isShow: true,
        }),
      );
    } else {
      if (isShowGenresMenu) {
        dispatch(
          showGenresMenu({
            isShow: false,
          }),
        );
      }
    }
  };

  const onPressCart = () => {
    NavigationActionsService.push(CART_SCREEN, {}, true);
  };

  return (
    <Container>
      <View style={{ flex: 1 }}>
        <CustomHeader
          mainImage
          leftImage={MENU}
          leftAction={toggleDrawer.bind(undefined, true)}
          rightImage={CART}
          rightAction={onPressCart}
        />
        <View style={styles.container}>
          <ScrollableTabView onChangeTab={onChangeTab} renderTabBar={() => <TabView />} locked={true} initialPage={0}>
            <View tabLabel={'Most Popular'} style={styles.container}>
              <MostPopular />
            </View>

            <View tabLabel={'Genres'} style={styles.container}>
              <Genres />
            </View>

            <View tabLabel={'A to Z'} style={styles.container}>
              <AToZ />
            </View>
          </ScrollableTabView>
        </View>
      </View>
    </Container>
  );
};

export default Books;
