import { useNavigation, useRoute } from '@react-navigation/native';
import {
  clearCreateOrEditTransaction,
  createOrEditTransactionHandle
} from '../../../redux/actions/cashout.js';
import { updateProfileHandle } from '../../../redux/actions/member.js';
import AppText from '../../../components/app_text/index.js';
import {
  ExpandView,
  FloatFooter,
  PrimaryButton,
  SecondaryButton,
  TextView
} from '../../../components/index.js';
import { BACKGROUND_COLOR } from '../../../constants/colors.js';
import SCREENS_NAME from '../../../constants/screens.js';
import { formatNumber } from '../../../helpers/formatNumber.js';
import moment from 'moment';
import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MEMBER_TYPE } from '../../../global/member_type.js';
import { scale } from '../../../utils/responsive.js';
import styles from './styles.js';

const ConfirmRefundRequest = props => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const role = useSelector(state => state.auth.role);
  const depositValue = route.params?.depositValue || 0;
  const topenId = useSelector(state => state.auth.topenId);
  const currentProfile = route.params?.currentProfile || {};
  const form = route.params?.form || {};
  const { profile, topenIdProfile } = useSelector(state => state.member);
  const { expectedDepositRefundCompleted } = useSelector(state => state.deposit);
  const time = moment().add(expectedDepositRefundCompleted, 'days').format('DD/MM/YYYY');
  const isSuccess = useSelector(state => state.cashout.isSuccess);
  const bank = useSelector(state => state.masterData.bank);
  const comfirm = () => {
    const dataSubmit = {
      ...currentProfile,
      averageIncome: currentProfile?.averageIncome ? currentProfile.averageIncome : 100000
    };
    dispatch(updateProfileHandle({ params: dataSubmit }));
    dispatch(
      createOrEditTransactionHandle({
        orderId: form?.id || '',
        memberId: profile?.id || '',
        isAffiliateAccount: true,
        bank: profile?.bank,
        bankBranch: profile?.bankBranch,
        bankProvince: profile?.bankProvince,
        bankAccount: profile?.bankAccount,
        accountHolder: profile?.accountHolder
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
          title="info_account_deposit.beneficiary"
          value={currentProfile?.accountHolder || ''}
        />
        <TextView
          translate
          title="profile.bank_name"
          value={bank.find(t => t.code === (currentProfile?.bank || ''))?.displayName || ''}
        />
        <TextView
          translate
          title="account_balance.bank_branch"
          value={bank.find(t => t.code === (currentProfile?.bankBranch || ''))?.displayName || ''}
        />
        <TextView translate title="account_balance.town_city" value={currentProfile.bankProvince} />

        <TextView translate title="profile.bank_number" value={currentProfile?.bankAccount || ''} />
      </ExpandView>
      <ExpandView
        translate
        canExpand={false}
        style={styles.content02}
        title={'account_balance.transaction_info'}
        translateTitle>
        <TextView
          translate
          title="info_account_deposit.deposit_amount"
          style={styles.money}
          value={
            <AppText translate>
              {formatNumber(depositValue) + ''}
              {'common.currency'}
            </AppText>
          }
        />
        <TextView translate title="info_account_deposit.time_receive_money" value={time} />
      </ExpandView>
      <FloatFooter style={styles.footer}>
        <View style={[styles.flex, { marginRight: scale(15) }]}>
          <SecondaryButton
            translate
            title={'common.back'}
            onPress={goBack}
            titleStyle={styles.backTitle}
          />
        </View>
        <View style={styles.flex}>
          <PrimaryButton translate onPress={comfirm} title={'common.confirm'} />
        </View>
      </FloatFooter>
    </View>
  );
};

ConfirmRefundRequest.propTypes = {
  // bla: PropTypes.string,
};

ConfirmRefundRequest.defaultProps = {
  // bla: 'test',
};

export default ConfirmRefundRequest;
