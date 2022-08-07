import React, { useRef } from 'react';
import { View, Alert } from 'react-native';
import { PLUS } from '@src/constants/icons';
import styles from './styles';
import { CustomText } from '../CustomText';
import { ImageButton } from '../CustomButton';
import DocumentPickerImage from '../DocumentPickerImage';
import translate from '@src/localize';

interface Props {
  description?: string;
  onCompletedPickerImage: (imageResponse: any) => void
  images: string[];
  numberOfImage?: number;
}
const AddImage = (props: Props) => {

  const documentRef: any = useRef(null);
  const { description, onCompletedPickerImage, numberOfImage = 5 } = props;

  const onPressAdd = () => {
    if (props.images.length >= numberOfImage) {
      if (numberOfImage === 1) {
        Alert.alert(translate('alert.title_error'), `Maximum is ${numberOfImage} image`);
      } else {
        Alert.alert(translate('alert.title_error'), `Maximum is ${numberOfImage} images`);
      }
      return;
    }
    documentRef.current.show();
  };

  const renderPicker = () => (
    <DocumentPickerImage
      ref={documentRef}
      onCompleted={onCompletedPickerImage} />
  );

  return (
    <View>
      {description ? <CustomText style={styles.description} text={description} /> : null}
      <ImageButton
        onPress={onPressAdd}
        icon={PLUS}
        styleContainer={styles.containerImageBtn}
        styleIcon={styles.iconImageBtn}
      />
      {renderPicker()}
    </View>
  );
};

export default React.memo(AddImage);
