import isEmpty from 'lodash/isEmpty';
import React, {useContext, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TabBar} from 'react-native-tab-view';

import {
  useChangeExecutorServiceTicketForFrontOfficeMutation,
  useGetServiceTicketByIdForFrontOfficeLazyQuery,
  useGetTopenersRecentlySupportTicketLazyQuery,
  useGetTopenersSuggestionLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy, useMutationGraphql} from '../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../appData/appContext/appContext';
import {FETCH_POLICY, TOAST_MESSAGE_TYPE} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, normal} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import BaseScreen from '../../../components/BaseScreen';
import CustomButton from '../../../components/Button/CustomButton';
import CustomTabView from '../../../components/CustomTabView';
import {RequestSupportContext} from '../../../hooks/useRequestSupport';
import {SCREEN_SIZE} from '../../../utils/ImageUtil';
import SearchHeader from '../../Search/components/SearchHeader';
import ModalFilterConsultant from './ModalFilterConsultant';
import SelectTopenertList, {initFilterTopener} from './SelectTopenertList';

const routeKeys = {
  available: 'available',
  suggestion: 'suggestion',
};

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: COLORS.PRIMARY_A100,
    height: 3,
    borderRadius: SIZES.BORDER_RADIUS_10,
  },
  tabbarStyle: {
    marginStart: 8,
    backgroundColor: COLORS.BACKGROUND,
    elevation: 0,
  },
  tabTitleActive: {
    ...FONTS.bold,
    fontSize: 12,
    width: SCREEN_SIZE.WIDTH / 2,
    color: COLORS.PRIMARY_A100,
  },
  tabTitle: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.BLACK_33,
  },
  searchHeader: {
    marginLeft: normal,
  },
});

const renderScene = ({
  route,
  consultantSelected,
  supportServiceId,
  currentTopenerId,
  onPressItem,
  filterState,
  propertyPostId,
}) => {
  let query = null;
  let dataKey = null;
  let emptyMessage = null;
  switch (route.key) {
    case routeKeys.available:
      query = useGetTopenersRecentlySupportTicketLazyQuery;
      dataKey = 'getTopenersRecentlySupportTicket';
      emptyMessage = translate('common.emptyRecentlyTopener');
      break;
    case routeKeys.suggestion:
      query = useGetTopenersSuggestionLazyQuery;
      dataKey = 'getTopenersSuggestion';
      emptyMessage = translate('common.emptySuggestionTopener');
      break;
  }
  return (
    <SelectTopenertList
      dataKey={dataKey}
      supportServiceId={supportServiceId}
      currentTopenerId={currentTopenerId}
      propertyPostId={propertyPostId}
      onPressItem={onPressItem}
      consultantSelected={consultantSelected}
      filterState={filterState}
      query={query}
      emptyMessage={emptyMessage}
    />
  );
};

const renderLabel = ({route, focused}) => {
  const textStyle = focused ? styles.tabTitleActive : styles.tabTitle;
  return <Text style={textStyle}>{`${route.title}`}</Text>;
};

const renderTabBar = props => {
  return (
    <TabBar
      {...props}
      style={styles.tabbarStyle}
      indicatorStyle={styles.indicator}
      renderLabel={({route, focused}) => renderLabel({route, focused})}
    />
  );
};

const SelectTopenerScreen = ({navigation, route}) => {
  const {state, setTicketInfo, setConsultantInfo} = useContext(RequestSupportContext);
  const [consultantSelected, setConsultantSelected] = useState(state?.consultantInfo);
  const {showToastInfo} = useContext(AppContext);

  const {
    isChangeTopener = false,
    ticketId,
    propertyPostId,
    currentTopenerId,
    supportServiceId,
  } = route.params;
  const [filterState, setFilterState] = useState(initFilterTopener);

  const {startApi: detailRequestSupport} = useGraphqlApiLazy({
    graphqlApiLazy: useGetServiceTicketByIdForFrontOfficeLazyQuery,
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    dataField: 'getServiceTicketByIdForFrontOffice',
    onSuccess: data => {
      if (data) {
        setTicketInfo(data?.supportServiceTicket);
        navigation.goBack();
      }
    },
  });

  const modalFilterRef = useRef(null);
  const routes = [
    {
      key: routeKeys.available,
      title: translate('common.recentAssistance'),
    },
    {
      key: routeKeys.suggestion,
      title: translate('supportRequest.suggestion'),
    },
  ];

  const {startApi: changeExecutor} = useMutationGraphql({
    graphqlApiLazy: useChangeExecutorServiceTicketForFrontOfficeMutation,
    queryOptions: {},
    dataField: 'changeExecutorServiceTicketForFrontOffice',
    onSuccess: () => {
      detailRequestSupport({
        variables: {
          SupportServiceTicketId: ticketId,
        },
      });
    },
    onError: error => {
      showToastInfo({
        messageType: TOAST_MESSAGE_TYPE.error,
        message: error.errorMessage,
        title: STRINGS.ERROR,
      });
    },
  });

  const onPressNext = () => {
    if (isChangeTopener) {
      changeExecutor({
        variables: {
          input: {
            executorId: consultantSelected.topenerId,
            supportServiceTicketId: ticketId,
          },
        },
      });
      return;
    }
    setConsultantInfo(consultantSelected);
    navigation.goBack();
  };

  const onChangeFilterState = (type, value) => {
    setFilterState({...filterState, [type]: value ?? {}});
  };

  const onPressItem = item => {
    setConsultantSelected(item);
  };

  const buttonNextState = isEmpty(consultantSelected)
    ? {
        disableBtn: true,
        style: {...commonStyles.disabledButtonNext, ...METRICS.resetMargin},
      }
    : {
        disableBtn: false,
        style: commonStyles.buttonNext,
      };

  const modals = (
    <>
      <ModalFilterConsultant
        initState={initFilterTopener}
        applyFilterConsultant={e => onChangeFilterState('workingAreasJson', e)}
        ref={modalFilterRef}
      />
    </>
  );

  return (
    <BaseScreen modals={modals} title={translate('supportRequest.selectTopener')}>
      <SearchHeader
        renderLeft={false}
        placeholder={translate('supportRequest.searchPlaceholder')}
        style={styles.searchHeader}
        onFilterPress={() => modalFilterRef?.current?.open()}
        onChangeKeyword={e => onChangeFilterState('keyword', e)}
      />
      <CustomTabView
        routes={routes}
        renderScene={({route: sceneRoute}) =>
          renderScene({
            route: sceneRoute,
            onPressItem,
            currentTopenerId,
            supportServiceId,
            propertyPostId,
            consultantSelected,
            filterState,
          })
        }
        customTabBar={props => renderTabBar(props)}
        isLazy={true}
      />
      <View style={commonStyles.footerContainer}>
        <CustomButton
          style={{
            ...commonStyles.buttonNext,
            ...HELPERS.fill,
            backgroundColor: COLORS.GRAY_ED,
            marginEnd: normal,
          }}
          onPress={() => navigation.goBack()}
          titleColor={COLORS.BLACK_33}
          titleStyle={{...FONTS.bold}}
          title={translate('supportRequest.create.back')}
        />
        <CustomButton
          style={[buttonNextState.style, HELPERS.fill]}
          title={translate('supportRequest.create.next')}
          disabled={buttonNextState.disableBtn}
          titleStyle={{...FONTS.bold}}
          onPress={onPressNext}
        />
      </View>
    </BaseScreen>
  );
};

export default SelectTopenerScreen;
