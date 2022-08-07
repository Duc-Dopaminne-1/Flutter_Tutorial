import { useNavigation, useRoute } from '@react-navigation/native';
import { clearCreateOrEditTransaction } from '../../../../redux/actions/cashout.js';
import { updateProfileHandle } from '../../../../redux/actions/member.js';
import { updateOrderStatusHandle } from '../../../../redux/actions/order.js';
import { ORDER } from '../../../../redux/actionsType';
import {
  ExpandView,
  FloatFooter,
  PrimaryButton,
  TextView,
  WithLoading
} from '../../../../components/index.js';
import { BACKGROUND_COLOR } from '../../../../constants/colors.js';
import SCREENS_NAME from '../../../../constants/screens.js';
import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../../utils/responsive.js';
import styles from './styles.js';

const ConfirmAccountRefund = props => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const currentProfile = route.params?.currentProfile || {};
  const item = route.params?.item || {};
  const isSuccess = useSelector(state => state.cashout.isSuccess);
  const bank = useSelector(state => state.masterData.bank);
  const comfirm = () => {
    const dataSubmit = {
      ...currentProfile,
      averageIncome: currentProfile?.averageIncome ? currentProfile.averageIncome : 100000
    };

    dispatch(updateProfileHandle({ params: dataSubmit }));
    updateOrderStatusHandle({ params: statusObj });
    const statusObj = {
      id: item.id,
      status: 'WaitingForApproveCancelOrder',
      Beneficiary: currentProfile?.accountHolder,
      Bank: currentProfile?.bank,
      BankProvinceCity: currentProfile?.bankProvince,
      BankAccount: currentProfile?.bankAccount,
      Branch: currentProfile?.bankBranch,
      DepositMethod: 'Linked'
    };
    dispatch(
      updateOrderStatusHandle({
        params: statusObj,
        callback: (_err, _res) => {
          if (!_err) {
            navigation.navigate(SCREENS_NAME.CANCEL_ORDER_APPLICATION_INSURANCE_SCREEN);
          }
        }
      })
    );
  };

  React.useEffect(() => {
    if (isSuccess) {
      dispatch(clearCreateOrEditTransaction());
      navigation.navigate(SCREENS_NAME.REFUND_REQUEST_SUCCESS);
    }
  }, [isSuccess]);

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.confirmRefundRequestWrapper}>
      <ExpandView canExpand={false} translate title={'account_balance.account_info'} translateTitle>
        <TextView
          translate
          title="info_account_refund.beneficiary"
          value={currentProfile?.accountHolder || ''}
        />
        <TextView
          translate
          title="profile.bank_name"
          value={bank.find(t => t.code === (currentProfile?.bank || ''))?.displayName || ''}
        />
        <TextView
          translate
          title="info_account_refund.branch"
          value={currentProfile?.bankBranch || ''}
        />
        <TextView
          translate
          title="info_account_refund.province"
          value={currentProfile?.bankProvince || ''}
        />
        <TextView translate title="profile.bank_number" value={currentProfile?.bankAccount || ''} />
      </ExpandView>

      <FloatFooter style={styles.footer}>
        <View style={[styles.flex, { marginRight: scale(15) }]}>
          <PrimaryButton
            translate
            title={'common.back'}
            onPress={goBack}
            titleStyle={styles.backTitle}
            backgroundColor={'rgba(240, 140, 49, 0.25)'}
            backgroundColorDisabled={BACKGROUND_COLOR.Silver}
          />
        </View>
        <View style={styles.flex}>
          <PrimaryButton
            translate
            onPress={comfirm}
            title={'common.confirm'}
            disabledText={styles.disabledText}
            backgroundColorDisabled={BACKGROUND_COLOR.Silver}
          />
        </View>
      </FloatFooter>
    </View>
  );
};

ConfirmAccountRefund.propTypes = {
  // bla: PropTypes.string,
};

ConfirmAccountRefund.defaultProps = {
  // bla: 'test',
};

export default WithLoading(ConfirmAccountRefund, [ORDER.UPDATE_ORDER_STATUS.HANDLER]);
