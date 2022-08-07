import { View, Platform, Keyboard, Alert } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Container from '@src/components/Container';
import { Image } from 'react-native-animatable';
import HEADPHONEICON from '@res/images/headphone.png';
import HPICON from '@res/images/ic_headphone.png';
import BOOKICON from '@res/images/ic_books.png';
import AUDIOICON from '@res/images/ic_play.png';
import CustomInput from '@src/components/CustomInput';
import styles from './styles';
import { Formik } from 'formik';
import ErrorMessage from '@src/components/ErrorMessage';
import { object, string } from 'yup';
import translate from '@src/localize';
import { CustomPopup } from '@src/components/CustomPopup';
import NavigationActionsService from '@src/navigation/navigation';
import DocumentPickerCustom from '@src/components/DocumentPicker';
import { MimeType } from '@src/components/DocumentPicker/index';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImagePickerResponse } from 'react-native-image-picker';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { CustomText } from '@src/components/CustomText';
import { useDispatch, useSelector } from 'react-redux';
import { uploadCollection, uploadVideoOrAudio } from '@src/modules/auth/actions';
import { toMain } from '@src/navigation';
import * as Progress from 'react-native-progress';
import MutilSelectPopup from '@src/components/Popup/MutilSelectPopup';
import { GenreItem } from '@src/components/Popup/MutilSelectPopup/MutilSelectPopupItem';
import { getGenres as actionGetGenres, createBook } from '@src/modules/books/actions';
import { RootState } from '@src/types/types';
import { CustomHeader } from '@src/components/CustomHeader';
import { BACK, PLUS } from '@src/constants/icons';
import { CustomTouchable } from '@src/components/CustomTouchable';
import CustomDropDown from '@src/components/CustomDropDown';
import { clone } from 'lodash';
import { IError } from '@src/modules/base';
import { Contributor } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user/models';
import { UploadField } from '..';
import DocumentPickerImage from '@src/components/DocumentPickerImage';
import { PreSignedUrlParam } from '@goldfishcode/noir-caesar-api-sdk/libs/api/upload/adapter/adapter';
import moment from 'moment';

interface IContributor {
  [contributor: string]: { firstName: string, lastName: string }
}

interface Props {
  isFromProfile: boolean;
  refreshOnBack?: () => void;
}

const UploadCollection = (props: Props) => {
  const dispatch = useDispatch();
  const [nameFile, setNameFile] = useState('');
  const [uri, setUri] = useState('');
  const [filePath, setFilePath] = useState('');
  const [duration, setDuration] = useState(0);
  const [folder, setFolder] = useState('');
  const [docType, setDocType] = useState('');
  const [progress, setProgress] = useState(0);
  const [isShowPopup, setShowPopup] = useState(false);
  const [isShowMutilPopup, setShowMutilPopup] = useState(false);
  const listGenres = useSelector<RootState, any[]>((state: RootState) => state.book.listGenres);
  const listPerson = useSelector<RootState, any[]>((state: RootState) => state.auth.listPerson);
  const documentRef: any = useRef(null);
  const imageRef: any = useRef(null);
  const [data, setData] = useState<IContributor[]>([])
  const [dataName, setDataName] = useState<string[]>([])
  const [image, setImage] = useState<string>();
  const [cover, setCover] = useState<string>();
  const [progressImage, setProgressImage] = useState(0);
  const [progressCover, setProgressCover] = useState(0);
  const [uploadField, setUploadField] = useState<UploadField>(UploadField.NONE);
  const uploadType = useRef<UploadField>(UploadField.NONE);
  const isUploading = useRef<boolean>(false);
  const imagePath = useRef<string>();
  const coverPath = useRef<string>();
  let mFormikProps: any;

  useEffect(() => {
    NavigationActionsService.hideLoading();
  }, []);

  useEffect(() => {
    getGenres();
  }, []);

  useEffect(() => {
    if (uploadField != UploadField.NONE && !isUploading.current) {
      imageRef.current.show();
      setTimeout(() => {
        setUploadField(UploadField.NONE);
      }, 500);
    }
  }, [uploadField])

  const getGenres = () => {
    dispatch(
      actionGetGenres({
        onFail: (error?: IError) => {
          setTimeout(() => {
            NavigationActionsService.showErrorPopup(error);
          }, 500);
        },
      }),
    );
  };

  const onParseGenreList = (genreid: string) => {
    if (genreid) {
      return genreid.split(', ').length > 0 ? genreid.split(', ') : [];
    }
    return [];
  };

  const onCreateBook = (values: any) => {
    let description: string = values.description.replace(/\n/g, '<br />');
    const genres: string[] = onParseGenreList(values.genreid)
    const directors = data.filter(item => item['director'] && (item.director.firstName.trim() !== '' || item.director.lastName.trim() !== ''));
    const writers = data.filter(item => item['writer'] && (item.writer.firstName.trim() !== '' || item.writer.lastName.trim() !== ''));
    const stars = data.filter(item => item['stars'] && (item.stars.firstName.trim() !== '' || item.stars.lastName.trim() !== ''));
    const artists = data.filter(item => item['artist'] && (item.artist.firstName.trim() !== '' || item.artist.lastName.trim() !== ''));
    const creators = data.filter(item => item['creator'] && (item.creator.firstName.trim() !== '' || item.creator.lastName.trim() !== ''));
    const contributors: Contributor = {
      director: directors.map(item => `${item.director.firstName.trim()} ${item.director.lastName.trim()}`),
      writer: writers.map(item => `${item.writer.firstName.trim()} ${item.writer.lastName.trim()}`),
      stars: stars.map(item => `${item.stars.firstName.trim()} ${item.stars.lastName.trim()}`),
      artist: artists.map(item => `${item.artist.firstName.trim()} ${item.artist.lastName.trim()}`),
      creator: creators.map(item => `${item.creator.firstName.trim()} ${item.creator.lastName.trim()}`)
    }
    NavigationActionsService.showLoading();
    if (folder === 'books') {
      dispatch(
        createBook({
          data: {
            name: values.title,
            description: description,
            file_path: filePath,
            genres: genres,
            contributors: contributors,
            image_path: imagePath.current,
            cover_path: coverPath.current
          },
          onSuccess: () => {
            setTimeout(() => {
              NavigationActionsService.hideLoading();
              setShowPopup(true);
              props.refreshOnBack && props.refreshOnBack();
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
    } else {
      dispatch(
        uploadVideoOrAudio({
          data: {
            duration: duration ?? 0,
            name: values.title,
            description: description,
            file_path: filePath,
            genres: genres,
            contributors: contributors,
            image_path: imagePath.current,
            cover_path: coverPath.current
          },
          onSuccess: () => {
            setTimeout(() => {
              NavigationActionsService.hideLoading();
              setShowPopup(true);
              props.refreshOnBack && props.refreshOnBack();
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
    }
  };

  const validationObject = object().shape({
    files: string()
      .required(translate('upload_collection.required_file'))
      .test('files', translate('upload_collection.required_type_invalid'), value => {
        if (
          value &&
          (value.includes('pdf') ||
            value.includes('wav') ||
            value.includes('mp3') ||
            value.includes('mp4') ||
            value.includes('mov') ||
            value.includes('mkv') ||
            value.includes('mpeg'))
        ) {
          return true;
        }
        return false;
      }),
    title: string().required(translate('upload_collection.required_title')),
    genre: string().required(translate('upload_collection.required_genre')),
    description: string().required(translate('upload_collection.required_description')),
  });

  const onSubmitCollection = (values: any) => {
    Keyboard.dismiss();
    onCreateBook(values);
  };

  const onChooseCollection = () => {
    !isUploading.current ?
      documentRef.current.show() :
      NavigationActionsService.showCustomPopup({ text: 'Your upload is still in progress. Please wait until successful' })
  };

  const getIconItemCollection = () => {
    switch (docType) {
      case DocumentPicker.types.video:
        return HPICON;
      case DocumentPicker.types.pdf:
        return BOOKICON;
      case DocumentPicker.types.audio:
        return AUDIOICON;
    }
  };

  const renderItemCollection = () => {
    return (
      <View style={{ alignItems: 'center' }}>
        <View style={styles.containerItem}>
          <Image source={getIconItemCollection()} style={styles.imageItem} />
          <CustomText text={nameFile} style={styles.contentUploadBook}></CustomText>
        </View>
        <Progress.Bar color={'#FF0000'} progress={progress / 100} />
      </View>
    );
  };

  const onCompletedPicker = (imageResponse: any, documentResponse: any, docType: any, formikProps: any) => {
    let docTypeCollection = '';
    let file = {};
    let uri = '';
    let typeCollection = '';
    let name = '';
    let size = 0;
    setProgress(0);
    isUploading.current = true;
    if (imageResponse) {
      if (Platform.OS === 'ios') {
        setNameFile(imageResponse && imageResponse.filename ? imageResponse.filename : '');
        name = imageResponse && imageResponse.filename ? imageResponse.filename : '';
      } else {
        const names = imageResponse.path ? imageResponse.path.split('/') : [];
        setNameFile(names && names.length > 0 ? names[names.length - 1] : '');
        name = names && names.length > 0 ? names[names.length - 1] : '';
      }
      setUri(imageResponse.path ? imageResponse.path : '');
      uri = imageResponse.path ? imageResponse.path : '';
      size = imageResponse.size ? imageResponse.size : 0;
      formikProps.setFieldValue('files', imageResponse.mime);
      typeCollection = imageResponse.mime;
    }
    if (documentResponse) {
      const type = documentResponse.type ? documentResponse.type.split('/') : [];
      formikProps.setFieldValue('files', documentResponse.type);
      typeCollection = documentResponse.type;
      if (Platform.OS === 'ios') {
        setNameFile(documentResponse.name ? documentResponse.name : '');
        name = documentResponse.name ? documentResponse.name : '';
      } else {
        setNameFile(getNameAudio(documentResponse.name, type));
        name = getNameAudio(documentResponse.name, type);
      }
      setUri(documentResponse.uri ? documentResponse.uri : '');
      uri = documentResponse.uri ? documentResponse.uri : '';
      size = documentResponse.size ? documentResponse.size : 0;
    }
    setDocType(docType);
    docTypeCollection = docType;
    file = {
      uri,
      type: typeCollection,
      name,
    };
    onUploadCollection(docTypeCollection, file, size);
  };

  const getNameAudio = (name: string, type: any) => {
    if (name) {
      if (name.includes('.')) {
        return name;
      } else {
        if (type[type.length - 1] === 'mpeg') {
          return (name = name.split('.')[0] + '.mp3');
        }
        return name ? `${name}.${type[type.length - 1]}` : '';
      }
    }
    return '';
  };

  const onUploadCollection = (docType: any, file: any, size: number) => {
    let folderName = '';
    let mimeType = ''
    switch (docType) {
      case DocumentPicker.types.pdf:
        folderName = 'books';
        mimeType = MimeType.pdf;
        setFolder(folderName);
        break;
      case DocumentPicker.types.audio:
        folderName = 'audios';
        mimeType = MimeType.audio;
        setFolder(folderName);
        break;
      case DocumentPicker.types.video:
        folderName = 'videos';
        mimeType = MimeType.video;
        setFolder(folderName);
        break;
    }

    const presignedPost = {
      file_name: file.name ? file.name : '',
      file_type: mimeType,
      folder_name: folderName,
      is_public: true,
      file_size: size,
    };

    dispatch(
      uploadCollection({
        file,
        presignedPost,
        callback: (percentage: number) => {
          setProgress(percentage);
        },
        onSuccess: data => {
          isUploading.current = false;
          setFilePath(data && data.file_path);
          setDuration(data && data.duration);
        },
        onFail: error => {
          setProgress(0);
          isUploading.current = false;
          setTimeout(() => {
            NavigationActionsService.showErrorPopup(error);
          }, 500);
        },
      }),
    );
  };

  const onPressSkip = () => {
    toMain();
  };

  const onPressActivePopUp = () => {
    setShowPopup(false);
    if (props.isFromProfile) {
      NavigationActionsService.pop();
    } else {
      toMain();
    }
  };

  const onPressGenres = () => {
    setShowMutilPopup(true);
  };

  const onPressActiveMutil = (data: GenreItem[], formikProps: any) => {
    setShowMutilPopup(false);
    let genreSelectedName = data.filter(item => item.selected).map(item => item.name);
    let genreSelectedId = data.filter(item => item.selected).map(item => item.id);
    if (genreSelectedName && genreSelectedName.length > 0) {
      formikProps.setFieldValue('genre', genreSelectedName.join(', ').toString());
    } else {
      formikProps.setFieldValue('genre', '');
    }
    if (genreSelectedId && genreSelectedId.length > 0) {
      formikProps.setFieldValue('genreid', genreSelectedId.join(', ').toString());
    } else {
      formikProps.setFieldValue('genreid', '');
    }
  };

  const onBackdropPressMutil = () => {
    setShowMutilPopup(false);
  };

  const onBack = () => {
    NavigationActionsService.pop();
  };

  const rightAction = () => {
    mFormikProps.handleSubmit();
  }

  const renderHeader = () => (
    props.isFromProfile ?
      (
        <CustomHeader
          containerStyle={styles.headerContainer}
          leftImage={BACK}
          leftAction={onBack}
          title={translate('upload_collection.upload')}
          rightAction={progress == 100 && (progressImage == 0 || progressImage == 1) && (progressCover == 0 || progressCover == 1) ? rightAction : undefined}
          rightText={progress == 100 && (progressImage == 0 || progressImage == 1) && (progressCover == 0 || progressCover == 1) ? translate('upload_collection.submit') : undefined}
          rightTextStyle={{ color: 'red' }} />
      ) : (
        <View style={styles.headerUpload}>
          <CustomTouchable style={{ alignSelf: 'flex-end' }} onPress={onPressSkip}>
            <CustomText text={translate('upload_collection.skip')} style={styles.contentSkip}></CustomText>
          </CustomTouchable>
          <CustomText text={translate('upload_collection.upload_your_collection')} style={styles.contentUpLoad}></CustomText>
        </View>
      )
  )

  const getNamePopup = () => {
    switch (folder) {
      case 'books':
        return 'book';
      case 'videos':
        return 'video';
      case 'audios':
        return 'audio';
    }
  };

  const _onSelectStatic = (pos: number, item: string) => {
    const shouldCreateNewItem = data.filter(dataItem => {
      const personFilterred = listPerson.find(person => {
        return person.key == Object.keys(dataItem)[0]
      })
      return dataItem[personFilterred.key] && dataItem[personFilterred.key].firstName == '' && dataItem[personFilterred.key].lastName == ''
    }).length == 0

    if (shouldCreateNewItem) {
      const keyItem = listPerson.find(i => i.name == item).key
      const cloneData = clone(data)
      setData([...cloneData, { [keyItem]: { firstName: '', lastName: '' } }])

      const itemName = listPerson.find(i => i.name == item).name
      const cloneDataName = clone(dataName)
      setDataName([...cloneDataName, itemName])
    }
  };

  const onSelectChildContributor = (pos: number, item: string, index: number) => {
    const cloneData = clone(data);
    const newItem = clone(cloneData[index]);
    cloneData[index] = { [listPerson.find(i => i.name == item).key]: newItem[Object.keys(newItem)[0]] }
    setData(cloneData)
    const cloneDataName = clone(dataName);
    cloneDataName[index] = listPerson.find(i => i.name == item).name
    setDataName(cloneDataName)
  }

  const onChangeTextFirstName = (text: string, index: number, ite: any) => {
    const cloneData = clone(data);
    let newItem = cloneData[index];
    newItem[`${Object.keys(ite)[0]}`].firstName = text
    cloneData[index] = newItem;
    setData(cloneData)
  }

  const onChangeTextLastName = (text: string, index: number, ite: any) => {
    const cloneData = clone(data);
    let newItem = cloneData[index];
    newItem[`${Object.keys(ite)[0]}`].lastName = text;
    cloneData[index] = newItem;
    setData(cloneData)
  }

  const renderContributor = () => {
    return data.map((ite, index) => (<View key={index} style={{ marginTop: 20 }}>
      <CustomDropDown
        data={listPerson.length > 0 ? listPerson.map(item => (item.name)) as string[] : []}
        defaultValue={dataName[index]}
        defaultIndex={listPerson.findIndex(item => (item.key === Object.keys(ite)[0]))}
        onSelect={(pos: number, item: string) => onSelectChildContributor(pos, item, index)} />
      <CustomInput
        onChangeText={(text: string) => onChangeTextFirstName(text, index, ite)}
        placeholder={translate('upload_collection.first_name')}
        returnKeyType="next"
        value={data[index][`${Object.keys(ite)[0]}`].firstName}
        moreStyle={styles.title} />
      <CustomInput
        onChangeText={(text: string) => onChangeTextLastName(text, index, ite)}
        placeholder={translate('upload_collection.last_name')}
        returnKeyType="next"
        moreStyle={styles.title}
        value={data[index][`${Object.keys(ite)[0]}`].lastName} />
    </View>)
    )
  }

  const onPressUpload = (type: UploadField) => {
    if (!isUploading.current) {
      setUploadField(type);
      uploadType.current = type;
    }
  }

  const renderChoosePhotoItem = (type: UploadField, text: string, progress: number) => (
    <View style={{ alignItems: 'flex-start' }}>
      <CustomText text={text} />
      <CustomTouchable style={styles.choosePhotoItem} onPress={onPressUpload.bind(undefined, type)}>
        <Image source={PLUS} />
        {progress > 0 && <Image
          style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
          source={{ uri: type == UploadField.COVER ? cover : image }} />}
      </CustomTouchable>
      { progress > 0 && progress < 1 && <Progress.Bar style={styles.progress} color={'#FF0000'} progress={progress} />}
    </View>
  )

  const renderChoosePhoto = () => (
    <View style={styles.choosePhotoContainer}>
      {renderChoosePhotoItem(UploadField.AVATAR, 'Image', progressImage)}
      {renderChoosePhotoItem(UploadField.COVER, 'Cover', progressCover)}
    </View>
  )

  const renderPicker = () => (
    <DocumentPickerImage
      ref={imageRef}
      onCompleted={onCompletedPickerImage}
      titlePopup={uploadField == UploadField.COVER ? 'Upload Cover' : 'Upload Image'} />
  )

  const onCompletedPickerImage = (imageResponse: any) => {
    let file = {};
    let uri = '';
    let typeCollection = '';
    let name = '';
    let size = 0;

    switch (uploadType.current) {
      case UploadField.AVATAR:
        setProgressImage(0);
        break;
      case UploadField.COVER:
        setProgressCover(0);
        break;
      default: break;
    }

    isUploading.current = true;

    if (imageResponse) {
      if (Platform.OS === 'ios') {
        name =
          moment()
            .valueOf()
            .toString() + '.jpg';
      } else {
        const names = imageResponse.path ? imageResponse.path.split('/') : [];
        name = names && names.length > 0 ? names[names.length - 1] : '';
      }
      uri = imageResponse.path ? imageResponse.path : '';
      size = imageResponse.size ? imageResponse.size : 0;
      typeCollection = imageResponse.mime;
    }

    file = {
      uri,
      type: typeCollection,
      name,
    };

    const presignedPost: PreSignedUrlParam = {
      file_name: name,
      file_type: typeCollection,
      folder_name: 'photos',
      is_public: true,
      file_size: size,
    };

    dispatch(
      uploadCollection({
        file,
        presignedPost,
        callback: (percentage: number) => {
          switch (uploadType.current) {
            case UploadField.AVATAR:
              percentage < 100 && setProgressImage(percentage / 100);
              setImage(imageResponse.path);
              break;
            case UploadField.COVER:
              percentage < 100 && setProgressCover(percentage / 100);
              setCover(imageResponse.path)
              break;
            default: break;
          }
        },
        onSuccess: data => {
          if (data) {
            switch (uploadType.current) {
              case UploadField.AVATAR:
                setProgressImage(1);
                imagePath.current = data.file_path;
                break;
              case UploadField.COVER:
                setProgressCover(1);
                coverPath.current = data.file_path;
                break;
              default: break;
            }
          }
          isUploading.current = false;
        },
        onFail: error => {
          setTimeout(() => {
            NavigationActionsService.showErrorPopup(error);
          }, 500);
          isUploading.current = false; switch (uploadType.current) {
            case UploadField.AVATAR:
              setImage(undefined)
              setProgressImage(0);
              break;
            case UploadField.COVER:
              setCover(undefined);
              setProgressCover(0);
              break;
            default: break;
          }
        },
      }),
    );
  }

  return (
    <Container>
      <CustomPopup
        text={`Your ${getNamePopup()} has been upload successfully`}
        loading={isShowPopup}
        onPressRedButton={onPressActivePopUp}
      />
      {renderHeader()}
      {renderPicker()}
      <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} style={{ flex: 1 }}>
        <View style={styles.container}>
          <Formik
            initialValues={{ files: '', title: '', genre: '', description: '', genreid: '' }}
            onSubmit={onSubmitCollection}
            validationSchema={validationObject}>
            {formikProps => {
              mFormikProps = formikProps
              return (
                <View>
                  <MutilSelectPopup onBackdropPress={onBackdropPressMutil} loading={isShowMutilPopup} listGenres={listGenres} onPressActive={item => onPressActiveMutil(item, formikProps)} />
                  <DocumentPickerCustom
                    ref={documentRef}
                    onCompleted={(imageResponse: ImagePickerResponse,
                      documentResponse: DocumentPickerResponse,
                      docType: any,) => { onCompletedPicker(imageResponse, documentResponse, docType, formikProps); }}
                  />
                  <CustomTouchable onPress={onChooseCollection}>
                    <View style={styles.containerUpload}>
                      <Image source={HEADPHONEICON} style={styles.image} />
                      {docType && (nameFile || uri)
                        ? renderItemCollection()
                        : <CustomText text={translate('upload_collection.upload_bool_video_audio')} style={styles.contentUploadBook}></CustomText>
                      }
                    </View>
                  </CustomTouchable>
                  <ErrorMessage errorValue={formikProps.touched.files && formikProps.errors.files} />
                  {renderChoosePhoto()}
                  <CustomInput
                    onChangeText={formikProps.handleChange('title')}
                    onSubmitEditing={onPressGenres}
                    placeholder={translate('upload_collection.title')}
                    returnKeyType="next"
                    moreStyle={styles.title}
                    value={formikProps.values.title}
                    onBlur={formikProps.handleBlur('title')} />
                  <ErrorMessage errorValue={formikProps.touched.title && formikProps.errors.title} />
                  <CustomTouchable style={styles.genre} onPress={onPressGenres}>
                    <CustomInput
                      onChangeText={formikProps.handleChange('genre')}
                      placeholder={translate('upload_collection.genre')}
                      returnKeyType="next"
                      pointerEvents={'none'}
                      editable={false}
                      value={formikProps.values.genre} />
                  </CustomTouchable>
                  <ErrorMessage errorValue={formikProps.touched.genre && formikProps.errors.genre} />
                  <CustomInput
                    onChangeText={formikProps.handleChange('description')}
                    placeholder={translate('upload_collection.description')}
                    returnKeyType="next"
                    multiline={true}
                    inputStyle={styles.description}
                    numberOfLines={4}
                    moreStyle={styles.descriptionMore}
                    value={formikProps.values.description}
                    onBlur={formikProps.handleBlur('description')} />
                  <ErrorMessage errorValue={formikProps.touched.description && formikProps.errors.description} />
                  {renderContributor()}
                  <CustomDropDown
                    data={listPerson.length > 0 ? listPerson.map(item => (item.name)) as string[] : []}
                    defaultValue={'Add Contributor'}
                    onSelect={_onSelectStatic}
                    containerStyle={styles.dropDownStyle}
                    isStaticButton={true} />
                </View>
              )
            }}
          </Formik>
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default UploadCollection;
