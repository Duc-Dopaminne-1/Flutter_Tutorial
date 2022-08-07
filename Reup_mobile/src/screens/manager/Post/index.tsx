import React, { useState, useEffect, useRef } from 'react';
import styles from './styles';
import { View, ScrollView, Alert } from 'react-native';
import Container from '@src/components/Container';
import ForLeaseForSale from '@src/components/ForLeaseForSale';
import CustomTabbar from '@src/components/CustomTabbar';
import { CustomButton } from '@src/components/CustomButton';
import { ADD_PLUS } from '@src/constants/icons';
import translate from '@src/localize';
import ICON_HOME_SALE from '@res/icons/ForLeaseForSale/icon-home-sale.png';
import CustomSectionHeader from '@src/components/CustomSection';
import NavigationActionsService from '@src/navigation/navigation';
import { POST_DETAIL, NEW_POST, FILTER } from '@src/constants/screenKeys';
import { PostItemModal, PostTypeFor } from '@src/components/ForLeaseForSale/ItemForLeaseForSale';
import { useDispatch, useSelector } from 'react-redux';
import { QueryCompanyBulletinBoardForLeaseParams } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/for-lease';
import { SortDir, BulletinPostStatus } from '@reup/reup-api-sdk/libs/api/enum';
import { QueryCompanyBulletinBoardForSaleParams } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/for-sale';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { ICompanyBulletinBoardForLease } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/for-lease/models';
import { ICompanyBulletinBoardForSale } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/for-sale/models';
import { LimitLoadMore } from '@src/constants/vars';
import { getListForLease, getListForSale } from '@src/modules/bulletin/actions';

const Post = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState<PostTypeFor>(PostTypeFor.FOR_LEASE)
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const defaultCompanyId = me.default_company.id ?? ''
  const forLeaseList = useSelector<RootState, IPagination<ICompanyBulletinBoardForLease>>((state: RootState) => state.bulletin.listForLease);
  const forSaleList = useSelector<RootState, IPagination<ICompanyBulletinBoardForSale>>((state: RootState) => state.bulletin.listForSale);
  const forLeaseFlatList = useRef<any>(null)
  const forSaleFlatList = useRef<any>(null)

  const [displayForlease, setDisplayForLease] = useState<PostItemModal[]>([])
  const [displayForSale, setDisplayForSale] = useState<PostItemModal[]>([])
  const [isLoadedDataForLease, setLoadedDataForLease] = useState<boolean>(false)
  const [isLoadedDataForSale, setLoadedDataForSale] = useState<boolean>(false)

  const [paramsForLease, setParamsForLease] = useState<QueryCompanyBulletinBoardForLeaseParams>({
    status: undefined,
    sort_by: undefined,
    sort_dir: SortDir.ASC,
    property_id: '',
    country_id: ''
  });
  const [paramsForSale, setParamsForSale] = useState<QueryCompanyBulletinBoardForSaleParams>({
    status: undefined,
    sort_by: undefined,
    sort_dir: SortDir.ASC,
    property_id: '',
    country_id: ''
  });

  useEffect(() => {
    if (me && me.default_company && me.default_company.id) {
      if (isLoadedDataForLease) {
        const pForLease: QueryCompanyBulletinBoardForLeaseParams = {
          status: undefined,
          sort_by: undefined,
          sort_dir: SortDir.ASC,
          property_id: '',
          country_id: ''
        }
        setParamsForLease(pForLease)

        forLeaseFlatList && forLeaseFlatList.current && forLeaseFlatList.current.scrollToTop()
        forLeaseFlatList && forLeaseFlatList.current && forLeaseFlatList.current.resetInitPage(1);
        setTimeout(() => {
          fetchListForLease(1, { ...pForLease })
        }, 200);
      }
      if (isLoadedDataForSale) {
        const pForSale: QueryCompanyBulletinBoardForSaleParams = {
          status: undefined,
          sort_by: undefined,
          sort_dir: SortDir.ASC,
          property_id: '',
          country_id: ''
        }
        setParamsForSale(pForSale)
        forSaleFlatList && forSaleFlatList.current && forSaleFlatList.current.scrollToTop()
        forSaleFlatList && forSaleFlatList.current && forSaleFlatList.current.resetInitPage(1);

        setTimeout(() => {
          fetchListForSale(1, { ...pForSale })
        }, 200);
      }
    }
  }, [me.default_company.id])

  useEffect(() => {
    let listForlease: PostItemModal[] = []
    forLeaseList.results.forEach((item: ICompanyBulletinBoardForLease) => {
      const displayItem: PostItemModal = {
        thumbnail: item.thumbnail ? item.thumbnail : '',
        title: item.title ? item.title : '',
        description: item.description ? item.description : '',
        price: item.price ? item.price : 0,
        type: PostTypeFor.FOR_LEASE,
        companyId: item.company_id ? item.company_id : '',
        created: item.created ? item.created : '',
        creator: item.creator ? item.creator : undefined,
        currency: item.currency ? item.currency : '',
        id: item.id ? item.id : '',
        imageURLs: item.image_urls ? item.image_urls : [],
        isRemove: item.is_removed ? item.is_removed : false,
        modified: item.modified ? item.modified : "",
        propertyId: item.property_id ? item.property_id : "",
        status: item.status ? item.status : BulletinPostStatus.Pending,
        per: item.per ? item.per : "",
        unit: item.unit ? item.unit : "",
      }
      listForlease.push(displayItem)
    })
    setDisplayForLease(listForlease)
  }, [forLeaseList]);

  useEffect(() => {
    let listForSale: PostItemModal[] = []
    forSaleList.results.forEach((item: ICompanyBulletinBoardForSale) => {
      const displayItem: PostItemModal = {
        thumbnail: item.thumbnail ? item.thumbnail : '',
        title: item.title ? item.title : '',
        description: item.description ? item.description : '',
        price: item.price ? item.price : 0,
        type: PostTypeFor.FOR_SALE,
        companyId: item.company_id ? item.company_id : '',
        created: item.created ? item.created : '',
        creator: item.creator ? item.creator : undefined,
        currency: item.currency ? item.currency : '',
        id: item.id ? item.id : '',
        imageURLs: item.image_urls ? item.image_urls : [],
        isRemove: item.is_removed ? item.is_removed : false,
        modified: item.modified ? item.modified : "",
        propertyId: item.property_id ? item.property_id : "",
        status: item.status ? item.status : BulletinPostStatus.Pending,
        unit: item.unit ? item.unit : "",
      }
      listForSale.push(displayItem)
    })
    setDisplayForSale(listForSale)
  }, [forSaleList]);

  const fetchListForLease = (page?: number, param?: QueryCompanyBulletinBoardForLeaseParams, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    dispatch(
      getListForLease({
        id: defaultCompanyId,
        page: page,
        limit: LimitLoadMore,
        params: param,
        onSuccess: (data) => {
          onLoadSuccess && onLoadSuccess();
          setLoadedDataForLease(true)
        },
        onFail: error => {
          onLoadFailure && onLoadFailure();
          setLoadedDataForLease(true)
        }
      })
    )
  }

  const fetchListForSale = (page?: number, param?: QueryCompanyBulletinBoardForSaleParams, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    dispatch(
      getListForSale({
        id: defaultCompanyId,
        page: page,
        limit: LimitLoadMore,
        params: param,
        onSuccess: (data) => {
          onLoadSuccess && onLoadSuccess();
          setLoadedDataForSale(true)
        },
        onFail: error => {
          onLoadFailure && onLoadFailure();
          setLoadedDataForSale(true)
        }
      })
    )
  }

  const onLoadForLease = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    fetchListForLease(page, { ...paramsForLease }, onLoadSuccess, onLoadFailure)
  };

  const onLoadForSale = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    fetchListForSale(page, { ...paramsForSale }, onLoadSuccess, onLoadFailure)
  };

  const onApplyFilterForLease = (filter: any) => {
    console.log('filter:', filter);
    if (filter) {
      let sortBy: SortDir = SortDir.ASC
      if (filter.sortByLatest === 'all') {
        sortBy = SortDir.ASC
      } else {
        sortBy = SortDir.DESC
      }
      let pForLease = paramsForLease
      pForLease = {
        country_id: filter.country,
        property_id: filter.building,
        sort_dir: sortBy,
      }
      setParamsForLease(pForLease)
      if (forLeaseFlatList && forLeaseFlatList.current) {
        forLeaseFlatList.current.resetInitPage(1);
        forLeaseFlatList.current.scrollToTop();
      }

      setTimeout(() => {
        fetchListForLease(1, pForLease)
      }, 200)
    }
  };

  const onApplyFilterForSale = (filter: any) => {
    console.log('filter:', filter);
    if (filter) {
      let sortBy: SortDir = SortDir.ASC
      if (filter.sortByLatest === 'all') {
        sortBy = SortDir.ASC
      } else {
        sortBy = SortDir.DESC
      }
      let pForSale = paramsForSale

      pForSale = {
        country_id: filter.country,
        property_id: filter.building,
        sort_dir: sortBy,
      }
      setParamsForSale(pForSale)
      if (forSaleFlatList && forSaleFlatList.current) {
        forSaleFlatList.current.resetInitPage(1);
        forSaleFlatList.current.scrollToTop();
      }
      setTimeout(() => {
        fetchListForSale(1, pForSale)
      }, 200)
    }
  };

  const onPressFilterForLease = () => {
    NavigationActionsService.push(FILTER, {
      numberOfInput: 3, isSortByLatest: true,
      indexSortByLatest: 2, onFilter: onApplyFilterForLease
    });
  };

  const onPressFilterForSale = () => {
    NavigationActionsService.push(FILTER, {
      numberOfInput: 1,
      isSortByLatest: true,
      indexSortByLatest: 0,
      onFilter: onApplyFilterForSale
    });

  };

  const renderHeaderSection = (headerTitle: string, onPressFilter: () => void) => {
    return (
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={headerTitle}
        icon={ICON_HOME_SALE}
        isShowFilter={true}
        onPressFilter={onPressFilter}
      />);
  };

  const onPressItem = (data: PostItemModal) => {
    NavigationActionsService.push(POST_DETAIL, { forLeaseFlatList, forSaleFlatList, data: data });
  };

  const renderForlease = () => {
    return (
      <View style={styles.flexStyle}>
        {renderHeaderSection(translate('post.forlease_title1'), onPressFilterForLease)}
        <ForLeaseForSale
          headerTitle={translate('post.forlease_title1')}
          showFilter={false}
          showViewMore={false}
          data={displayForlease}
          hasNext={forLeaseList.next}
          loadMore={true}
          pullToRefresh={true}
          isShowHeader={false}
          onPress={onPressItem}
          flatList={forLeaseFlatList}
          onLoad={onLoadForLease}
        />
      </View >
    );
  };

  const renderForSale = () => {
    return (
      <View style={styles.flexStyle}>
        {renderHeaderSection(translate('post.forsale_title1'), onPressFilterForSale)}
        <ForLeaseForSale
          headerTitle={translate('post.forsale_title1')}
          showFilter={false}
          showViewMore={false}
          data={displayForSale}
          hasNext={forSaleList.next}
          loadMore={true}
          pullToRefresh={true}
          isShowHeader={false}
          onPress={onPressItem}
          flatList={forSaleFlatList}
          onLoad={onLoadForSale}
        />
      </View >
    );
  };
  const views = [renderForlease(), renderForSale()];
  const titles = [translate('post.forlease_title2'), translate('post.forsale_title2')];

  const onPressAddPost = () => {
    NavigationActionsService.push(NEW_POST, { forLeaseFlatList, forSaleFlatList, currentPage });
  };

  return (
    <Container isShowHeader={true} spaceBottom={true} title={translate('post.title')}>
      <View style={styles.container}>
        <CustomTabbar titles={titles} views={views} styleContentContainer={styles.flexStyle} onChangePage={(index: number) => {
          index === 0 ? setCurrentPage(PostTypeFor.FOR_LEASE) : setCurrentPage(PostTypeFor.FOR_SALE)
        }} />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton onPress={onPressAddPost} iconLeft={ADD_PLUS} text={translate('post.add_new_post')} style={styles.button} />
      </View>
    </Container>
  );
};


export default Post;
