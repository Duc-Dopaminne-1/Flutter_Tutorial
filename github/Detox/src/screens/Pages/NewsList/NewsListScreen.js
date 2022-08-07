import React, {useContext, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useSubscribeEmailForNewsMutation} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../appData/appContext/appContext';
import {categoriesNews, FETCH_POLICY} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {Message} from '../../../assets/localize/message/Message';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import BaseScreen from '../../../components/BaseScreen';
import ModalWithModalize from '../../../components/Modal/ModalWithModalize';
import {Captcha} from '../../../components/RecaptchaV2/Captcha';
import {RightIcon} from '../../../components/RightIcon';
import {callAfterInteraction} from '../../commonHooks';
import SearchBox from '../../Home/SearchBox';
import ScreenIds from '../../ScreenIds';
import ThumbnailArticleList from '../ThumbnailArticleList/ThumbnailArticleList';
import NewsCategories from './NewsCategories';
import SubscribeModal from './SubscribeModal';

const NewsListScreen = ({navigation}) => {
  const [selectedCategory, selectCategory] = useState(categoriesNews[0]);
  const modalizeRef = useRef(null);
  const captchaRef = useRef(null);
  const subscribeModalRef = useRef(null);

  const {showMessageAlert} = useContext(AppContext);
  const {startApi: subscribeEmailForNews} = useGraphqlApiLazy({
    graphqlApiLazy: useSubscribeEmailForNewsMutation,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'subscribeEmailForNews',
    onSuccess: response => {
      callAfterInteraction(() => {
        const {errorCode} = response;
        if (errorCode === 0) {
          modalizeRef?.current?.close();
          showMessageAlert(
            translate('news.receiveSuccessTitle'),
            translate('news.receiveSuccessSubTitle'),
          );
        }
      });
    },
    showSpinner: true,
    onError: error => {
      const {errorResponse, errorMessageCode} = error;
      if (errorMessageCode === Message.SN_ERR_002) {
        callAfterInteraction(() => {
          if (errorResponse?.isRequiredToUseCaptcha) {
            subscribeModalRef.current?.apply(!!errorResponse?.isRequiredToUseCaptcha);
          }
        });
      } else {
        const message = error.errorMessage;
        showMessageAlert(translate(STRINGS.DEFAULT_MODAL_TITLE), message);
      }
    },
  });

  const goToSearchScreen = () => {
    navigation.navigate(ScreenIds.SearchNewsScreen);
  };

  const onReceivePress = () => {
    modalizeRef?.current?.open();
  };

  const onCancelModal = () => {
    modalizeRef?.current?.close();
  };

  const onApplyModal = ({email, isRequiredToUseCaptcha}) => {
    if (isRequiredToUseCaptcha) {
      captchaRef?.current?.show(captcha => {
        if (captcha) {
          subscribeEmailForNews({
            variables: {
              input: {
                email,
                tokenCaptcha: captcha,
              },
            },
          });
        }
      });
    } else {
      subscribeEmailForNews({
        variables: {
          input: {
            email,
            tokenCaptcha: '',
          },
        },
      });
    }
  };

  const renderModals = () => {
    return (
      <ModalWithModalize getModalRef={modalizeRef}>
        <SubscribeModal
          ref={subscribeModalRef}
          onPressApply={onApplyModal}
          onPressCancel={onCancelModal}
        />
      </ModalWithModalize>
    );
  };

  return (
    <Captcha ref={captchaRef}>
      <BaseScreen
        title={translate('news.pageTitle')}
        modals={renderModals()}
        rightComponent={
          <RightIcon
            onPress={onReceivePress}
            label={translate('news.receiveNews')}
            IconComponent={() => <Ionicons name="md-mail" size={20} color={COLORS.BLACK_31} />}
          />
        }>
        <View style={styles.header}>
          <NewsCategories
            categories={categoriesNews}
            onSelectCategory={selectCategory}
            selectedCategory={selectedCategory}
          />
          <SearchBox
            onSearch={goToSearchScreen}
            searchPlaceHolder={translate('common.searchNewsPlaceholder')}
            visibleRight={false}
            containerStyle={styles.searchBoxContainer}
          />
        </View>
        <View style={styles.contentContainer}>
          <ThumbnailArticleList
            articleType={selectedCategory.id}
            categories={categoriesNews}
            title={selectedCategory.text}
          />
        </View>
      </BaseScreen>
    </Captcha>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  searchBoxContainer: {
    zIndex: 1,
  },
  header: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    zIndex: 1,
  },
});

export default NewsListScreen;
