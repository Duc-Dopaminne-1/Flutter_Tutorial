import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { closeModal, createModal } from '../../helpers/createModal';
import Modal from './modal';

const ErrorBoundary = props => {
  const { children } = props;
  const isError = useSelector(state => state?.system?.isError);

  React.useEffect(() => {
    if (isError) {
      createModal(<Modal />);
    } else {
      closeModal();
    }
  }, [isError]);

  return <View style={styles.container}>{children}</View>;
};

export default ErrorBoundary;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
