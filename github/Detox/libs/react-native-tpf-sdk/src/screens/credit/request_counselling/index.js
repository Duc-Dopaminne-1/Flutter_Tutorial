import React from 'react';
import styles from './styles';
import { translate } from '../../../i18n';
import { FloatFooter } from '../../../components/';
import AppText from '../../../components/app_text';
import { createSelector } from 'reselect';
import { View, TextInput } from 'react-native';
import { CUSTOM_COLOR } from '../../../constants/colors';
import { ICAttach, ICDown } from '../../../assets/icons';
import PrimaryButton from '../../../components/primary_button';
import TertiaryButton from '../../../components/tertiary_button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';

const selectText = createSelector(
  state => state.setting.lang,
  (_, children) => children,
  (_, children) => {
    return translate(children);
  }
);

const Input = ({ value, icon, placeholder, underline = false, styleContainer = {} }) => {
  return (
    <>
      <View style={[styles.inputWrapper, styleContainer]}>
        <TextInput
          defaultValue={value}
          style={[styles.input, underline && styles.underline]}
          placeholder={placeholder}
          placeholderTextColor={CUSTOM_COLOR.Ghost}
        />
        {icon ? <View style={styles.icon}>{icon}</View> : null}
      </View>
    </>
  );
};

const RequestCounselling = props => {
  const projectLoan = useSelector(state => selectText(state, 'loan.project_loan'));
  const borrowingProblems = useSelector(state => selectText(state, 'loan.borrowing_problems'));

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        extraHeight={80}
        keyboardOpeningTime={-1}
        enableResetScrollToCoords={false}
        style={styles.requestCounsellingWrapper}>
        <Input value={projectLoan} />
        <Input value={borrowingProblems} icon={<ICDown />} />
        <TextInput style={styles.content} multiline />
      </KeyboardAwareScrollView>
      <FloatFooter>
        <TertiaryButton borderColor={CUSTOM_COLOR.Black} style={styles.imageAttachmentWrapper}>
          <View style={styles.iconBtn}>
            <ICAttach />
          </View>
          <AppText translate>{'create_support.attach'}</AppText>
        </TertiaryButton>
        <PrimaryButton
          translate
          style={styles.submit}
          titleStyle={styles.submitText}
          title={'create_support.btn_request'}
        />
      </FloatFooter>
    </View>
  );
};

RequestCounselling.propTypes = {
  // bla: PropTypes.string,
};

RequestCounselling.defaultProps = {
  // bla: 'test',
};

export default RequestCounselling;
