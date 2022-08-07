import React from "react";
import FastImage from "react-native-fast-image";
import { styles } from "./styles";
import { View } from "react-native";
import { CustomText } from "@src/components/CustomText";
import { CustomTouchable } from "@src/components/CustomTouchable";
import { ICompanyDocument } from "@reup/reup-api-sdk/libs/api/company/document/models";
import IMAGE_DEFAULT from '@res/icons/ForLeaseForSale/image-default.jpg';
import { PDF, EXCEL, WORD } from "@src/constants/icons";
import { formatApiToUI } from "@src/utils/date";
import { DocumentType } from "@reup/reup-api-sdk/libs/api/enum";
import translate from "@src/localize";

interface Props {
  item: ICompanyDocument;
  onPress: () => void;
}

enum FileTypes {
  PDF = 'pdf',
  PDF2 = 'application/pdf',
  WORD = 'word',
  EXCEL = 'excel',
}

const DocumentItem = (props: Props) => {
  const { item, onPress } = props;
  const getMainImage = () => {
    if (item.files_list.length) {
      switch (item.files_list[0].type) {
        case FileTypes.PDF:
        case FileTypes.PDF2:
          return PDF;
        case FileTypes.EXCEL:
          return EXCEL;
        case FileTypes.WORD:
          return WORD;
      }
    } else {
      return item.image_urls ? { uri: item.image_urls[0] } : IMAGE_DEFAULT;
    }
  };

  const getType = (type: DocumentType) => {
    switch (type) {
      case DocumentType.General:
        return translate('document.general_document');
      case DocumentType.Instruction:
        return translate('document.instruction');
      default:
        return type;
    }
  };

  return (
    <CustomTouchable style={styles.container} onPress={onPress}>
      <FastImage style={styles.mainImage} resizeMode='contain' source={getMainImage()} />
      <View style={styles.content}>
        <CustomText
          style={styles.nameDocument}
          text={item.title}
          numberOfLines={2}
          styleContainer={styles.containerNameDocument} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <CustomText
            style={styles.type}
            text={getType(item && item.type ? item.type : '')}
            numberOfLines={1}
            styleContainer={styles.containerTypeDocument} />
          <CustomText
            style={styles.date}
            text={formatApiToUI(item && item.modified ? item.modified : '')}
            numberOfLines={1}
            styleContainer={styles.containerNameDocument} />
        </View>
      </View>
    </CustomTouchable>
  );
};

export default React.memo(DocumentItem);
