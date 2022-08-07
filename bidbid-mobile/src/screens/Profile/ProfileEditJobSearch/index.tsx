import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ViewStyle, ActivityIndicator, TextStyle } from 'react-native';
import { colors } from '@/vars';
import { useDispatch } from 'react-redux';
import { getJobs, createJob, updateJob } from '@/redux/user/actions';
import { useNavigation } from '@react-navigation/native';
import SearchBar from './components/SearchBar';
import { SafeArea } from '@/components/SafeArea';
import { language } from '@/i18n';
import JobSearchItem from '@/screens/Profile/ProfileEditJobSearch/components/JobSearchItem';
import useEnableHardwareBackButton from '@/shared/useEnableHardwareBackButton';

const FLAT_LIST: ViewStyle = {
  flex: 1,
};

const LOADING: TextStyle = {
  paddingVertical: 20,
  color: colors.black,
};

const SEPARATOR_VIEW: ViewStyle = {
  flex: 1,
  height: 1,
  marginHorizontal: 15,
  backgroundColor: colors.gray_100,
};

let currentPageTmp = 1;
let perPageTmp = 20;
let keyWorkTmp = '';

export function ProfileEditJobSearchScreen(): ReactElement {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEnableHardwareBackButton();

  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let onEndReachedCalledDuringMomentum = true;

  useEffect(() => {
    async function fetchJobs() {
      const result = await getJobsApi();
      setListData(result);
    }
    fetchJobs().then(_r => undefined);

    return () => {
      currentPageTmp = 1;
      perPageTmp = 20;
      keyWorkTmp = '';
    };
  }, []);

  const getJobsApi = async (): Promise<any[]> => {
    return new Promise(resolve =>
      dispatch(
        getJobs({
          keyWork: keyWorkTmp.trim(),
          currentPage: currentPageTmp,
          perPage: perPageTmp,
          callback: {
            onSuccess: result => {
              const { perPage, currentPage } = result.meta;
              const { items } = result;
              currentPageTmp = currentPage;
              perPageTmp = perPage;
              return resolve(items);
            },
            onFail: () => {
              setIsLoading(false);
              return resolve([]);
            },
          },
        }),
      ),
    );
  };

  const onChangeSuggestResult = async (_result: any[], keyWork: string) => {
    keyWorkTmp = keyWork;
    currentPageTmp = 1;
    perPageTmp = 20;
    setIsLoading(true);
    const jobs = await getJobsApi();
    setIsLoading(false);
    setListData([...jobs]);
  };

  const cellOnPressed = async item => {
    if (typeof item === 'string') {
      const result = await dispatch(createJob({ name: item.trim() }));
      if (result) navigation.goBack();
    } else {
      const result = await dispatch(updateJob({ jobId: item.id }));
      if (result) navigation.goBack();
    }
  };

  const renderItem = ({ item }) => {
    return <JobSearchItem item={item} itemOnPressed={cellOnPressed} />;
  };

  const keyExtractor = (item: any) => item.id.toString();
  const renderSeparatorView = () => <View style={SEPARATOR_VIEW} />;

  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator style={LOADING} />;
  };

  const handleLoadMore = async () => {
    if (!isLoading && !onEndReachedCalledDuringMomentum) {
      onEndReachedCalledDuringMomentum = true;
      setIsLoading(true);
      currentPageTmp = parseInt(String(currentPageTmp)) + 1;
      const jobs = await getJobsApi();
      setIsLoading(false);
      setListData([...listData, ...jobs]);
    }
  };

  const renderContentView = () => {
    if (listData && listData.length > 0) {
      return (
        <FlatList
          style={FLAT_LIST}
          scrollToOverflowEnabled={false}
          data={listData}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={renderSeparatorView}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.1}
          onEndReached={handleLoadMore}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum = false;
          }}
          extraData={listData}
        />
      );
    } else {
      return <JobSearchItem item={keyWorkTmp} itemOnPressed={cellOnPressed} />;
    }
  };
  return (
    <View style={styles.container}>
      <SafeArea />
      <SearchBar
        inputData={[]}
        onChangeSuggestResult={onChangeSuggestResult}
        searchField="name"
        searchPlaceholderText={language('search.default')}
      />
      {renderContentView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
