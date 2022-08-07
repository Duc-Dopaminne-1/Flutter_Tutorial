import React, {useContext, useRef, useState} from 'react';
import {Keyboard} from 'react-native';

import {
  ApproveCrawlerDataMutationVariables,
  ApproveCrawlerDataResponse,
  UpdateCrawlerProcessRefuseStatusMutationVariables,
  useApproveCrawlerDataMutation,
  useUpdateCrawlerProcessRefuseStatusMutation,
} from '../../../api/graphql/generated/graphql';
import {useMutationGraphql} from '../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {FETCH_POLICY, TIME_OUT} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import BaseScreen from '../../../components/BaseScreen';
import ScreenIds from '../../ScreenIds';
import CrawlerFilterUtil, {
  getAcreageRange,
  getPriceRange,
  getPropertyTypes,
  getRejectReasonCrawler,
} from './CrawlerFilterUtil';
import CrawlerModalsContainer, {CrawlerModalType} from './CrawlerModalsContainer';
import PropertyPostCrawlerContainer from './PropertyPostCrawlerContainer';
import {useGetSummary} from './useGetSummary';

const mapState = propertyTypes => {
  const filterData = CrawlerFilterUtil.getInitialFilterData();
  return {
    searchWord: '',
    filterData,
    acreageRangeData: getAcreageRange(),
    priceRangeData: getPriceRange(),
    propertyTypes,
  };
};

const PropertyPostCrawlerScreen = ({navigation}) => {
  const {getMasterData, showAppSpinner, showErrorAlert} = useContext(AppContext);
  const propertyTypes = getPropertyTypes(getMasterData());
  const [state, setState] = useState(mapState(propertyTypes));
  const [modalType, setModalType] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const {summary, getSummary} = useGetSummary();
  const [removedItemId, setRemovedItemId] = useState(null);
  const filter = CrawlerFilterUtil.getFilterByState(state.filterData, state.searchWord);

  const {startApi: deleteItem} = useMutationGraphql({
    showSpinner: true,
    graphqlApiLazy: useUpdateCrawlerProcessRefuseStatusMutation,
    dataField: 'updateCrawlerProcessRefuseStatus',
    queryOptions: {...FETCH_POLICY.NO_CACHE},
  });

  const {startApi: approveItem} = useMutationGraphql({
    showSpinner: true,
    graphqlApiLazy: useApproveCrawlerDataMutation,
    dataField: 'approveCrawlerData',
    queryOptions: {...FETCH_POLICY.NO_CACHE},
  });

  const modalFilterRef = useRef();
  const showFilter = () => {
    setModalType(CrawlerModalType.FILTER);
    Keyboard.dismiss();
    setTimeout(() => {
      modalFilterRef.current?.open();
    }, TIME_OUT);
  };
  const onCloseModal = () => {
    modalFilterRef.current?.close();
  };

  const onKeywordChange = searchKey => {
    const searchState = {searchWord: searchKey};
    setState({...state, ...searchState});
  };

  const onApplyFilter = data => {
    const dataFilter = {filterData: data};
    setState({...state, ...dataFilter});
    onCloseModal();
  };

  const onConfirmed = data => {
    if (modalType === CrawlerModalType.FILTER) {
      onApplyFilter(data);
    } else {
      const variables: UpdateCrawlerProcessRefuseStatusMutationVariables = {
        input: {
          crawlerProcessId: data.propertyPostId,
          crawlerRefuseReasonId: data.id,
          crawlerRefuseReason: data.note,
        },
      };
      deleteItem({variables}, () => {
        getSummary();
        onCloseModal();
        setRemovedItemId(data.propertyPostId);
      });
    }
  };

  const onRemoveCrawler = propertyPostId => {
    setModalType(CrawlerModalType.REJECT);
    setState({...state, propertyPostId, rejectReasons: getRejectReasonCrawler()});
    Keyboard.dismiss();
    setTimeout(() => {
      modalFilterRef.current?.open();
    }, TIME_OUT);
  };

  const isPressPublic = useRef(false);
  const onPublicCrawler = propertyPostId => {
    if (isPressPublic.current === true) {
      return;
    }
    isPressPublic.current = true;
    const variables: ApproveCrawlerDataMutationVariables = {
      input: {
        crawlerProcessId: propertyPostId,
      },
    };
    approveItem(
      {variables},
      (response: ApproveCrawlerDataResponse) => {
        getSummary();
        const TIMEOUT_WAITING_JOB_SYNC_DATA = 1000;
        showAppSpinner(true);
        setTimeout(() => {
          showAppSpinner(false);
          setRemovedItemId(propertyPostId);
          isPressPublic.current = false;
          navigation.navigate(ScreenIds.ViewPropertyPost, {
            propertyPostId: response?.propertyPostId,
            viewByOtherMode: false,
          });
        }, TIMEOUT_WAITING_JOB_SYNC_DATA);
      },
      error => {
        showErrorAlert(error.message, () => {
          isPressPublic.current = false;
        });
      },
    );
  };

  const modals = (
    <CrawlerModalsContainer
      modalType={modalType}
      state={state}
      dispatch={setState}
      modalRef={modalFilterRef}
      onConfirmed={onConfirmed}
      onPressCancel={onCloseModal}
    />
  );

  return (
    <BaseScreen modals={modals} title={translate('propertyPost.crawler.propertyPostCrawler')}>
      <PropertyPostCrawlerContainer
        filter={filter}
        showFilter={showFilter}
        onKeywordChange={onKeywordChange}
        postCount={postCount}
        removedItemId={removedItemId}
        summary={summary}
        onChangeTotalPost={setPostCount}
        onPublicCrawler={onPublicCrawler}
        onRemoveCrawler={onRemoveCrawler}
      />
    </BaseScreen>
  );
};

export default PropertyPostCrawlerScreen;
