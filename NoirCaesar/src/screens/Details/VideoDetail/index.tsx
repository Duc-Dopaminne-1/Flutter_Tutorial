import styles from './styles';
import Container from '@src/components/Container';
import React, { useState, useEffect, useRef } from 'react';
import { View, ImageBackground } from 'react-native';
import { CustomHeader } from '@src/components/CustomHeader';
import { BACK, PLAY, LOGO } from '@src/constants/icons';
import NavigationActionsService from '@src/navigation/navigation';
import translate from '@src/localize';
import { CustomText } from '@src/components/CustomText';
import FastImage from 'react-native-fast-image';
import { colors } from '@src/constants/vars';
import { Details } from './Details';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { Episodes } from './Episodes';
import { VIDEO_MEDIA_PLAYER } from '@src/constants/screenKeys';
import { formatDuration } from '@src/utils/date';
import { useDispatch } from 'react-redux';
import { detailStory, purchaseEpisode } from '@src/modules/tv/actions';
import { IEpisode } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv/models';
import { DetailInformation } from '@src/components/DetailInformation';
//@ts-ignore
import { CollapsibleTabs } from 'react-native-collapsible-tabs';
import { get } from 'lodash';
import { formatCoin } from '@src/utils';

interface Props {
  story_id: string;
  is_collection?: boolean;
  navigateToTab?: number;
}

let refreshListData: () => void;

const routes = [
  { key: 'details', title: translate('videodetails.details') },
  { key: 'episodes', title: translate('videodetails.episodes') },
];

const VideoDeital = (props: Props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState<IEpisode>();
  const tabRef = useRef<any>(null);
  const { navigateToTab = -1 } = props;

  const DetailsRoute = () => (
    <View style={[styles.content]}>
      <Details description={data && data.story && data.story.description ? data.story.description : ''} />
    </View>
  );

  const bindRefreshFunction = (callbackRefreshList: () => void) => {
    refreshListData = callbackRefreshList;
  }

  const EpisodesRoute = () => (
    <View style={[styles.content]}>
      <Episodes bindRefreshFunction={bindRefreshFunction} episodeImage={get(data, ['story', 'image_thumb'], '')} story_id={get(data, ['story', 'id'], '')} />
    </View>
  );

  useEffect(() => {
    if (props.story_id) {
      getDetailStory();
    }
  }, []);

  const getDetailStory = () => {
    NavigationActionsService.showLoading();
    dispatch(
      detailStory({
        is_collection: props.is_collection,
        story_id: props.story_id,
        onSuccess: data => {
          setData(data);
          setTimeout(() => {
            NavigationActionsService.hideLoading();
            if (navigateToTab >= 0) {
              tabRef && tabRef.current && tabRef.current.onChangePage(navigateToTab);
            }
          }, 500);
        },
        onFail: error => {
          setTimeout(() => {
            NavigationActionsService.hideLoading();
            NavigationActionsService.showErrorPopup(error);
          }, 500);
        },
      }),
    );
  };

  const renderScene = ({ route }: { route: any }) => {
    switch (route.key) {
      case 'details':
        return DetailsRoute();
      case 'episodes':
        return EpisodesRoute();
      default:
        return null;
    }
  };

  const onPressBack = () => {
    NavigationActionsService.pop();
  };

  const renderHeader = () => {
    return <CustomHeader containerStyle={styles.header} leftImage={BACK} leftAction={onPressBack} useDarkLayout />;
  };

  const renderVideoInfo = () => {
    return (
      <View style={styles.videoInfoContainer}>
        {renderName()}
        <DetailInformation
          firstTitle={translate('videodetails.director')}
          firstDetail={getDirector()}
          secondTitle={translate('videodetails.writers')}
          secondDetail={getWriters()}
          thirdTitle={translate('videodetails.stars')}
          thirdDetail={getStars()}
        />
      </View>
    );
  };

  const renderName = () => {
    return (
      <View style={styles.nameContainer}>
        <CustomText numberOfLines={1} style={styles.name} text={data && data.story && data.story.name ? data.story.name : ''} />
        <View style={styles.timeContainer}>
          <CustomText numberOfLines={1} style={styles.time} text={data && data.duration ? formatDuration(data.duration) : 'N/A'} />
        </View>
      </View>
    );
  };

  const getStars = () => {
    if (data && data.story && data.story.stars && data.story.stars.length > 0) {
      const listStars = [];
      for (let i = 0; i < data.story.stars.length; i++) {
        listStars.push(data.story.stars[i].name);
      }
      return listStars.join(' & ').toString();
    }
    return '';
  };

  const getDirector = () => {
    if (data && data.story && data.story.director && data.story.director.length > 0) {
      const listDirector = [];
      for (let i = 0; i < data.story.director.length; i++) {
        listDirector.push(data.story.director[i].name);
      }
      return listDirector.join(' & ').toString();
    }
    return '';
  };

  const getWriters = () => {
    if (data && data.story && data.story.writer && data.story.writer.length > 0) {
      const listArtist = [];
      for (let i = 0; i < data.story.writer.length; i++) {
        listArtist.push(data.story.writer[i].name);
      }
      return listArtist.join(' & ').toString();
    }
    return '';
  };

  const handlePurchasePopupPress = (episode_id: string) => {
    NavigationActionsService.hideCustomPopup();
    NavigationActionsService.showLoading()
    dispatch(purchaseEpisode({
      episode_id,
      onSuccess: () => {
        setTimeout(() => {
          getDetailStory();
          refreshListData();
          NavigationActionsService.hideLoading();
        }, 500);
      },
      onFail: (error) => {
        setTimeout(() => {
          NavigationActionsService.hideLoading();
          NavigationActionsService.showErrorPopup(error);
        }, 500);
      }
    }))
  }

  const onPressPlayVideo = () => {
    if (data) {
      const { file_url, weblink, id, allow_read, name, coins, story } = data;
      if (allow_read) {
        NavigationActionsService.showModal(
          VIDEO_MEDIA_PLAYER,
          {
            url: file_url,
            weblink: weblink,
            story_id: story && story.id
          }
        );
      }
      else {
        NavigationActionsService.showCustomPopup({
          text: `${translate('books.buy_chapter_popup')} "${name}" for ${formatCoin(coins ? coins : 0)}?`,
          buttonRedTitle: translate('common.yes'),
          buttonGrayTitle: translate('common.cancel'),
          onPressRedButton: handlePurchasePopupPress.bind(undefined, id)
        });
      }
    }
  };

  const renderCollapseHeader = () => {
    return (
      <View style={styles.collapseHeader}>
        <ImageBackground
          resizeMode="contain"
          source={data && data.story && data.story.cover ? { uri: data.story.cover } : LOGO}
          style={styles.logo}
        >
          <CustomTouchable onPress={onPressPlayVideo}>
            <FastImage resizeMode="cover" source={PLAY} style={styles.logoBG} />
          </CustomTouchable>
        </ImageBackground>
        {renderVideoInfo()}
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
        ref={tabRef}
        scrollable
        scrollBackground={'black'}
        maxCollapsedHeight={130}
        barColor={colors.SECONDARY}
        activeTextStyle={styles.tabActiveTextStyle}
        indicatorColor="red"
        allowFontScaling={false}
        textStyle={styles.tabInActiveTextStyle}
        uppercase={false}
        collapsibleContent={renderCollapseHeader()}
        tabs={mapRoutesToTap()}
      />
    </Container>
  );
};

export default VideoDeital;
