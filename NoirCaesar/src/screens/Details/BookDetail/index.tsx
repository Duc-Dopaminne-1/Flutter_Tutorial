import styles from './styles';
import React, { useState, useEffect, useRef } from 'react';
import { View, SafeAreaView } from 'react-native';
import { CustomText } from '@src/components/CustomText';
import translate from '@src/localize';
import BACK from '@res/images/back.png';
import Container from '@src/components/Container';
import { colors } from '@src/constants/vars';
import NavigationActionsService from '@src/navigation/navigation';
import { CustomHeader } from '@src/components/CustomHeader';
import { Details } from './Details';
import { Chapters } from './Chapters';
import { Comments } from './Comments';
import { useDispatch, useSelector } from 'react-redux';
import { getBook } from '@src/modules/books/actions';
import { RootState } from '@src/types/types';
import { IBook } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import { DetailInformation } from '@src/components/DetailInformation';
//@ts-ignore
import { CollapsibleTabs } from 'react-native-collapsible-tabs';
import { CustomButton } from '@src/components/CustomButton';
import { ADD_COMMENT } from '@src/constants/screenKeys';
import { ModelEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/comment';
import DefaultImage from '@src/components/DefaultImage';

const routes = [
  { key: 'details', title: translate('book_info.details') },
  { key: 'chapters', title: translate('book_info.chapters') },
  { key: 'comments', title: translate('book_info.comments') },
];

const DetailsRoute = (book: IBook) => (
  <View style={[styles.content]}>
    <Details book={book} />
  </View>
);

const ChaptersRoute = (bookId: string, bookDetails: IBook, is_collection?: boolean) => (
  <View style={[styles.content]}>
    <Chapters bookId={bookId} bookDetails={bookDetails} is_collection={is_collection} />
  </View>
);

const CommentsRoute = (bookId: string, bindFunctionRefreshComments: (bindingFunc: () => void) => void) => (
  <View style={[styles.content]}>
    <Comments bookId={bookId} bindFunctionRefreshComments={bindFunctionRefreshComments} />
  </View>
);

interface Props {
  bookId: string;
  is_collection?: boolean;
  navigateToTab: number;
}

let getListComments: () => void;

const BookDetail = (props: Props) => {
  const { bookId, is_collection, navigateToTab = -1 } = props;
  const dispatch = useDispatch();
  const [showAddComment, setShowAddComment] = useState<boolean>(false);
  const tabRef = useRef<any>(null);
  const [bookDetails, setBookDetails] = useState<IBook>({
    id: '',
    name: '',
    description: '',
    image: '',
    image_thumb: '',
  });

  useEffect(() => {
    getBookDetail();
  }, []);

  const getBookDetail = () => {
    NavigationActionsService.showLoading();
    dispatch(
      getBook({
        book_id: bookId,
        is_collection: is_collection,
        onSuccess: (value: IBook) => {
          setBookDetails(value)
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
        return DetailsRoute(bookDetails);
      case 'chapters':
        return ChaptersRoute(bookId, bookDetails, is_collection);
      case 'comments':
        return CommentsRoute(bookId, bindFunctionRefreshComments);
      default:
        return null;
    }
  };

  const onChangeTab = (index: number) => {
    setShowAddComment(index == 2);
  };

  const onPressBack = () => {
    NavigationActionsService.pop();
  };

  const goToAddComment = () => {
    NavigationActionsService.push(
      ADD_COMMENT,
      {
        id: bookId,
        model: ModelEnum.Book,
        refreshOnBack: refreshBookDetail,
      },
      true,
    );
  };

  const refreshBookDetail = () => {
    getListComments && getListComments();
  };

  const bindFunctionRefreshComments = (bindFunc: () => void) => {
    getListComments = bindFunc;
  };

  const getCreator = () => {
    if (bookDetails.creator && bookDetails.creator.length > 0) {
      let listCreator = [];
      for (let i = 0; i < bookDetails.creator.length; i++) {
        listCreator.push(bookDetails.creator[i].name);
      }
      return listCreator.join(' & ').toString();
    }
    return '';
  };

  const getArtist = () => {
    if (bookDetails.artist && bookDetails.artist.length > 0) {
      let listArtist = [];
      for (let i = 0; i < bookDetails.artist.length; i++) {
        listArtist.push(bookDetails.artist[i].name);
      }
      return listArtist.join(' & ').toString();
    }
    return '';
  };

  const getWriters = () => {
    if (bookDetails.writer && bookDetails.writer.length > 0) {
      let listWriter = [];
      for (let i = 0; i < bookDetails.writer.length; i++) {
        listWriter.push(bookDetails.writer[i].name);
      }
      return listWriter.join(' & ').toString();
    }
    return '';
  };

  const renderHeader = () => {
    return (
      <CustomHeader
        containerStyle={{ backgroundColor: 'transparent', zIndex: 1 }}
        leftImage={BACK}
        leftAction={onPressBack}
        useDarkLayout
      />
    );
  };

  const renderBookInfo = () => {
    return (
      <View style={styles.bookInfoContainer}>
        {renderName()}
        <DetailInformation
          firstTitle={translate('books.creator')}
          firstDetail={getCreator()}
          secondTitle={translate('books.artist')}
          secondDetail={getArtist()}
          thirdTitle={translate('books.writers')}
          thirdDetail={getWriters()}
        />
      </View>
    );
  };

  const renderName = () => {
    return (
      <View style={styles.nameContainer}>
        <CustomText numberOfLines={1} style={styles.name} text={bookDetails.name} />
      </View>
    );
  };

  const renderAddCommentButton = () => {
    return (
      <SafeAreaView style={styles.buttonContainer}>
        {showAddComment && <CustomButton style={styles.addCommentButton} text={translate('blog.add_comment')} onPress={goToAddComment} />}
      </SafeAreaView>
    );
  };

  const renderCollapseHeader = () => {
    return (
      <View style={styles.collapseHeader}>
        <DefaultImage resizeMode="contain" imageUri={bookDetails.cover} imageStyle={styles.logo} />
        {renderBookInfo()}
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
        onChangeTab={onChangeTab}
      />
      {renderAddCommentButton()}
    </Container>
  );
};

export default BookDetail;
