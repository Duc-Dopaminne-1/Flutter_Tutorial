import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import React, { useState, useEffect } from 'react';
import Container from '@components/Container';
import styles from './styles';
import translate from '@src/localize';
import { BACK } from '@src/constants/icons';
import { CustomHeader } from '@src/components/CustomHeader';
import NavigationActionsService from '@src/navigation/navigation';
import { Input } from 'react-native-elements';
import { colors, HEIGHT } from '@src/constants/vars';
import { useDispatch } from 'react-redux';
import { createComment } from '@src/modules/comment/actions';
import { createComment as createCommentBook } from '@src/modules/books/actions';
import { ModelEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/comment';
import { CustomButton } from '@src/components/CustomButton';

interface Props {
  id: string;
  model: ModelEnum;
  refreshOnBack?: () => void;
}

const AddComment = (props: Props) => {
  const { id, model } = props;
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', onKeyboardShow);
    Keyboard.addListener('keyboardWillHide', onKeyboardHide);
  }, []);

  const onKeyboardShow = () => {
    setShowKeyboard(true);
  };

  const onKeyboardHide = () => {
    setShowKeyboard(false);
  };

  const onBack = () => {
    props.refreshOnBack && props.refreshOnBack();
    NavigationActionsService.pop();
  };

  const onAddComment = () => {

    if (text.trim() != '') {
      if (model == ModelEnum.Book) {
        dispatch(
          createCommentBook({
            model_id: id,
            text: text.trim(),
            onSuccess: () => {
              props.refreshOnBack && props.refreshOnBack();
              NavigationActionsService.pop();
            },
            onFail: error => {
              NavigationActionsService.showErrorPopup(error);
            },
          }),
        );
      } else {
        dispatch(
          createComment({
            model: model,
            model_id: id,
            text: text.trim(),
            onSuccess: () => {
              props.refreshOnBack && props.refreshOnBack();
              NavigationActionsService.pop();
            },
            onFail: error => {
              NavigationActionsService.showErrorPopup(error);
            },
          }),
        );
      }
    } else {
      NavigationActionsService.showCustomPopup({
        text: translate('alert.message_comment_empty'),
      });
    }
  };

  const onChangeText = (text: string) => {
    setText(text);
  };

  const renderHeader = () => {
    return <CustomHeader title={translate('books.add_comment')} leftImage={BACK} leftAction={onBack} />;
  };

  const renderButton = () => {
    return (
      <SafeAreaView>
        <CustomButton style={styles.button} text={translate('books.submit')} onPress={onAddComment} />
      </SafeAreaView>
    );
  };

  return (
    <Container>
      {renderHeader()}
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'android' ? 50 : 0}>
          <Input
            containerStyle={[styles.container, showKeyboard ? { height: HEIGHT / 3 } : { height: 50 }]}
            placeholderTextColor={colors.TEXT_PLACEHOLDER}
            inputStyle={styles.inputStyle}
            inputContainerStyle={styles.inputContainer}
            multiline
            placeholder={translate('books.comment_place_holder')}
            value={text}
            onChangeText={onChangeText}
          />
          {renderButton()}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Container>
  );
};

export default AddComment;
