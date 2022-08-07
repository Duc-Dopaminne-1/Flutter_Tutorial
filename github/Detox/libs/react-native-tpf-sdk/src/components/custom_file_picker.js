import React, { useCallback, useContext, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { useDispatch } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';

import { ICAddFile, ICFile, ICSearchCancel } from '../assets/icons';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../constants/appFonts';
import { CUSTOM_COLOR } from '../constants/colors';
import { UPLOAD_FILE_ERROR } from '../constants/errors';
import { SPACING } from '../constants/size';
import { FileType, SupportFile } from '../global/file_type';
import { formatBytes } from '../helpers/formatBytes';
import { formatDate } from '../helpers/formatTime';
import showToast from '../helpers/showToast';
import { uploadFileStorage } from '../redux/actions/fileStorage';
import { getShowAlertError } from '../redux/actions/system';
import { scale } from '../utils/responsive';
import themeContext from '../constants/theme/themeContext';
import AppText from './app_text';
import { requestPermissionAndroid } from '../helpers/device';

const extentionList = [DocumentPicker.types.allFiles];

const CustomFilePicker = ({
  title,
  style,
  itemRef,
  onChange,
  onlyView = false,
  isRequired = false
}) => {
  const dispatch = useDispatch();
  const theme = useContext(themeContext);
  const files = itemRef?.mediaUploadValue || itemRef?.listMediaInfo || [];
  const [uploading, setUploading] = useState(false);
  const uploadCompleted = useCallback(
    res => {
      if (!res.isError) {
        const newItems = itemRef?.mediaUploadValue
          ? [...itemRef?.mediaUploadValue, res.result]
          : [res.result];

        onChange(newItems);
      } else {
        dispatch(getShowAlertError(UPLOAD_FILE_ERROR));
      }
      setUploading(false);
    },
    [itemRef, onChange, dispatch]
  );

  const onRemoveFile = useCallback(
    item => {
      const newItems =
        itemRef?.mediaUploadValue?.length > 0
          ? itemRef?.mediaUploadValue.filter(t => t.fileUrl !== item.fileUrl)
          : [];

      onChange(newItems);
    },
    [itemRef, onChange]
  );

  const onSelectFile = useCallback(
    async id => {
      try {
        const res = await DocumentPicker.pick({
          type: extentionList
        });

        const file = res[0] || res;
        const arr = file?.name?.split('.');
        const fileType = arr[arr.length - 1]?.toUpperCase();
        if (!SupportFile.includes(fileType)) {
          dispatch(
            getShowAlertError({
              ...UPLOAD_FILE_ERROR,
              message: 'errMessage.unsupport_file_error_message'
            })
          );
          return;
        }
        setUploading(true);
        dispatch(uploadFileStorage({ ...file, onCompleted: uploadCompleted }));
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err;
        }
      }
    },
    [dispatch, uploadCompleted]
  );

  const onViewFile = useCallback(async item => {
    showToast();
    let dirs = RNFetchBlob.fs.dirs;
    const arr = item?.fileName?.split('.');
    const fileType = arr[arr.length - 1]?.toUpperCase();
    const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    let path = dirToSave + '/' + item?.fileName;
    const encodedUri = encodeURI(item?.fileUrl);

    if (Platform.OS === 'android') {
      let result = await requestPermissionAndroid();

      if (result) {
        RNFetchBlob.config({
          // response data will be saved to this path if it has access right.
          fileCache: false,
          path: path,
          appendExt: fileType,
          title: item?.fileName,
          addAndroidDownloads: {
            path: path,
            useDownloadManager: true, // <-- this is the only thing required
            // Optional, override notification setting (default to true)
            notification: true,
            // Optional, but recommended since android DownloadManager will fail when
            // the url does not contains a file extension, by default the mime type will be text/plain
            mime: item?.type,
            title: item?.fileName,
            description: 'File downloaded by download manager.',
            mediaScannable: true
          }
        })
          .fetch('GET', encodedUri)
          .then(res => {
            RNFetchBlob.android.actionViewIntent(res.path(), item?.type);
          })
          .catch(err => {});
      }
    } else {
      RNFetchBlob.config({
        // response data will be saved to this path if it has access right.
        fileCache: false,
        path: path,
        appendExt: fileType,
        title: item?.fileName,
        addAndroidDownloads: {
          path: path,
          useDownloadManager: true, // <-- this is the only thing required
          // Optional, override notification setting (default to true)
          notification: true,
          // Optional, but recommended since android DownloadManager will fail when
          // the url does not contains a file extension, by default the mime type will be text/plain
          mime: item?.type,
          title: item?.fileName,
          description: 'File downloaded by download manager.',
          mediaScannable: true
        }
      })
        .fetch('GET', encodedUri)
        .then(res => {
          RNFetchBlob.ios.openDocument(res.path());
        })
        .catch(err => {});
    }
  }, []);

  const renderFileItem = useCallback(
    (item, index) => {
      const arr = item?.fileName?.split('.');
      const fileType = arr[arr.length - 1]?.toUpperCase();
      return (
        <TouchableOpacity
          style={styles.fileItem}
          onPress={() => (onlyView ? onViewFile(item) : null)}
          key={'' + index}>
          <View style={styles.fileIcon}>
            {onlyView ? null : (
              <TouchableOpacity style={styles.removeIcon} onPress={() => onRemoveFile(item)}>
                <ICSearchCancel />
              </TouchableOpacity>
            )}
            {SupportFile.includes(fileType) ? (
              FileType[fileType]
            ) : (
              <ICFile color1={theme?.icon?.color1} />
            )}
          </View>
          <View style={styles.itemInfo}>
            <AppText
              semiBold
              style={[styles.filename, { color: theme?.text?.primary }]}
              numberOfLines={2}>
              {item?.fileName}
            </AppText>
            <View style={styles.descriptionContainer}>
              <AppText
                style={[styles.description, { color: theme?.text?.secondary }]}
                numberOfLines={1}>
                {formatBytes(item?.size)}
              </AppText>
              <AppText
                style={[styles.description, { color: theme?.text?.secondary }]}
                numberOfLines={1}>
                {formatDate(item?.lastModificationTime)}
              </AppText>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [onViewFile, onRemoveFile, onlyView]
  );

  const renderFilesFooter = useCallback(
    () =>
      !onlyView ? (
        <TouchableOpacity
          style={styles.addNewContainer}
          onPress={onSelectFile}
          disabled={uploading}>
          <ICAddFile color1={theme?.app?.primaryColor1} />
          {uploading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" />
            </View>
          ) : null}
        </TouchableOpacity>
      ) : null,
    [onSelectFile, onlyView, uploading]
  );
  const RequireCharacter = isRequired ? <Text>{'*'}</Text> : null;
  return (
    <View style={[styles.container, style]}>
      <AppText translate={false} style={styles.textTitle}>
        {title} {RequireCharacter}
      </AppText>
      <View style={styles.itemListContainer}>
        {files?.length > 0 ? files.map((item, index) => renderFileItem(item, index)) : null}
      </View>
      {renderFilesFooter()}
    </View>
  );
};

export default CustomFilePicker;

const styles = StyleSheet.create({
  container: { minHeight: 3 * LINE_HEIGHT.BodyText },
  itemListContainer: {
    marginTop: SPACING.Small
  },
  textTitle: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    paddingBottom: SPACING.Normal
  },
  fileItem: {
    flexDirection: 'row',
    marginBottom: SPACING.Medium
  },
  fileIcon: {
    width: scale(48),
    height: scale(48),
    marginRight: SPACING.Medium,
    backgroundColor: CUSTOM_COLOR.WhiteGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  removeIcon: {
    position: 'absolute',
    top: -scale(4),
    right: -scale(8)
  },
  itemInfo: {
    flex: 1
  },
  descriptionContainer: {
    marginTop: SPACING.Small,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  filename: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  description: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  addNewContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  loading: {
    position: 'absolute',
    zIndex: 999,
    left: scale(8)
  }
});
