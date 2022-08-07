import styles from './styles';
import Container from '@src/components/Container';
import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import translate from '@src/localize';
import { CustomFlatList } from '@src/components/FlatList';
import DocumentItem from '@src/components/FlatListItem/DocumentItem';
import NavigationActionsService from '@src/navigation/navigation';
import { DOCUMENT_DETAIL_TENANT } from '@src/constants/screenKeys';
import { debounce, upperCase } from 'lodash';
import CustomSectionHeader from '@src/components/CustomSection';
import ICON_DOCUMENT from '@src/res/icons/icon-document.png';
import { ICompanyDocument } from '@reup/reup-api-sdk/libs/api/company/document/models';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { QueryCompanyDocumentParams } from '@reup/reup-api-sdk/libs/api/company/document';
import { getListDocument } from '@src/modules/Company/actions';
import { LimitLoadMore } from '@src/constants/vars';
import SearchBar from '@src/components/SearchBar';

const DocumentTenant = () => {
  const dispatch = useDispatch()

  const flatList = useRef<any>(null)

  const documents = useSelector<RootState, IPagination<ICompanyDocument>>((state: RootState) => state.company.listDocument);

  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const defaultPropertyId = me.default_property ?? '';
  const [isLoadedData, setLoadedData] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const debounceLoadData = debounce((p: QueryCompanyDocumentParams) => {
    fetchDocuments(p, 1)
  }, 500);

  const [params, setParams] = useState<QueryCompanyDocumentParams>({
    search: '',
    me: false,
    country_id: '',
    type: undefined,
  })

  useEffect(() => {
    if (isLoadedData && me && me.default_property && me.default_property) {
      const p: QueryCompanyDocumentParams = {
        search: searchText,
        me: false,
        country_id: '',
        type: undefined,
      }
      onReloadDataWithParams(p)
    }
  }, [me.default_property])

  useEffect(() => {
    if (isLoadedData) {
      const p = {
        ...params,
        search: searchText
      }
      if (flatList && flatList.current) {
        flatList.current.resetInitPage(1);
        flatList.current.scrollToTop();
      }
      debounceLoadData(p);
    }
  }, [searchText])

  const onReloadDataWithParams = (p: QueryCompanyDocumentParams) => {
    setParams(p)
    if (flatList && flatList.current) {
      flatList.current.resetInitPage(1);
      flatList.current.scrollToTop();
    }
    setTimeout(() => {
      fetchDocuments(p, 1);
    }, 200)
  }

  const fetchDocuments = (params: QueryCompanyDocumentParams, page: number, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    if (defaultPropertyId) {
      dispatch(
        getListDocument({
          id: defaultPropertyId,
          page: page,
          limit: LimitLoadMore,
          params: params,
          onFail: () => {
            onLoadFailure && onLoadFailure()
            setLoadedData(true);
          },
          onSuccess: () => {
            onLoadSuccess && onLoadSuccess()
            setLoadedData(true);
          },
        })
      )
    }
  }

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    fetchDocuments(params, page, onLoadSuccess, onLoadFailure)
  };

  const onPressDocumentItem = (item: any) => {
    NavigationActionsService.push(DOCUMENT_DETAIL_TENANT, { item });
  };

  const _itemSeparator = () => {
    return (
      <View style={styles.separator} />
    );
  };

  const renderDocumentItem = (item: ICompanyDocument) => {
    return (
      <DocumentItem item={item} onPress={onPressDocumentItem.bind(undefined, item)} />
    );
  };

  const renderDocument = () => {
    return (
      <View style={styles.flatListView}>
        <CustomFlatList
          ref={flatList}
          contentContainerStyle={styles.contentContainerFlatList}
          onLoad={onLoad}
          ItemSeparatorComponent={_itemSeparator}
          data={documents.results}
          renderItem={renderDocumentItem}
          hasNext={documents.next}
          loadMore={true}
          pullToRefresh={true}
        />
      </View>
    );
  };

  const onChangeSearchText = (text: string) => {
    setSearchText(text);
  }

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <SearchBar
        value={searchText}
        onChangeText={onChangeSearchText}
        placeholder={translate('document.search_document')} />
    </View>
  );

  return (
    <Container isShowHeader={true} title={translate('document.navigation_title')} isDisplayBackButton={true}>
      <View style={styles.container}>
        <CustomSectionHeader
          style={styles.headers}
          title={`${upperCase(translate('document.navigation_title'))}`}
          styleTitle={styles.styleTitle}
          styleTitleContain={styles.styleTitleContain}
          icon={ICON_DOCUMENT}
          isShowFilter={false}
        />
        {renderSearchBar()}
        {renderDocument()}
      </View>
    </Container>
  );
};

export default React.memo(DocumentTenant);
