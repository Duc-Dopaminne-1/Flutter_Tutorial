import {useApolloClient} from '@apollo/client';
import {useContext} from 'react';
import DocumentPicker, {types} from 'react-native-document-picker';

import {uploadSecuredFiles} from '../api/userApi/uploadApi';
import {AppContext} from '../appData/appContext/appContext';

export type Document = {
  name: String,
  securedUrl: String,
  length: Number,
  type: String,
};

const useUploadDocument = () => {
  const {showAppSpinner} = useContext(AppContext);
  const client = useApolloClient();

  const openDocument = () => {
    return DocumentPicker.pick({
      type: [types.pdf, types.doc, types.docx, types.xls, types.xlsx, types.ppt, types.pptx],
      allowMultiSelection: true,
      presentationStyle: 'fullScreen',
    }).then(async files => {
      showAppSpinner(true);
      const response: {data: Array<Document>} = await uploadSecuredFiles(
        files.map(file => ({
          name: file.name,
          path: file.uri,
          length: file.size,
          type: file.type,
        })),
        client,
      );
      showAppSpinner(false);
      return response.data;
    });
  };

  return {
    openDocument,
  };
};

export default useUploadDocument;
