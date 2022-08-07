import { View, Clipboard, Linking, SafeAreaView } from 'react-native';
import React, { useEffect } from 'react';
import Container from '@components/Container';
import styles from './styles';
import translate from '@src/localize';
import { BACK, FACEBOOK, TWITTER, LINKEDIN, LINK } from '@src/constants/icons';
import { CustomHeader } from '@src/components/CustomHeader';
import NavigationActionsService from '@src/navigation/navigation';
import { CustomText } from '@src/components/CustomText';
import { colors } from '@src/constants/vars';
import { ADD_COMMENT } from '@src/constants/screenKeys';
import { CustomButton } from '@src/components/CustomButton';
import { DetailInformation } from '@src/components/DetailInformation';
import FastImage from 'react-native-fast-image';
import { Image } from 'react-native-animatable';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { Content } from './Content';
import { Comments } from './Comments';
import { useDispatch, useSelector } from 'react-redux';
import { IBlog } from '@goldfishcode/noir-caesar-api-sdk/libs/api/blog/models';
import { RootState } from '@src/types/types';
import { getBlogDetail, resetBlogDetail } from '@src/modules/blog/actions';
import { ModelEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/comment';
import { formatDate, formatBlogDuration } from '@src/utils/date';
import Share from 'react-native-share';
//@ts-ignore
import { CollapsibleTabs } from 'react-native-collapsible-tabs';

interface Props {
  blog_id: string;
}

const routes = [
  { key: 'content', title: translate('blog.content') },
  { key: 'comments', title: translate('blog.comments') },
];

let getListComments: () => void;

const BlogDetail = (props: Props) => {
  const dispatch = useDispatch();
  const blog = useSelector<RootState, IBlog>((state: RootState) => state.blog.detail);

  const onBack = () => {
    dispatch(resetBlogDetail());
    NavigationActionsService.pop();
  };

  useEffect(() => {
    NavigationActionsService.showLoading();
    dispatch(
      getBlogDetail({
        blog_id: props.blog_id,
        onSuccess: () => {
          setTimeout(() => {
            NavigationActionsService.hideLoading();
          }, 500);
        },
        onFail: () => {
          setTimeout(() => {
            NavigationActionsService.hideLoading();
          }, 500);
        },
      }),
    );
  }, []);

  const goToAddComment = () => {
    NavigationActionsService.push(
      ADD_COMMENT,
      {
        id: props.blog_id,
        model: ModelEnum.Blog,
        refreshOnBack: refreshBlogDetail,
      },
      true,
    );
  };

  const renderHeader = () => {
    return <CustomHeader containerStyle={styles.headerContainer} leftImage={BACK} leftAction={onBack} useDarkLayout />;
  };

  const renderBlogInfo = () => {
    return (
      <View style={styles.blogInfoContainer}>
        {renderTitle()}
        {renderSocialShare()}
        <DetailInformation
          firstTitle={translate('blog.author')}
          firstDetail={blog.writer?.name ?? ''}
          secondTitle={translate('blog.date')}
          secondDetail={formatDate(blog.created ?? '')}
          thirdTitle={translate('blog.duration')}
          thirdDetail={blog.time_read ? `${formatBlogDuration(Number(blog.time_read))} read` : ''}
        />
      </View>
    );
  };

  const renderTitle = () => {
    return (
      <View style={styles.titleContainer}>
        <CustomText numberOfLines={2} style={styles.title} text={blog.name} />
      </View>
    );
  };

  const renderSocialShare = () => {
    return (
      <View style={styles.titleContainer}>
        <CustomTouchable style={styles.shareIcon} onPress={onShareFacebook}>
          <Image source={FACEBOOK} />
        </CustomTouchable>
        <CustomTouchable style={styles.shareIcon} onPress={onShareTwitter}>
          <Image source={TWITTER} />
        </CustomTouchable>
        <CustomTouchable style={styles.shareIcon} onPress={onShareLinkedin}>
          <Image source={LINKEDIN} />
        </CustomTouchable>
        <CustomTouchable style={styles.shareIcon} onPress={onShareLink}>
          <Image source={LINK} />
        </CustomTouchable>
      </View>
    );
  };

  const onShareFacebook = async () => {
    const shareOptions = {
      title: blog.name,
      message: `${blog.name} `,
      url: blog.url,
    };

    try {
      await Share.shareSingle(
        Object.assign(shareOptions, {
          social: Share.Social.FACEBOOK,
        }),
      );
    } catch (error) {
      error && console.log(error);
    }
  };

  const onShareTwitter = async () => {
    const shareOptions = {
      title: blog.name,
      message: `${blog.name} `,
      url: blog.url,
    };

    try {
      await Share.shareSingle(
        Object.assign(shareOptions, {
          social: Share.Social.TWITTER,
        }),
      );
    } catch (error) {
      error && console.log(error);
    }
  };

  const onShareLinkedin = async () => {
    Linking.openURL(`https://www.linkedin.com/shareArticle?mini=true&summary=NoirCaesar&title=f1&url=${blog.url}`);
  };

  const onShareLink = () => {
    Clipboard.setString(blog.url ?? '');
    NavigationActionsService.showCustomPopup({
      text: translate('blog.copied_message'),
    });
  };

  const refreshBlogDetail = () => {
    if (getListComments) {
      getListComments();
    }
  };

  const bindFunctionRefreshComments = (bindFunc: () => void) => {
    getListComments = bindFunc;
  };

  const renderScene = ({ route }: { route: any }) => {
    switch (route.key) {
      case 'content':
        return blog.content ? <Content content={blog.content ?? ''} /> : null;
      case 'comments':
        return <Comments blog_id={props.blog_id} bindFunctionRefreshComments={bindFunctionRefreshComments} />;
      default:
        return null;
    }
  };

  const renderAddCommentButton = () => {
    return (
      <SafeAreaView>
        <CustomButton style={styles.addCommentButton} text={translate('blog.add_comment')} onPress={goToAddComment} />
      </SafeAreaView>
    );
  };

  const renderCollapseHeader = () => {
    return (
      <View style={styles.collapseHeader}>
        <FastImage style={styles.logo} resizeMode="contain" source={{ uri: blog.image }} />
        {renderBlogInfo()}
      </View>
    );
  };

  const mapRoutesToTap = () => {
    const result = routes.map(item => {
      return {
        label: item.title,
        component: renderScene({ route: { ...item } }),
      };
    });
    return result;
  };

  return (
    <Container>
      {renderHeader()}
      <CollapsibleTabs
        scrollable
        scrollBackground={'black'}
        maxCollapsedHeight={150}
        itemPaddingBottom={5}
        barColor={colors.SECONDARY}
        activeTextStyle={styles.tabActiveTextStyle}
        indicatorColor="red"
        allowFontScaling={false}
        textStyle={styles.tabInActiveTextStyle}
        uppercase={false}
        collapsibleContent={renderCollapseHeader()}
        tabs={mapRoutesToTap()}
      />
      {renderAddCommentButton()}
    </Container>
  );
};

export default BlogDetail;
