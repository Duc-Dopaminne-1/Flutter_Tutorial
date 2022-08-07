import { useNavigation } from '@react-navigation/native';
import {
  createOrEditLeadHandle,
  deleteLeadClear,
  deleteLeadHandle,
  getLeadDetailClear,
  getLeadDetailHandle,
  updateStatusLeadHandle
} from '../../../redux/actions/lead';
import {
  getListInLeadScheduleClear,
  getListInLeadScheduleHandle
} from '../../../redux/actions/schedule';
import { getShowAlertError } from '../../../redux/actions/system';
import { LEAD } from '../../../redux/actionsType';
import { ICCalendarBlank, ICEnvelop, ICPhoneCall } from '../../../assets/icons';
import {
  CommonTabHeader,
  Heading,
  PrimaryButton,
  SubHead,
  WithLoading
} from '../../../components/';
import Divider from '../../../components/divider';
import FloatFooter from '../../../components/float_footer';
import ScheduleList from '../../../components/schedule_list';
import SecondaryButton from '../../../components/secondary_button';
import { TEXT_COLOR } from '../../../constants/colors';
import {
  CANNOT_UPDATE_LEAD,
  CONFIRM_DELETE_LEAD,
  DELETE_LEAD_ERROR,
  DELETE_LEAD_SUCCESS,
  REQUEST_UDPATE_EMAIL
} from '../../../constants/errors';
import SCREENS_NAME from '../../../constants/screens';
import ActionUtils from '../../../helpers/actionUtils';
import { handleTouchItem } from '../../../helpers/handleTouchItem';
import { cloneDeep } from 'lodash';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  scheduleListInLeadLoadingSelector,
  scheduleListInLeadPageSelector,
  scheduleListInLeadSelector
} from '../../../redux/selectors/schedule';
import { LIMIT_PAGE } from '../../../global/app';
import { LDC_ATTRIBUTE_CODE } from '../../../global/entity_type';
import { ProfileTab } from '../../../global/profile_tab';
import { ScheduleType } from '../../../global/schedule_type';
import { useEmptyForm } from '../../../hooks/useEmptyForm';
import ChangeState from '../components/change_state';
import InfoTab from '../components/info_tab';
import LeadStatus from '../components/lead_status';
import ProductTab from '../components/product_tab';
import { styles } from './styles';
import themeContext from '../../../constants/theme/themeContext';
import { emitEvent } from '../../../utils/eventEmit';
import { SDK_EVENT_NAME } from '../../../global/app';
import { LEAD_STATUS } from '../../../global/lead_status';
import { UPDATE_LEAD_SUCCESSFULLY } from '../../../constants/success';

const tabScreen = {
  INFO: 0,
  SCHEDULE: 1,
  PRODUCT: 2
};

const finishedLead = [
  LEAD_STATUS.CANNOTCONTACT,
  LEAD_STATUS.COMPLETED,
  LEAD_STATUS.CONVERTED,
  LEAD_STATUS.NOTQUALIFIED
];

const LoanDetail = props => {
  const item = props.route?.params?.item;
  const lead = useSelector(state => state.lead.lead);
  const [name, setName] = useState(item?.name);
  const [phone, setPhone] = useState(item?.phone);
  const [email, setEmail] = useState(item?.email);
  const [leadState, setLeadState] = useState(null);
  const { memberId, topenId } = useSelector(state => state.auth);
  const theme = useContext(themeContext);
  useEffect(() => {
    const cloneLead = cloneDeep(lead);
    setLeadState(cloneLead);
  }, [lead]);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  /* Handle schedule list */
  const scheduleList = useSelector(scheduleListInLeadSelector);
  const schedulePage = useSelector(scheduleListInLeadPageSelector);
  const scheduleLoading = useSelector(scheduleListInLeadLoadingSelector);
  const [isScheduleRefreshing, setScheduleRefreshing] = React.useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const onFetchSchedule = useCallback(() => {
    dispatch(getListInLeadScheduleClear());
    dispatch(
      getListInLeadScheduleHandle({
        type: ScheduleType.LEAD,
        referenceId: item?.id
      })
    );
  }, [dispatch, item]);

  const loadScheduleMore = useCallback(() => {
    if (scheduleLoading === null) {
      return;
    }
    const skipCount = schedulePage * LIMIT_PAGE;
    dispatch(
      getListInLeadScheduleHandle({
        type: ScheduleType.LEAD,
        referenceId: item?.id,
        SkipCount: skipCount
      })
    );
  }, [dispatch, scheduleLoading, schedulePage, item]);

  const onRefreshSchedule = useCallback(() => {
    setScheduleRefreshing(true);
    onFetchSchedule();
  }, [onFetchSchedule]);

  useEffect(() => {
    onFetchSchedule();
  }, [onFetchSchedule]);

  useEffect(() => {
    if (lead?.listComponent?.length > 0) {
      lead?.listComponent?.map(group => {
        group?.eavAttribute?.map(att => {
          if (att?.attributeCode?.toLowerCase() === LDC_ATTRIBUTE_CODE.Name) {
            setName(att.value);
          }
          if (att?.attributeCode?.toLowerCase() === LDC_ATTRIBUTE_CODE.Phone) {
            setPhone(att.value);
          }
          if (att?.attributeCode?.toLowerCase() === LDC_ATTRIBUTE_CODE.Email) {
            setEmail(att.value);
          }
        });
      });
    }
  }, [lead]);

  useEffect(() => {
    if (schedulePage === 0 && isScheduleRefreshing) {
      setScheduleRefreshing(false);
    }
  }, [schedulePage, isScheduleRefreshing]);

  useEffect(() => {
    return () => dispatch(getListInLeadScheduleClear());
  }, [dispatch]);
  /* Handle schedule list */

  useEffect(() => {
    dispatch(getLeadDetailHandle({ params: { entityId: item?.id } }));
    const focusListener = navigation.addListener('focus', () => {
      dispatch(getLeadDetailHandle({ params: { entityId: item?.id } }));
    });
    return () => {
      focusListener();
      dispatch(getLeadDetailClear());
    };
  }, [item?.id, dispatch, navigation]);

  const [tabIndex, setTabIndex] = useState(0);

  const onPressSchedule = useCallback(
    (schedule, event) => {
      handleTouchItem(event, 'ScheduleItem', props.route, schedule, topenId);
      navigation.navigate(SCREENS_NAME.SCHEDULE_DETAIL, {
        item: schedule,
        callback: onFetchSchedule,
        from: SCREENS_NAME.LEAD_DETAIL_SCREEN,
        reference: item,
        scheduleType: ScheduleType.LEAD
      });
    },
    [props.route, topenId, navigation, onFetchSchedule, item]
  );

  const onPressCreateSchedule = useCallback(() => {
    navigation.navigate(SCREENS_NAME.CREATE_SCHEDULE_SCREEN, {
      callback: onRefreshSchedule,
      from: SCREENS_NAME.LEAD_DETAIL_SCREEN,
      reference: item,
      scheduleType: ScheduleType.LEAD
    });
  }, [onRefreshSchedule, navigation, item]);

  const deleteLead = useCallback(() => {
    dispatch(deleteLeadHandle({ ids: [item?.id] }));
  }, [dispatch, item?.id]);

  const onDelete = useCallback(() => {
    dispatch(getShowAlertError({ ...CONFIRM_DELETE_LEAD, confirmAction: deleteLead }));
  }, [deleteLead, dispatch]);

  useLayoutEffect(() => {
    navigation.setOptions({
      RightComponent: () => (
        <TouchableOpacity style={styles.rightHeader} onPress={onDelete}>
          <SubHead translate color={theme?.app?.primaryColor1}>
            {'common.delete'}
          </SubHead>
        </TouchableOpacity>
      )
    });
  }, [dispatch, navigation, onDelete]);

  const deleteLeadResult = useSelector(state => state.lead.deleteLeadResult);

  useEffect(() => {
    if (deleteLeadResult?.success) {
      emitEvent({ event_name: SDK_EVENT_NAME.LEAD_DELETE, data: { id: item?.id } });
      navigation.goBack();
      dispatch(
        getShowAlertError({
          ...DELETE_LEAD_SUCCESS
        })
      );
    } else if (deleteLeadResult?.error) {
      dispatch(getShowAlertError(DELETE_LEAD_ERROR));
    }
    dispatch(deleteLeadClear());
  }, [dispatch, deleteLeadResult, navigation]);

  const onPressCreateSupport = useCallback(() => {
    navigation.navigate(SCREENS_NAME.CREATE_SUPPORT_SCREEN);
  }, [navigation]);

  const onCreateSchedule = useCallback(() => {
    navigation.navigate(SCREENS_NAME.CREATE_SCHEDULE_SCREEN, {
      reference: item,
      scheduleType: ScheduleType.LEAD,
      from: SCREENS_NAME.LEAD_DETAIL_SCREEN
    });
  }, [navigation, item]);

  const onCall = useCallback(() => {
    ActionUtils.onCall({ phone });
  }, [phone]);

  const onMail = useCallback(() => {
    ActionUtils.onEmail({
      email,
      onError: () => {
        dispatch(getShowAlertError(REQUEST_UDPATE_EMAIL));
      }
    });
  }, [email, dispatch]);

  const onChangeLeadDetail = useCallback(listComponent => {
    setLeadState(pre => {
      return { ...pre, listComponent };
    });
  }, []);

  const isFillAll = useEmptyForm(leadState?.listComponent);

  const onPressSaveLeadDetail = useCallback(() => {
    const leadObj = {
      ...leadState,
      memberId
    };
    dispatch(
      createOrEditLeadHandle({
        params: leadObj,
        callback: (_err, _res) => {
          if (!_err) {
            dispatch(
              getLeadDetailHandle({
                params: { entityId: item?.id },
                callback: (err, res) => {
                  if (!err && res) {
                    const cloneLead = cloneDeep(res);
                    setLeadState(cloneLead);
                    setIsEdit(false);
                    emitEvent({
                      event_name: SDK_EVENT_NAME.LEAD_UPDATE,
                      data: cloneLead
                    });
                    dispatch(getShowAlertError(UPDATE_LEAD_SUCCESSFULLY));
                  } else {
                    dispatch(getShowAlertError(CANNOT_UPDATE_LEAD));
                    const cloneLead = cloneDeep(lead);
                    setLeadState(cloneLead);
                    setIsEdit(false);
                  }
                }
              })
            );
          }
        }
      })
    );
  }, [dispatch, item, lead, leadState, memberId]);

  const onPressCancel = () => {
    const cloneLead = cloneDeep(lead);
    setLeadState(cloneLead);
    setIsEdit(false);
  };

  const onChangeState = () => {
    ChangeState({
      title: lead?.status,
      message: '',
      callBackWhenClose: () => {},
      confirmFunction: value => {
        const leadStatusObj = {
          id: item?.id,
          status:
            value === 3
              ? 'inprogress'
              : value === 4
              ? 'onhold'
              : value === 5
              ? 'cannotcontact'
              : value === 6
              ? 'notqualified'
              : null
        };
        dispatch(
          updateStatusLeadHandle({
            params: leadStatusObj,
            callback: (_err, _res) => {
              if (!_err) {
                dispatch(
                  getLeadDetailHandle({
                    params: { entityId: item?.id },
                    callback: (err, res) => {
                      if (!err && res) {
                        emitEvent({
                          event_name: SDK_EVENT_NAME.LEAD_UPDATE,
                          data: res
                        });
                      }
                    }
                  })
                );
              }
            }
          })
        );
      }
    });
  };

  return (
    <View forceInset={{ bottom: 'never' }} style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.topHeader}>
          <Heading style={styles.heading}>{name}</Heading>
          <LeadStatus status={lead?.status} />
        </View>
        <Divider />
        <View style={styles.bottomHeader}>
          <SubHead translate>{'lead_detail.contact_to_customer'}</SubHead>

          <View style={styles.iconArea}>
            <TouchableOpacity onPress={onCreateSchedule}>
              <ICCalendarBlank color1={theme?.icon?.color1} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onCall}>
              <ICPhoneCall color1={theme?.icon?.color1} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onMail}>
              <ICEnvelop color1={theme?.icon?.color1} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.groupCallSupport}>
        <TouchableOpacity onPress={onPressCreateSupport}>
          <SubHead translate semiBold style={styles.request} color={theme?.app?.primaryColor1}>
            {'loan_calc.request_support'}
          </SubHead>
        </TouchableOpacity>
      </View>

      <CommonTabHeader
        translate
        containerStyle={styles.row}
        tabs={ProfileTab}
        tabIndex={tabIndex}
        onPress={id => {
          setTabIndex(id);
        }}
      />

      {tabIndex === tabScreen.INFO ? (
        <InfoTab onChangeValue={onChangeLeadDetail} isEdit={isEdit} item={leadState} />
      ) : null}
      {tabIndex === tabScreen.SCHEDULE ? (
        <ScheduleList
          data={scheduleList}
          onPressItem={onPressSchedule}
          loading={scheduleLoading}
          loadMore={loadScheduleMore}
          onRefresh={onRefreshSchedule}
          isRefreshing={isScheduleRefreshing}
        />
      ) : null}

      {tabIndex === tabScreen.PRODUCT ? <ProductTab /> : null}

      <FloatFooter style={styles.floatFooterStyle}>
        {tabIndex === tabScreen.INFO ? (
          isEdit ? (
            <View style={styles.rowBtnView}>
              <SecondaryButton
                style={styles.cancelBtn}
                translate
                title="common.cancel"
                onPress={onPressCancel}
              />
              <PrimaryButton
                style={{ flex: 1 }}
                translate
                title="common.save"
                onPress={onPressSaveLeadDetail}
                disabled={!isFillAll}
              />
            </View>
          ) : (
            <View style={styles.rowBtnView}>
              {finishedLead.includes(lead?.status) ? (
                <SecondaryButton translate title="common.update" onPress={() => setIsEdit(true)} />
              ) : (
                <>
                  <SecondaryButton
                    style={styles.cancelBtn}
                    translate
                    title="common.update"
                    onPress={() => setIsEdit(true)}
                  />
                  <PrimaryButton
                    style={{ flex: 1 }}
                    translate
                    title="lead_status.change_state"
                    onPress={onChangeState}
                  />
                </>
              )}
            </View>
          )
        ) : null}
        {tabIndex === tabScreen.SCHEDULE ? (
          <PrimaryButton translate title="schedule.btn_create" onPress={onPressCreateSchedule} />
        ) : null}

        {tabIndex === tabScreen.PRODUCT && lead?.status !== LEAD_STATUS.CONVERTED ? (
          <PrimaryButton
            translate
            title={'application.create'}
            onPress={() =>
              navigation.navigate(SCREENS_NAME.SELECT_PRODUCT_TYPE_SCREEN, {
                leadId: item.id
              })
            }
          />
        ) : null}
      </FloatFooter>
    </View>
  );
};

export default WithLoading(LoanDetail, [
  LEAD.UPDATE_STATUS_LEAD.HANDLER,
  LEAD.GET_LEAD_DETAIL.HANDLER
]);
