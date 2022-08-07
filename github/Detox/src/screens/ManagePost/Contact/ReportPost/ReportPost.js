import PropTypes from 'prop-types';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {IconButton} from 'react-native-paper';

import {
  useCreateUserReportSpamMutation,
  useGetSpamTypesLazyQuery,
} from '../../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../../appData/appContext/useAppContext';
import {CONSTANTS, MAX_LENGTH} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {Message} from '../../../../assets/localize/message/Message';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {medium, normal, small} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomButton from '../../../../components/Button/CustomButton';
import DropdownWithTitle from '../../../../components/DropdownWithTitle';
import RequiredLabel from '../../../../components/RequiredLabel';
import WhiteBoxInput from '../../../../components/WhiteBoxInput';
import ValidateInputMessage from '../../../../utils/ValidateInputMessage';
import {callAfterInteraction, useMount} from '../../../commonHooks';

const styles = StyleSheet.create({
  reportContent: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    paddingHorizontal: normal,
    paddingVertical: medium,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  inputTitle: {
    ...FONTS.regular,
    color: COLORS.BLACK_33,
  },
  textboxTitle: {
    marginBottom: small,
  },
  input: {
    borderRadius: 4,
    height: CONSTANTS.INPUT_DESCRIPTION_HEIGHT,
    borderColor: COLORS.DISABLE_BUTTON,
    borderWidth: SIZES.BORDER_WIDTH_1,
  },
  dropdown: {
    marginBottom: small * 3,
  },
  inputTextboxTitle: {
    marginBottom: normal,
  },
  nextButton: {
    ...commonStyles.buttonNext,
    marginTop: normal,
  },
});

const ReportPost = ({propertyPostId, onPressClose, onReportSuccess}) => {
  const [items, setItems] = useState([]);
  const [spamTypeId, setSpamTypeId] = useState('');
  const [comments, setComments] = useState('');
  const [errors, setErrors] = useState({});
  const [submited, setSubmited] = useState(false);
  const {showErrorAlert, showMessageAlert} = useContext(AppContext);

  const onSuccess = data => {
    if (data && data.edges) {
      const list = data.edges;
      if (list) {
        const options = [...list]
          .sort((a, b) => {
            return a.sortOrder - b.sortOrder;
          })
          .map(item => {
            return {
              id: item.spamTypeId,
              name: item.spamTypeDescription,
            };
          });
        if (options && options[0]) {
          options[0].checked = true;
          setSpamTypeId(options[0].id);
          setItems(options);
        }
      }
    }
  };
  const onPostSuccess = () => {
    callAfterInteraction(() => {
      showMessageAlert(translate(STRINGS.SUCCESS), translate(Message.PTM_MES_002));
      onReportSuccess && onReportSuccess();
      onPressClose(true);
    });
  };
  const onPostError = () => {
    callAfterInteraction(() => {
      showErrorAlert(translate(Message.PTM_ERR_002));
    });
  };
  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useGetSpamTypesLazyQuery,
    dataField: 'spamTypes',
    onSuccess,
  });
  const {startApi: sendReport} = useGraphqlApiLazy({
    graphqlApiLazy: useCreateUserReportSpamMutation,
    dataField: '',
    onSuccess: onPostSuccess,
    onError: onPostError,
    showSpinner: true,
  });

  useMount(startApi);

  const validateForm = () => {
    const errorsObj = {
      spamTypeId: ValidateInputMessage.checkRequiredFieldMessage(spamTypeId),
      comments: ValidateInputMessage.checkRequiredFieldMessage(comments),
    };
    setErrors(errorsObj);
    for (const [, value] of Object.entries(errorsObj)) {
      if (value) {
        return false;
      }
    }
    return true;
  };
  const submitForm = () => {
    setSubmited(true);
    if (!validateForm()) {
      return;
    }
    callAfterInteraction(() => {
      sendReport({
        variables: {
          input: {
            userReportSpamDto: {
              spamTypeId: spamTypeId,
              propertyPostId: propertyPostId,
              comments: comments,
            },
          },
        },
      });
    });
  };
  useEffect(() => {
    if (submited) {
      validateForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spamTypeId, comments]);
  return (
    <View style={styles.reportContent}>
      <IconButton
        icon="chevron-down"
        color={COLORS.GREY_82}
        size={24}
        style={styles.closeButton}
        onPress={onPressClose}
      />
      <DropdownWithTitle
        title={translate(STRINGS.POST_HAVE_PROBLEM)}
        dropdownTitle={translate(STRINGS.PLEASE_SELECT)}
        items={items}
        showSearchBox={false}
        style={styles.dropdown}
        inputStyle={commonStyles.dropdownInput}
        headerStyles={{...styles.inputTitle, ...styles.textboxTitle}}
        itemSelected={item => setSpamTypeId(item.id)}
        error={errors.spamTypeId}
        isRequired={true}
      />
      <RequiredLabel
        title={translate(STRINGS.EXPLANT_DETAIL_PROBLEM)}
        titleStyle={{...styles.inputTitle, ...styles.inputTextboxTitle}}
      />
      <WhiteBoxInput
        textInputStyle={styles.input}
        onChangeText={setComments}
        value={comments}
        maxLength={MAX_LENGTH.textArea}
        error={errors.comments}
        multiline={true}
        style={styles.inputContainer}
        alignTop={true}
      />
      <CustomButton
        title={translate(STRINGS.CONFIRM_SEND)}
        style={styles.nextButton}
        onPress={submitForm}
      />
    </View>
  );
};

ReportPost.propTypes = {
  onPressClose: PropTypes.func,
  onReportSuccess: PropTypes.func,
};

ReportPost.defaultProps = {
  onPressClose: () => {},
  onReportSuccess: () => {},
};

export default ReportPost;
