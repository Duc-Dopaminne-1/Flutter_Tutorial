import React, { useEffect, useState } from 'react';
import Container from '@components/Container';
import styles from './styles';
import { BACK } from '@src/constants/icons';
import { CustomHeader } from '@src/components/CustomHeader';
import NavigationActionsService from '@src/navigation/navigation';
import translate from '@src/localize';
import { useDispatch, useSelector } from 'react-redux';
import { getSlider, getBlog } from '@src/modules/blog/actions';
import { RootState } from '@src/types/types';
import { IBlog } from '@goldfishcode/noir-caesar-api-sdk/libs/api/blog/models';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { RefreshControl, ActivityIndicator, View, FlatList } from 'react-native';
import { colors, WIDTH } from '@src/constants/vars';
import { usePrevious } from '@src/hooks/usePrevious';
import { BlogItem } from '@src/components/FlatListItem/BlogItem';
import { CustomText } from '@src/components/CustomText';
import { LatestBlogItem } from '@src/components/FlatListItem/LatestBlogItem';
import { BLOG_DETAIL } from '@src/constants/screenKeys';

let isFirstLoad = true;
const Blog = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const previousLoading = usePrevious(loading);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const latestBlogs = useSelector<RootState, IBlog[]>((state: RootState) => state.blog.sliders);
  const blogs = useSelector<RootState, IPagination<IBlog>>((state: RootState) => state.blog.blogList);

  const onBack = () => {
    NavigationActionsService.toggleDrawer(true);
  };

  useEffect(() => {
    dispatch(getSlider({}));
    getBlogList();
  }, []);

  useEffect(() => {
    if (loading == true && previousLoading !== loading) {
      if (isFirstLoad) {
        isFirstLoad = false;
        setIsRefreshing(true);
      }

      if (page == 1) {
        dispatch(getSlider({}));
      }

      dispatch(
        getBlog({
          page: page,
          limit: 18,
          onSuccess: () => {
            setPage(page + 1);
            setTimeout(() => {
              setIsRefreshing(false);
              setLoading(false);
            }, 500);
          },
          onFail: error => {
            setIsRefreshing(false);
            setTimeout(() => {
              setLoading(false);
              NavigationActionsService.showErrorPopup(error);
            }, 500);
          },
        }),
      );
    }
  }, [loading]);

  const getBlogList = () => {
    setLoading(true);
  };

  const onPressItem = (item: IBlog) => {
    NavigationActionsService.push(BLOG_DETAIL, { blog_id: item.id }, true);
  };

  const handleLoadMore = () => {
    if (!loading && blogs.next !== null && blogs.results.length !== blogs.count) {
      getBlogList();
    }
  };

  const renderRefreshControl = () => {
    return <RefreshControl tintColor={colors.WHITE} refreshing={isRefreshing} onRefresh={onRefresh} />;
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setPage(1);
    getBlogList();
  };

  const renderHeader = () => {
    return <CustomHeader title={translate('blog.title')} leftImage={BACK} leftAction={onBack} />;
  };

  const renderBlogItem = ({ item }: { item: IBlog }) => {
    return <BlogItem item={item} onPressItem={onPressItem.bind(undefined, item)} />;
  };

  const renderLatestBlogsItem = ({ item }: { item: IBlog }) => {
    return <LatestBlogItem item={item} onPressItem={onPressItem.bind(undefined, item)} />;
  };

  const renderFooter = () => {
    return loading && blogs && blogs.count > 0 ? <ActivityIndicator color={colors.WHITE} /> : null;
  };

  const keyBlogExtractor = (item: IBlog, index: number) => {
    return index.toString();
  };

  const keyLatestBlogExtractor = (item: IBlog, index: number) => {
    return index.toString();
  };

  const renderLatestBlogs = () => {
    if (latestBlogs.length > 0) {
      return (
        <View style={{ width: WIDTH, height: 250 }}>
          <FlatList
            contentContainerStyle={styles.flatListLatestBlog}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={latestBlogs}
            renderItem={renderLatestBlogsItem}
            keyExtractor={keyLatestBlogExtractor}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  const renderBlogs = () => {
    if (blogs.results.length > 0) {
      return (
        <View style={styles.container}>
          <CustomText style={styles.mostPopular} text={translate('blog.most_popular')} />
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={styles.flatListBlog}
            data={blogs.results}
            renderItem={renderBlogItem}
            keyExtractor={keyBlogExtractor}
            ListFooterComponent={renderFooter}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshControl={renderRefreshControl()}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <Container>
      <View style={styles.container}>
        {renderHeader()}
        {renderLatestBlogs()}
        {renderBlogs()}
      </View>
    </Container>
  );
};

export default Blog;
