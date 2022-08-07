import React, { useEffect, useState } from 'react';
import { View, Image, Clipboard } from 'react-native';
import styles from './styles';
import { CustomHeader } from '@src/components/CustomHeader';
import { CLOSE } from '@src/constants/icons';
import { CustomText } from '@src/components/CustomText';
import { RootState } from '@src/types/types';
import { IBook, IChapter } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import { useDispatch, useSelector } from 'react-redux';
import NavigationActionsService from '@src/navigation/navigation';
import BottomControl from './BottomControl';
import PDFReader from './PDFReader';
import translate from '@src/localize';
import { getChapter } from '@src/modules/books/actions';
import { LOGO } from '@src/constants/icons';
import { CustomPopup } from '@src/components/CustomPopup';
import { MoreModal } from '../Player/VideoPlayer/MoreModal';
import Share from 'react-native-share';
import { ModalItem } from '../Player/VideoPlayer';
import { addFavorite } from '@src/modules/library/actions';
import { ObjectTypeEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/library';
import { IError } from '@src/modules/base';

interface Props {
  item: IChapter;
  is_collection?: boolean;
  bookDetails: IBook;
}

const modalItems: ModalItem[] = [
  { key: 'add_fav', value: 'Add to favorites' },
  { key: 'clipboard', value: 'Create a copy link' },
  { key: 'share', value: 'Share peer-to-peer' },
];

const BookReader = (props: Props) => {
  let pdfReader: any;
  const dispatch = useDispatch();
  const { bookDetails } = props;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [item, setItem] = useState(props.item);
  const [loadError, setError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loadComplete, setLoadComplete] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);

  useEffect(() => {
    reloadChapter();
  }, []);

  const reloadChapter = () => {
    dispatch(
      getChapter({
        chapterId: item.id,
        is_collection: props.is_collection,
        onSuccess: response => {
          setItem(response);
        },
        onFail: error => {
          setTimeout(() => {
            NavigationActionsService.showErrorPopup(error);
          }, 500);
        },
      }),
    );
  };

  const handleOptionsPress = () => {
    setShowMoreModal(true);
  };

  const hideCustomPopup = () => {
    setShowPopup(false);
  };

  const dismissModal = () => {
    NavigationActionsService.dismissModal();
  };

  const onPrev = () => {
    const prevPage = currentPage - 1;
    pdfReader.setPage(prevPage);
  };

  const onNext = () => {
    const nextPage = currentPage + 1;
    pdfReader.setPage(nextPage);
  };

  const onReaderLoadComplete = (numberOfPages: number) => {
    setLoadComplete(true);
    setTotalPage(numberOfPages);
  };

  const onReaderPageChanged = (currentPage: number) => {
    setCurrentPage(currentPage);
  };

  const onReaderError = (error: any) => {
    console.log('PDFReader load error:', error);
    setError(true);

    if (error.message != 'canceled') {
      NavigationActionsService.showCustomPopup({
        text: translate('alert.message_error_default'),
      });
    }
  };

  const handleAddFavSuccess = () => {
    NavigationActionsService.showCustomPopup({ text: translate("bookReader.add_favorite_success") })
  }

  const handleAddFavFail = (error?: IError) => {
    NavigationActionsService.showErrorPopup(error);
  }

  const headerComponent = () => {
    const bookName = bookDetails && bookDetails.name;
    const chapter = item && item.name;
    return (
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <CustomText numberOfLines={1} style={styles.bookName} text={bookName} />
        <CustomText numberOfLines={1} style={styles.chapter} text={chapter} />
      </View>
    );
  };

  const renderBookReaderHeader = () => {
    return (
      <CustomHeader
        containerStyle={styles.customHeader}
        customComponent={headerComponent()}
        rightImage={CLOSE}
        rightImageStyle={styles.closeImageStyle}
        rightAction={dismissModal}
      />
    );
  };

  const renderBookReaderView = () => {
    if (!item.file_url || loadError) {
      return (
        <View style={styles.logoView}>
          <Image resizeMode="cover" source={LOGO} style={styles.logoImage} />
        </View>
      );
    }

    return (
      <View style={styles.readerViewContainer}>
        <PDFReader
          onRef={ref => (pdfReader = ref)}
          sourceUri={item.file_url}
          onLoadComplete={onReaderLoadComplete}
          onPageChanged={onReaderPageChanged}
          onError={onReaderError}
        />
      </View>
    );
  };

  const renderBottomControl = () => {
    return (
      <BottomControl
        canPrev={currentPage > 1}
        onPressPrev={onPrev}
        canNext={currentPage < totalPage}
        onPressNext={onNext}
        canOption={loadComplete}
        onPressOptions={handleOptionsPress}
      />
    );
  };

  const renderCustomPopup = () => {
    if (!showPopup) return null;
    return (
      <CustomPopup
        loading={showPopup}
        text={translate('bookReader.add_favorite_success')}
        buttonRedTitle={'Close'}
        onPressRedButton={hideCustomPopup}
        onBackdropPress={hideCustomPopup}
      />
    );
  };

  const onBackdropPress = () => {
    setShowMoreModal(false);
  };

  const onPressMoreCallBack = (modalItem: ModalItem) => {
    setShowMoreModal(false);
    if (modalItem.key === 'share') {
      if (!bookDetails.weblink) {
        NavigationActionsService.showCustomPopup({ text: "Invalid URL" });
        return;
      }
      setTimeout(() => {
        Share.open({
          url: bookDetails.weblink,
          failOnCancel: false
        }).catch((err) => {
          err && console.log("ShareService has error:", err);
        });
      }, 500);
    }
    else if (modalItem.key === 'clipboard') {
      bookDetails.weblink && Clipboard.setString(bookDetails.weblink);
    }
    else if (modalItem.key === 'add_fav') {
      dispatch(addFavorite({
        id: bookDetails.id,
        type: ObjectTypeEnum.Book,
        onSuccess: handleAddFavSuccess,
        onFail: handleAddFavFail
      }));
    }
  };

  const renderMoreModal = () => {
    return (
      <MoreModal
        onCustomPress={onPressMoreCallBack}
        loading={showMoreModal}
        onBackdropPress={onBackdropPress}
        items={modalItems}
      />
    )
  }

  return (
    <View style={styles.container}>
      {renderBookReaderHeader()}
      {renderBookReaderView()}
      {renderBottomControl()}
      {renderCustomPopup()}
      {renderMoreModal()}
    </View>
  );
};

export default BookReader;
