import React, { useState, useEffect, useRef } from 'react';
import styles from './styles';
import { View } from 'react-native';
import Container from '@src/components/Container';
import ForLeaseForSale from '@src/components/ForLeaseForSale';
import CustomTabbar from '@src/components/CustomTabbar';
import { CustomButton } from '@src/components/CustomButton';
import { ADD_PLUS } from '@src/constants/icons';
import translate from '@src/localize';
import ICON_HOME_SALE from '@res/icons/ForLeaseForSale/icon-home-sale.png';
import CustomSectionHeader from '@src/components/CustomSection';
import NavigationActionsService from '@src/navigation/navigation';
import { NEW_POST_TENANT, POST_DETAIL_TENANT } from '@src/constants/screenKeys';
import { PostItemModal, PostTypeFor } from '@src/components/ForLeaseForSale/ItemForLeaseForSale';
import { useDispatch, useSelector } from 'react-redux';
import { SortDir, BulletinPostStatus } from '@reup/reup-api-sdk/libs/api/enum';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { LimitLoadMore } from '@src/constants/vars';
import { getListForLease, getListForSale } from '@src/modules/bulletin/actions';
import { IProperty } from '@reup/reup-api-sdk/libs/api/company/property/model';
import { findIndex } from 'lodash';
import { QueryResidentBulletinBoardForLeaseParams } from '@reup/reup-api-sdk/libs/api/resident/bulletin/for-lease';
import { QueryResidentBulletinBoardForSaleParams } from '@reup/reup-api-sdk/libs/api/resident/bulletin/for-sale';
import { IResidentBulletinBoardForLease } from '@reup/reup-api-sdk/libs/api/resident/bulletin/for-lease/models';
import { IResidentBulletinBoardForSale } from '@reup/reup-api-sdk/libs/api/resident/bulletin/for-sale/models';

const PostTenant = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState<PostTypeFor>(PostTypeFor.FOR_LEASE)

  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const listMyProperty = useSelector<RootState, IProperty[]>((state: RootState) => state.company.listMyProperty.results);
  const defaultPropertyId = me && me.default_property
  const defaultProperty: IProperty = listMyProperty && listMyProperty.length
    ? listMyProperty[findIndex(listMyProperty, { id: defaultPropertyId }) ?? 0]
    : { id: defaultPropertyId, name: '' }

  const forLeaseList = useSelector<RootState, IPagination<IResidentBulletinBoardForLease>>((state: RootState) => state.bulletin.listForLease);
  const forSaleList = useSelector<RootState, IPagination<IResidentBulletinBoardForSale>>((state: RootState) => state.bulletin.listForSale);
  const forLeaseFlatList = useRef<any>(null)
  const forSaleFlatList = useRef<any>(null)

  const [displayForlease, setDisplayForLease] = useState<PostItemModal[]>([])
  const [displayForSale, setDisplayForSale] = useState<PostItemModal[]>([])
  const [isLoadedDataForLease, setLoadedDataForLease] = useState<boolean>(false)
  const [isLoadedDataForSale, setLoadedDataForSale] = useState<boolean>(false)


  useEffect(() => {
    if (isLoadedDataForLease) {
      forLeaseFlatList && forLeaseFlatList.current && forLeaseFlatList.current.scrollToTop()
      forLeaseFlatList && forLeaseFlatList.current && forLeaseFlatList.current.resetInitPage(1);
      setTimeout(() => {
        fetchListForLease(1)
      }, 200);
    }
    if (isLoadedDataForSale) {
      forSaleFlatList && forSaleFlatList.current && forSaleFlatList.current.scrollToTop()
      forSaleFlatList && forSaleFlatList.current && forSaleFlatList.current.resetInitPage(1);
      setTimeout(() => {
        fetchListForSale(1)
      }, 200);
    }
  }, [me])

  useEffect(() => {
    let listForlease: PostItemModal[] = []
    forLeaseList.results.forEach((item: IResidentBulletinBoardForLease) => {
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
    forSaleList.results.forEach((item: IResidentBulletinBoardForSale) => {
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

  const fetchListForLease = (page?: number, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    if (!defaultProperty) {
      return
    }
    const param: QueryResidentBulletinBoardForLeaseParams = {
      sort_by: undefined,
      sort_dir: SortDir.ASC,
      me: false
    }
    dispatch(
      getListForLease({
        id: defaultProperty.id,
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

  const fetchListForSale = (page?: number, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    if (!defaultProperty) {
      return
    }
    const param: QueryResidentBulletinBoardForSaleParams = {
      sort_by: undefined,
      sort_dir: SortDir.ASC,
      me: false
    }
    dispatch(
      getListForSale({
        id: defaultProperty.id,
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
    fetchListForLease(page, onLoadSuccess, onLoadFailure)
  };

  const onLoadForSale = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    fetchListForSale(page, onLoadSuccess, onLoadFailure)
  };


  const renderHeaderSection = (headerTitle: string) => {
    return (
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={headerTitle}
        icon={ICON_HOME_SALE}
        isShowFilter={false}
      />);
  };

  const onPressItem = (data: PostItemModal) => {
    NavigationActionsService.push(POST_DETAIL_TENANT, { forLeaseFlatList, forSaleFlatList, data: data });
  };

  const renderForlease = () => {
    return (
      <View style={styles.flexStyle}>
        {renderHeaderSection(translate('post.forlease_title1'))}
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
          isShowStatus={false}
        />
      </View >
    );
  };

  const renderForSale = () => {
    return (
      <View style={styles.flexStyle}>
        {renderHeaderSection(translate('post.forsale_title1'))}
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
          isShowStatus={false}
        />
      </View >
    );
  };
  const views = [renderForlease(), renderForSale()];
  const titles = [translate('post.forlease_title2'), translate('post.forsale_title2')];

  const onPressAddPost = () => {
    NavigationActionsService.push(NEW_POST_TENANT, { forLeaseFlatList, forSaleFlatList, currentPage });
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


export default PostTenant;
