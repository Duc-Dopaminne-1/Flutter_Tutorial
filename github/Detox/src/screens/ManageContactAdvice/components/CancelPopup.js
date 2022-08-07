import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {
  CloseSupportRequestFoMutationVariables,
  GetSupportRequestClosingReasonsQueryVariables,
  SupportRequestClosingReasonDto,
  useCloseSupportRequestFoMutation,
  useGetSupportRequestClosingReasonsLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy, useMutationGraphql} from '../../../api/graphql/useGraphqlApiLazy';
import {MAX_LENGTH} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS, normal, small} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';
import InputSection from '../../../components/InputSection';
import RadioSelectionsView, {ITEM_TYPE} from '../../../components/RadioSelectionsView';
import ValidateInput from '../../../utils/ValidateInput';
import {useMount} from '../../commonHooks';

const ID_ORTHER_REASON = '94af6582-31ae-4d38-8315-6451e13e4721';

const CancelPopup = ({supportRequestId, onSuccess, onError}) => {
  const [reasons, setReasons] = useState([]);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});
  const [selectedReasonId, setSelectedReasonId] = useState(-1);
  const isOrtherReason = selectedReasonId === ID_ORTHER_REASON;

  const {startApi: getReasons} = useGraphqlApiLazy({
    graphqlApiLazy: useGetSupportRequestClosingReasonsLazyQuery,
    dataField: 'getSupportRequestClosingReasons',
    onSuccess: response => {
      const edges: SupportRequestClosingReasonDto[] = response.edges;
      const data = edges
        .filter(item => item.type === 1)
        .map(item => ({id: item.id, title: item.description}));
      setReasons(data);
      if (data.length > 0) {
        setSelectedReasonId(data[0].id);
      }
    },
  });

  const {startApi: closeSupportRequest} = useMutationGraphql({
    graphqlApiLazy: useCloseSupportRequestFoMutation,
    dataField: 'closeSupportRequestFO',
  });

  useMount(() => {
    const variables: GetSupportRequestClosingReasonsQueryVariables = {};
    getReasons({variables});
  });

  const onChosen = ({id}) => {
    setSelectedReasonId(id);
  };

  const validate = () => {
    if (!isOrtherReason) {
      return true;
    }
    const errorObj = {
      note: ValidateInput.checkRequiredField(note),
    };
    setErrors(errorObj);
    for (const [, value] of Object.entries(errorObj)) {
      if (value) {
        return false;
      }
    }
    return true;
  };

  const onPressConfirm = () => {
    if (!validate()) {
      return;
    }
    const variables: CloseSupportRequestFoMutationVariables = {
      input: {
        supportRequestId,
        supportRequestClosingReasonId: selectedReasonId,
        notes: note,
      },
    };
    closeSupportRequest({variables}, onSuccess, onError);
  };

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.title}>{translate('contactAdvice.detail.cancel')}</Text>
        <Text style={styles.description}>{translate('contactAdvice.detail.reason')}</Text>
        {reasons.length > 0 && (
          <RadioSelectionsView
            data={reasons}
            chosenItemId={selectedReasonId}
            type={ITEM_TYPE.FULL}
            onChosen={onChosen}
          />
        )}
        {isOrtherReason && (
          <InputSection
            placeholder={translate('contactAdvice.detail.reasonPlaceholder')}
            inputStyle={styles.textArea}
            value={note}
            error={errors?.note}
            onChangeText={setNote}
            multiline
            maxLength={MAX_LENGTH.textArea}
          />
        )}
      </View>
      <View style={commonStyles.footerContainer}>
        <CustomButton
          style={styles.confirm}
          title={translate(STRINGS.CONFIRM)}
          onPress={onPressConfirm}
        />
      </View>
    </View>
  );
};

export default CancelPopup;

const styles = StyleSheet.create({
  container: {
    padding: normal,
  },
  title: {
    ...FONTS.bold,
    fontSize: 21,
    color: COLORS.BLACK_31,
  },
  description: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.GRAY_9C,
    marginTop: normal,
    marginBottom: small,
  },
  textArea: {
    height: 80,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_E4,
    borderRadius: 4,
    ...METRICS.horizontalPadding,
  },
  confirm: {
    ...commonStyles.buttonNext,
    flex: 1,
  },
});
