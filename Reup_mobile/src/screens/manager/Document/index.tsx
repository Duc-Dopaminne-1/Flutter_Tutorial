import styles from './styles';
import Container from '@src/components/Container';
import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import translate from '@src/localize';
import { CustomFlatList } from '@src/components/FlatList';
import DocumentItem from '@src/components/FlatListItem/DocumentItem';
import NavigationActionsService from '@src/navigation/navigation';
import { DOCUMENT_DETAIL, FILTER } from '@src/constants/screenKeys';
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
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import { LimitLoadMore } from '@src/constants/vars';
import { DocumentType } from '@reup/reup-api-sdk/libs/api/enum';
import SearchBar from '@src/components/SearchBar';

const Document = () => {
  const dispatch = useDispatch()

  const flatList = useRef<any>(null)

  const documents = useSelector<RootState, IPagination<ICompanyDocument>>((state: RootState) => state.company.listDocument);

  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const defaultCompanyId = me.default_company.id ?? '';
  const [isLoadedData, setLoadedData] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const debounceLoadData = debounce((p: QueryCompanyDocumentParams) => {
    fetchDocuments(p, 1)
  }, 500);

  const [params, setParams] = useState<QueryCompanyDocumentParams>({
    search: '',
    me: false,
    country_id: '',
    property_id: '',
    type: undefined
  })

  const showByObj: ObjDropdown[] = [
    { _key: 'BuildingDocument', _value: translate('document.building_documents') },
    { _key: 'MyDocument', _value: translate('document.my_documents') }
  ]

  const dataType: ObjDropdown[] = [
    { _key: '', _value: translate('document.all_type') },
    { _key: DocumentType.General, _value: translate('document.general') },
    { _key: DocumentType.Instruction, _value: translate('document.instruction') }
  ]

  useEffect(() => {
    if (isLoadedData && me && me.default_company && me.default_company.id) {
      const p = {
        search: searchText,
        me: false,
        country_id: '',
        property_id: '',
        type: undefined
      }
      onReloadDataWithParams(p)
    }
  }, [me.default_company.id])

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
    if (defaultCompanyId) {
      dispatch(
        getListDocument({
          id: defaultCompanyId,
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
    NavigationActionsService.push(DOCUMENT_DETAIL, { item });
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
          contentContainerStyle={styles.contentContainerFlatlist}
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

  const onApplyFilter = (filter: any) => {
    const p = {
      search: searchText,
      country_id: filter.country ?? '',
      property_id: filter.building ?? '',
      me: filter.showBy && filter.showBy === showByObj[1]._key,
      type: filter.allType ?? undefined
    }
    onReloadDataWithParams(p)
  }

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER, {
      numberOfInput: 2,
      isShowBy: true,
      indexShowBy: 0,
      dataShowBy: showByObj,
      isAllType: true,
      indexAllType: 1,
      dataType: dataType,
      onFilter: onApplyFilter
    });
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
          isShowFilter={true}
          onPressFilter={onPressFilter}
        />
        {renderSearchBar()}
        {renderDocument()}
      </View>
    </Container>
  );
};

export default React.memo(Document);
