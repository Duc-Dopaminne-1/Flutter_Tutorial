import CustomInput from '../../../../components/custom_input';
import React from 'react';
import { StyleSheet } from 'react-native';

const FileUploader = ({ item, onChange, addNewFile }) => {
  return (
    <CustomInput
      translateTitle
      item={item}
      key={item?.key}
      title={item?.name}
      type={item?.type}
      placeholder={item?.name}
      value={item?.value}
      onFilePicker={onChange}
      onAddNewFile={addNewFile}
      style={styles.container}
    />
  );
};

export default FileUploader;

const styles = StyleSheet.create({
  container: {
    marginTop: 0
  }
});
