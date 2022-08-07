import {
  clearInsuranceOrderResult,
  editInsuranceOrderHandle,
  getInsuranceOrderForEditFormClear,
  getInsuranceOrderFormForEditHandle
} from '../../../redux/actions/insurance';

import { clearUpdateOrderStatus, updateOrderStatusHandle } from '../../../redux/actions/order';
import { getShowAlertError } from '../../../redux/actions/system';
import { INSURANCE, ORDER } from '../../../redux/actionsType';
import { ICAlertCircle } from '../../../assets/icons';
import {
  CommonTabHeader,
  Heading,
  PrimaryButton,
  SecondaryButton,
  WithLoading
} from '../../../components/';
import AppText from '../../../components/app_text';
import Divider from '../../../components/divider';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import {
  CANCEL_INSURANCE,
  CANCEL_SUCCESS,
  CONFIRM_SEND,
  ERROR_PROCESS,
  SEND_SUCCESS
} from '../../../constants/errors';
import SCREENS_NAME from '../../../constants/screens';
import { BORDER_RADIUS, SPACING } from '../../../constants/size';
import { Shadow } from '../../../constants/stylesCSS';
import React, { useCallback, useEffect, useState, useContext, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { INSURANCE_ORDER_STATUS } from '../../../global/order_status';
import { useEmptyForm } from '../../../hooks/useEmptyForm';
import createConsiderRequest from './components/consider_request_modal';
import Quote from './tab_detail/feedback_tab';
import InfoTab from './tab_detail/info_tab';
import OrderStatus from './tab_detail/order_status';
import { isIphoneX } from '../../../helpers/device';
import themeContext from '../../../constants/theme/themeContext';
import { emitEvent } from '../../../utils/eventEmit';
import { SDK_EVENT_NAME } from '../../../global/app';
import { cloneDeep } from 'lodash';
import { ICSupportRequire } from '../../../assets/icons';
import {
  hardAAACodesOptionMe,
  hardAttributeAAARelate,
  groupHaveDiffJob,
  attributesAAACareerCode,
  valuesAAADiffJobCode,
  attributesAAACareerDescCode,
  groupsCopyCode,
  attributeCopyCode
} from '../../../screens/insurance/create_or_edit/constants';
import {
  findAttributeFromGroup,
  findGroupFormByAttributeCode,
  findIndexAttributeFromGroup,
  findOptionDataFromAttribute
} from '../../../screens/insurance/create_or_edit/helpers';

const statusCanEditRecord = ['Draft', 'WaitingForUpdate'];
const tabScreen = {
  INFO: 0,
  QUOTES: 1
};

const APPLICATION_PRODUCT_TAB = [
  { id: 0, title: 'insurance_record_details.information' },
  { id: 1, title: 'insurance_record_details.feedback' }
];

const InsuranceOrderDetailScreen = props => {
  const theme = useContext(themeContext);
  const { navigation } = props;
  const dispatch = useDispatch();
  const item = props.route.params?.item;
  const withBackScreen = props.route.params?.withBackScreen;
  const itemDetail = useSelector(state => state.insurance.insuranceOrderFormEdit);
  const depositMethod = useSelector(state => state.insurance.depositMethod);
  const memberId = useSelector(state => state.auth.memberId);
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState();
  const [countInTab, setCountInTab] = useState([null, null]);
  const [typePayment, setTypePayment] = useState(0);
  const [data, setData] = useState([]);

  const [toggleCopy, setToggleCopy] = useState(null);
  const [AAAErrMsg, setAAAErrMsg] = useState(null);
  const { lang } = useSelector(state => state.setting);
  const [parentFieldGroupIdCopy, setParentFieldGroupIdCopy] = useState(null);

  const itemDetailProcessed = useMemo(() => {
    let cloneData = cloneDeep(itemDetail);
    cloneData?.productForm?.listComponent?.forEach((com, index) => {
      if (groupHaveDiffJob.includes(com.code)) {
        let isDiffJob = false;
        com?.listAttribute.forEach((attr, idx) => {
          if (attributesAAACareerCode.includes(attr.attributeCode)) {
            attr?.optionData?.forEach((opt, i) => {
              if (opt?.value?.toString() === attr?.value?.toString()) {
                if (valuesAAADiffJobCode.includes(opt?.code)) {
                  isDiffJob = true;
                }
              }
            });
          }
        });
        if (!isDiffJob) {
          if (statusCanEditRecord.includes(cloneData.status)) {
            com?.listAttribute.forEach((attr, idx) => {
              if (attributesAAACareerDescCode.includes(attr.attributeCode)) {
                cloneData.productForm.listComponent[index].listAttribute[idx].hidden = true;
                cloneData.productForm.listComponent[index].listAttribute[idx].isRequired = false;
              }
            });
          } else {
            com?.listAttribute.forEach((attr, idx) => {
              if (attributesAAACareerDescCode.includes(attr.attributeCode)) {
                cloneData?.productForm?.listComponent[index].listAttribute.splice(idx, 1);
              }
            });
          }
        }
      }

      if (groupsCopyCode.includes(com.code) && !statusCanEditRecord.includes(cloneData.status)) {
        com?.listAttribute.forEach((attr, idx) => {
          if (attributeCopyCode.includes(attr.attributeCode)) {
            cloneData?.productForm?.listComponent[index].listAttribute.splice(idx, 1);
          }
        });
      }
      if (com.listAttributeForm) {
        com.listAttributeForm.forEach((v, i) => {
          cloneData?.productForm?.listComponent?.splice(index + 1, 0, {
            ...com,
            listAttribute: v.attributeForm,
            listAttributeForm: null,
            groupId: new Date().getTime() + i,
            isListInputForm: false
          });
        });
        cloneData.productForm.listComponent[index].isListInputForm = false;
        if (!parentFieldGroupIdCopy) {
          setParentFieldGroupIdCopy(com.groupId);
        }
        const listAttributeForm = cloneData?.productForm?.listComponent?.[index]?.listAttributeForm;
        cloneData.productForm.listComponent[
          index + listAttributeForm?.length || 0
        ].isListInputForm = true;
        listAttributeForm?.forEach((attr, idx) => {
          cloneData.productForm.listComponent[index + idx + 1].addedByField =
            cloneData.productForm.listComponent[index + idx].groupId;
        });
      }
    });

    return cloneData;
  }, [itemDetail]);

  useEffect(() => {
    if (itemDetailProcessed) {
      setFormData(itemDetailProcessed);
    }
  }, [itemDetailProcessed]);

  useEffect(() => {
    try {
      if (depositMethod !== '[]') {
        setData(JSON.parse(depositMethod));
      } else {
        setData([]);
      }
    } catch (error) {}
  }, [depositMethod]);

  useEffect(() => {
    if (data.length > 0) {
      data.forEach(el => {
        if (el.Code === 'PaymentAccount') {
          setTypePayment(0);
        } else {
          setTypePayment(1);
        }
      });
    }
  }, [data]);

  const onUpdateOrder = useCallback(() => {
    dispatch(
      editInsuranceOrderHandle({
        ...{
          ...formData,
          productForm: {
            ...formData.productForm,
            listComponent: formData.productForm.listComponent.filter(i => !i.addedByField)
          }
        },
        status:
          formData.status === INSURANCE_ORDER_STATUS.Draft
            ? INSURANCE_ORDER_STATUS.WaitingForPayment
            : INSURANCE_ORDER_STATUS.PartnerProcessing
      })
    );
  }, [dispatch, formData]);

  const onSend = useCallback(() => {
    dispatch(getShowAlertError({ ...CONFIRM_SEND, confirmAction: onUpdateOrder }));
  }, [dispatch, onUpdateOrder]);

  const onSelectMoneyAccount = useCallback(() => {
    if (data.length < 2) {
      if (typePayment === 0) {
        const statusObj = {
          id: item?.id || item?.orderId,
          status: 'WaitingForApproveCancelOrder',
          DepositMethod: 'Paymented'
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
      }
      if (typePayment === 1) {
        navigation.navigate(SCREENS_NAME.INFO_ACCOUNT_REFUND, {
          item: itemDetail
        });
      }
    } else {
      createConsiderRequest({
        title: '',
        message: '',
        callBackWhenClose: () => {},
        paymentAccount: () => {
          const statusObj = {
            id: item?.id || item?.orderId,
            status: 'WaitingForApproveCancelOrder',
            DepositMethod: 'Paymented'
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
        },
        affiliateAccount: () => {
          navigation.navigate(SCREENS_NAME.INFO_ACCOUNT_REFUND, {
            item: itemDetail
          });
        }
      });
    }
  }, [data.length, dispatch, item?.id, item?.orderId, itemDetail, navigation, typePayment]);

  const cancelOrderStatus = useCallback(() => {
    const statusObj = { id: item?.id || item?.orderId, status: INSURANCE_ORDER_STATUS.Canceled };
    dispatch(updateOrderStatusHandle({ params: statusObj }));
  }, [dispatch, item]);

  const onCancel = useCallback(() => {
    dispatch(
      getShowAlertError({
        ...CANCEL_INSURANCE,
        confirmAction: cancelOrderStatus
      })
    );
  }, [cancelOrderStatus, dispatch]);

  const onPayment = useCallback(() => {
    navigation.navigate(SCREENS_NAME.POLICY_APPLICATION_INSURANCE_SCREEN, {
      itemDetail: itemDetail,
      flowCode: 'InsurancePayment'
    });
  }, [navigation, itemDetail]);

  useEffect(() => {
    dispatch(getInsuranceOrderFormForEditHandle({ orderId: item?.id || item?.orderId, memberId }));
    const focusListener = navigation.addListener('focus', () => {
      dispatch(
        getInsuranceOrderFormForEditHandle({ orderId: item?.id || item?.orderId, memberId })
      );
    });
    return () => {
      focusListener();
      dispatch(getInsuranceOrderForEditFormClear());
    };
  }, [dispatch, item?.id, item?.orderId, navigation]);

  const isFillContact = useEmptyForm(formData?.contact?.listComponent);
  const isFillProduct = useEmptyForm(formData?.productForm?.listComponent);

  const onViewReturnPolicy = useCallback(() => {
    navigation.navigate(SCREENS_NAME.RETURN_POLICY_APPLICATION_INSURANCE_SCREEN);
  }, [navigation]);

  useEffect(() => {
    let RightButton = () => null;
    let canSend = isFillContact && isFillProduct;
    if (
      [INSURANCE_ORDER_STATUS.Draft, INSURANCE_ORDER_STATUS.WaitingForUpdate].includes(
        itemDetail?.status
      )
    ) {
      RightButton = () => (
        <TouchableOpacity
          onPress={onSend}
          disabled={!canSend}
          style={{ marginRight: SPACING.Medium }}>
          <AppText
            translate
            semiBold
            style={[
              styles.status,
              !canSend ? { color: TEXT_COLOR.ShuttleGray } : { color: theme.app.primaryColor1 }
            ]}>
            {'insurance_record_details.send_records'}
          </AppText>
        </TouchableOpacity>
      );
    }
    if (
      [
        INSURANCE_ORDER_STATUS.PartnerProcessing,
        INSURANCE_ORDER_STATUS.WaitingForPartnerAcceptance,
        INSURANCE_ORDER_STATUS.WaitingForConsider,
        INSURANCE_ORDER_STATUS.WaitingForApproveCancelOrder,
        INSURANCE_ORDER_STATUS.WaitingForApproveStopOrder,
        INSURANCE_ORDER_STATUS.LiquidationAgreement,
        INSURANCE_ORDER_STATUS.Completed
      ].includes(itemDetail?.status)
    ) {
      RightButton = () => (
        <TouchableOpacity onPress={onViewReturnPolicy}>
          <ICAlertCircle color1={theme?.icon?.color1} />
        </TouchableOpacity>
      );
    }
    navigation.setOptions({
      RightComponent: () => <RightButton />,
      backAction: () => {
        navigation.navigate(SCREENS_NAME.APPLICATION_LIST_SCREEN, { tab: 1 });
      }
    });
  }, [navigation, itemDetail, onSend, isFillContact, isFillProduct, onViewReturnPolicy]);

  const actionButton = useCallback(() => {
    let button = null;
    if (
      [
        INSURANCE_ORDER_STATUS.Draft,
        INSURANCE_ORDER_STATUS.WaitingForUpdate,
        INSURANCE_ORDER_STATUS.WaitingForConsider
      ].includes(itemDetail?.status)
    ) {
      button =
        itemDetail?.status === INSURANCE_ORDER_STATUS.WaitingForConsider ? (
          <></>
        ) : (
          <PrimaryButton
            translate
            title={`${'insurance_record_details.destroy_records'}`}
            onPress={onCancel}
          />
        );
    } else if ([INSURANCE_ORDER_STATUS.WaitingForPayment].includes(itemDetail?.status)) {
      button = (
        <>
          <SecondaryButton
            translate
            title={'insurance_record_details.destroy_records'}
            onPress={onCancel}
            style={{ flex: 1, marginRight: SPACING.Medium }}
          />
          <PrimaryButton
            translate
            title={'common.payment'}
            onPress={onPayment}
            style={{ flex: 1 }}
          />
        </>
      );
    }
    return button ? <View style={styles.actionContainer}>{button}</View> : null;
  }, [itemDetail?.status, onCancel, onSelectMoneyAccount, onPayment]);

  const onUpdateInfo = (dataUpdate, groupId, attributeId) => {
    const cloneData = cloneDeep(dataUpdate);
    // disable copy value (this is feature disable copy when change input of copied form group)
    const changeGroup = cloneData?.productForm?.listComponent?.find(i => i.groupId === groupId);
    const changeAttribute = changeGroup?.listAttribute?.find(i => i.attributeId === attributeId);

    changeGroup?.listAttribute?.forEach((att, idx) => {
      if (attributeCopyCode.includes(att.attributeCode)) {
        const mapping = att.copyValue.mapping;
        const idsCopied = [];
        for (const k in mapping) {
          idsCopied.push(mapping[k].To);
        }
        if (idsCopied.includes(attributeId)) {
          toggleCopyProcessed?.forEach((i, index) => {
            if (i?.groupId === groupId) {
              if (changeAttribute?.value) {
                setToggleCopy(prev => {
                  if (prev[groupId].isActive) {
                    return {
                      ...prev,
                      [groupId]: { ...prev[groupId], isActive: false }
                    };
                  } else {
                    return prev;
                  }
                });
              }
            }
          });
        }
      }
    });

    let AAAFamilyInsuranceStatus1;
    let AAAFamilyInsuranceStatus2;
    let AAAPersonalInsuranceStatus;
    //AAA - Bảo hiểm gia đình career 1
    const AAAFamilyInsuranceCareer1 = findGroupFormByAttributeCode(
      cloneData?.productForm?.listComponent,
      'AAA_Family_InsurerCareer1'
    );

    if (AAAFamilyInsuranceCareer1) {
      const index = findIndexAttributeFromGroup(
        cloneData?.productForm?.listComponent,
        'AAA_Family_InsurerCareer1'
      );

      AAAFamilyInsuranceStatus1 = findAttributeFromGroup(
        AAAFamilyInsuranceCareer1,
        'AAA_Family_InsurerCareer1'
      );
      const selectedAlias = findOptionDataFromAttribute(AAAFamilyInsuranceStatus1);
      // let listComponentInstance = [...cloneData?.productForm?.listComponent];
      const indexAAASlot1 = findIndexAttributeFromGroup(
        AAAFamilyInsuranceCareer1,
        'AAA_Family_InsurerCareerDesc1'
      );

      const listAttributeInstance = [...AAAFamilyInsuranceCareer1?.listAttribute];
      if (indexAAASlot1 !== -1) {
        if (selectedAlias?.code === '0016') {
          listAttributeInstance[indexAAASlot1].isRequired = true;
          listAttributeInstance[indexAAASlot1].hidden = false;
          cloneData.productForm.listComponent[index] = {
            ...cloneData.productForm.listComponent[index],
            listAttribute: [...listAttributeInstance]
          };
        } else {
          listAttributeInstance[indexAAASlot1].isRequired = false;
          listAttributeInstance[indexAAASlot1].hidden = true;
          cloneData.productForm.listComponent[index] = {
            ...cloneData.productForm.listComponent[index],
            listAttribute: [...listAttributeInstance]
          };
        }
      }
    }
    //AAA - Bảo hiểm gia đình career 2
    const AAAFamilyInsuranceCareer2 = findGroupFormByAttributeCode(
      cloneData?.productForm?.listComponent,
      'AAA_Family_InsurerCareer2'
    );

    if (AAAFamilyInsuranceCareer2) {
      const index = findIndexAttributeFromGroup(
        cloneData?.productForm?.listComponent,
        'AAA_Family_InsurerCareer2'
      );
      AAAFamilyInsuranceStatus2 = findAttributeFromGroup(
        AAAFamilyInsuranceCareer2,
        'AAA_Family_InsurerCareer2'
      );
      const selectedAlias = findOptionDataFromAttribute(AAAFamilyInsuranceStatus2);

      // let listComponentInstance = [...cloneData?.productForm?.listComponent];
      const indexAAASlot2 = findIndexAttributeFromGroup(
        AAAFamilyInsuranceCareer2,
        'AAA_Family_InsurerCareerDesc2'
      );

      const listAttributeInstance = [...AAAFamilyInsuranceCareer2?.listAttribute];
      if (indexAAASlot2 !== -1) {
        if (selectedAlias?.code === '0016') {
          listAttributeInstance[indexAAASlot2].isRequired = true;
          listAttributeInstance[indexAAASlot2].hidden = false;
          cloneData.productForm.listComponent[index] = {
            ...cloneData.productForm.listComponent[index],
            listAttribute: [...listAttributeInstance]
          };
        } else {
          listAttributeInstance[indexAAASlot2].isRequired = false;
          listAttributeInstance[indexAAASlot2].hidden = true;
          cloneData.productForm.listComponent[index] = {
            ...cloneData.productForm.listComponent[index],
            listAttribute: [...listAttributeInstance]
          };
        }
      }
    }

    //AAA - Bảo hiểm AAA cá nhân
    const AAAPersonalInsuranceCareer = findGroupFormByAttributeCode(
      cloneData?.productForm?.listComponent,
      'AAA_Individual_InsurerCareer'
    );
    if (AAAPersonalInsuranceCareer) {
      AAAPersonalInsuranceStatus = findAttributeFromGroup(
        AAAPersonalInsuranceCareer,
        'AAA_Individual_InsurerCareer'
      );
      const index = findIndexAttributeFromGroup(
        AAAPersonalInsuranceCareer,
        'AAA_Individual_InsurerCareer'
      );
      const selectedAlias = findOptionDataFromAttribute(AAAPersonalInsuranceStatus);
      // let listComponentInstance = [...cloneData?.productForm?.listComponent];
      const indexAAA = findIndexAttributeFromGroup(
        AAAPersonalInsuranceCareer,
        'AAA_Individual_InsurerCareerDesc'
      );

      const listAttributeInstance = [...AAAPersonalInsuranceCareer?.listAttribute];
      if (indexAAA !== -1) {
        if (selectedAlias?.code === '0016') {
          listAttributeInstance[indexAAA].isRequired = true;
          listAttributeInstance[indexAAA].hidden = false;
          cloneData.productForm.listComponent[index] = {
            ...cloneData.productForm.listComponent[index],
            listAttribute: [...listAttributeInstance]
          };
        } else {
          listAttributeInstance[indexAAA].isRequired = false;
          listAttributeInstance[indexAAA].hidden = true;
          cloneData.productForm.listComponent[index] = {
            ...cloneData.productForm.listComponent[index],
            listAttribute: [...listAttributeInstance]
          };
        }
      }
    }

    // AAA check high risk job
    const checkedFamilyField2 = AAAFamilyInsuranceStatus2?.optionData?.find(
      i => i?.value?.toString() === AAAFamilyInsuranceStatus2?.value?.toString()
    );
    const checkedFamilyField1 = AAAFamilyInsuranceStatus1?.optionData?.find(
      i => i?.value?.toString() === AAAFamilyInsuranceStatus1?.value?.toString()
    );
    const checkPersonal = AAAPersonalInsuranceStatus?.optionData?.find(
      i => i?.value?.toString() === AAAPersonalInsuranceStatus?.value?.toString()
    );
    if (
      checkedFamilyField1?.messageVi ||
      checkedFamilyField1?.messageEn ||
      checkedFamilyField2?.messageVi ||
      checkedFamilyField2?.messageEn ||
      checkPersonal?.messageVi ||
      checkPersonal?.messageEn
    ) {
      if (!AAAErrMsg) {
        if (lang === 'vi') {
          const errMsg =
            checkedFamilyField1?.messageVi ||
            checkedFamilyField2?.messageVi ||
            checkPersonal?.messageVi;
          setAAAErrMsg(prev => {
            if (prev !== errMsg) {
              return errMsg;
            }
            return prev;
          });
        } else if (lang === 'en') {
          const errMsg =
            checkedFamilyField1?.messageEn ||
            checkedFamilyField2?.messageEn ||
            checkPersonal?.messageEn;
          setAAAErrMsg(prev => {
            if (prev !== errMsg) {
              return errMsg;
            }
            return prev;
          });
        }
      }
    } else if (AAAErrMsg) {
      setAAAErrMsg(null);
    }

    // add more group
    const parentField = cloneData?.productForm?.listComponent?.find(
      i => i.groupId === parentFieldGroupIdCopy
    );
    const addMoreFields = cloneData?.productForm?.listComponent?.filter(i => i.addedByField && i);
    const addedMoreData = addMoreFields?.map(i => {
      return {
        attributeForm: i.listAttribute,
        groupId: i.groupId
      };
    });
    let dataProcessed = cloneData?.productForm?.listComponent?.map(i => {
      if (i?.groupId === parentField?.groupId) {
        return {
          ...i,
          listAttributeForm: addedMoreData
        };
      } else {
        return i;
      }
    });

    setFormData({
      ...cloneData,
      productForm: { ...cloneData.productForm, listComponent: dataProcessed }
    });
  };

  // show pop up hight risk job AAA
  useEffect(() => {
    if (AAAErrMsg) {
      const CONFIRM_INSURANCE_CAREER = {
        id: 1,
        image: <ICSupportRequire />,
        title: 'warning_msg.notification',
        message: AAAErrMsg,
        type: 'complete'
      };
      dispatch(
        getShowAlertError({
          ...CONFIRM_INSURANCE_CAREER
        })
      );
    }
  }, [AAAErrMsg]);

  // Update order status
  const { updateOrderResult } = useSelector(state => state.order);
  useEffect(() => {
    if (
      updateOrderResult?.isSuccess &&
      itemDetail?.status !== INSURANCE_ORDER_STATUS.WaitingForConsider &&
      itemDetail?.status !== INSURANCE_ORDER_STATUS.Completed
    ) {
      dispatch(getShowAlertError(CANCEL_SUCCESS));
      dispatch(getInsuranceOrderFormForEditHandle({ orderId: item.id, memberId }));
      emitEvent({ event_name: SDK_EVENT_NAME.INSURRANCE_APPLICATION_UPDATE, data: itemDetail });
      dispatch(clearUpdateOrderStatus());
    } else if (updateOrderResult?.isError) {
      dispatch(getShowAlertError(ERROR_PROCESS));
      dispatch(clearUpdateOrderStatus());
    }
  }, [
    dispatch,
    item.id,
    itemDetail?.status,
    updateOrderResult?.isError,
    updateOrderResult?.isSuccess
  ]);

  // Send order result
  const sendOrderResult = useSelector(state => state.insurance.insuranceCreateOrEditOrderResult);
  useEffect(() => {
    if (sendOrderResult?.isSuccess) {
      dispatch(getShowAlertError(SEND_SUCCESS));
      dispatch(getInsuranceOrderFormForEditHandle({ orderId: item.id, memberId }));
      dispatch(clearInsuranceOrderResult());
    } else if (sendOrderResult?.isError) {
      dispatch(getShowAlertError(ERROR_PROCESS));
      dispatch(clearInsuranceOrderResult());
    }
  }, [dispatch, sendOrderResult, item.id]);

  const stylePrimaryText = {
    color: theme.text.primary,
    fontFamily: theme?.fonts?.SEMIBOLD
  };

  const handleToggleCopy = useCallback((groupId, parentId) => {
    if (!groupId) {
      return;
    }
    setToggleCopy(prev => {
      if (prev) {
        const tmp = cloneDeep(prev);
        for (const k in prev) {
          if (k && k.toString() === groupId.toString()) {
            tmp[k] = { groupId, isActive: !prev[k].isActive, parentId };
          } else if (prev?.[groupId]?.isActive) {
            tmp[groupId] = { groupId, isActive: false, parentId };
          } else {
            tmp[groupId] = { groupId, isActive: true, parentId };
          }
        }
        return tmp;
      }
      return {
        [groupId]: {
          groupId,
          isActive: true,
          parentId
        }
      };
    });
  }, []);

  const onCopy = useCallback(
    rootItem => {
      let values = [];
      formData?.contact?.listComponent?.forEach((i, index) => {
        if (i.groupId === rootItem.copyValue.GroupId) {
          rootItem?.copyValue?.mapping?.forEach(id => {
            i?.eavAttribute.forEach(v => {
              if (id.From === v.attributeId) {
                values.push({ ...v, copyTo: id.To });
              }
            });
          });
        }
      });
      const newProductForm = cloneDeep(formData.productForm);
      const stateCopy = toggleCopyProcessed?.find(
        i => i.groupId === rootItem.copyValue.InputFormGroupId
      );
      formData?.productForm?.listComponent?.forEach((i, index) => {
        if (i.groupId === rootItem.copyValue.InputFormGroupId) {
          const listAttribute = newProductForm?.listComponent?.[index]?.listAttribute;
          values?.forEach(value => {
            listAttribute?.forEach((attr, idx) => {
              if (value.copyTo === attr.attributeId) {
                listAttribute.splice(
                  idx,
                  1,
                  !stateCopy?.isActive ? { ...attr, value: value.value } : { ...attr, value: '' }
                );
              }
            });
          });
        }
      });
      handleToggleCopy(rootItem.copyValue.InputFormGroupId, rootItem.copyValue.GroupId);
      setFormData({
        ...formData,
        productForm: {
          ...formData.productForm,
          listComponent: newProductForm?.listComponent
        }
      });
    },
    [formData, handleToggleCopy, toggleCopyProcessed]
  );

  const toggleCopyProcessed = useMemo(() => {
    const result = [];
    if (toggleCopy) {
      for (const k in toggleCopy) {
        result.push(toggleCopy[k]);
      }
    }
    return result;
  }, [toggleCopy]);

  useEffect(() => {
    if (toggleCopyProcessed?.length > 0) {
      const cloneData = cloneDeep(formData?.productForm || []);
      toggleCopyProcessed?.forEach(i => {
        if (i.isActive) {
          cloneData?.listComponent?.forEach((com, idx) => {
            if (com.groupId !== i.groupId) {
              com.listAttribute.forEach((attr, indexAttr) => {
                if (attr?.copyValue?.GroupId === i.parentId) {
                  cloneData.listComponent[idx].listAttribute[indexAttr].hidden = true;
                }
              });
            }
          });
        } else {
          cloneData?.listComponent?.forEach((com, idx) => {
            if (com.groupId !== i.groupId) {
              com.listAttribute.forEach((attr, indexAttr) => {
                if (attr?.copyValue?.GroupId === i.parentId) {
                  cloneData.listComponent[idx].listAttribute[indexAttr].hidden = false;
                }
              });
            }
          });
        }
        cloneData.listComponent.forEach((v, indexV) => {
          if (i.groupId === v.groupId) {
            v.listAttribute.forEach((att, idx) => {
              if (hardAttributeAAARelate.includes(att.attributeCode)) {
                if (i.isActive) {
                  cloneData.listComponent[indexV].listAttribute[idx].hidden = true;
                  cloneData.listComponent[indexV].listAttribute[idx].isRequired = false;
                  cloneData.listComponent[indexV].listAttribute[idx].optionData?.forEach(option => {
                    if (hardAAACodesOptionMe.includes(option.code)) {
                      cloneData.listComponent[indexV].listAttribute[idx].value = `${option.value}`;
                    }
                  });
                } else {
                  cloneData.listComponent[indexV].listAttribute[idx].hidden = false;
                  cloneData.listComponent[indexV].listAttribute[idx].isRequired = true;
                }
              }
            });
          }
        });
      });
      setFormData({
        ...formData,
        productForm: {
          ...formData.productForm,
          listComponent: cloneData?.listComponent
        }
      });
    }
  }, [toggleCopyProcessed]);

  const onAddGroup = useCallback(
    (attribute, index) => {
      if (!parentFieldGroupIdCopy) {
        setParentFieldGroupIdCopy(attribute.groupId);
      }
      let tmp = [...(formData?.productForm?.listComponent || [])];
      const cloneData = attribute.listAttribute.map((atr, i) => {
        return { ...atr, value: null };
      });
      tmp.splice(index + 1, 0, {
        ...{
          ...attribute,
          listAttribute: cloneData,
          isListInputForm: true,
          parentId: `${attribute.groupId}_${new Date().getTime()}`
        },
        groupId: new Date().getTime() + index,
        addedByField: attribute.groupId
      });

      let dataProcessed = tmp.map((v, i) => {
        if (v.groupId === attribute.groupId) {
          return {
            ...v,
            isListInputForm: false
          };
        }
        return v;
      });
      setFormData({
        ...formData,
        productForm: {
          ...formData.productForm,
          listComponent: dataProcessed
        }
      });
    },
    [formData, parentFieldGroupIdCopy]
  );

  const onRemoveGroup = useCallback(
    groupId => {
      let newProductForm = cloneDeep(formData);
      const idxDeletedItem = newProductForm?.productForm?.listComponent?.findIndex(
        i => i.groupId === groupId
      );

      newProductForm?.productForm?.listComponent.forEach((i, index) => {
        if (i.groupId === parentFieldGroupIdCopy) {
          newProductForm?.productForm?.listComponent[index]?.listAttributeForm?.forEach(
            (attr, idx) => {
              if (attr.groupId === groupId) {
                newProductForm?.productForm?.listComponent[index]?.listAttributeForm?.splice(
                  idx,
                  1
                );
              }
            }
          );
        }
      });

      if (idxDeletedItem) {
        newProductForm?.productForm?.listComponent.splice(idxDeletedItem, 1);
        if (!newProductForm?.productForm?.listComponent?.[idxDeletedItem]?.addedByField) {
          newProductForm.productForm.listComponent[idxDeletedItem - 1].isListInputForm = true;
        }
      }
      setFormData({
        ...formData,
        productForm: {
          ...formData.productForm,
          listComponent: newProductForm?.productForm?.listComponent
        }
      });
    },
    [formData, parentFieldGroupIdCopy]
  );

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <View style={styles.statusTitleContainer}>
          <Heading style={styles.statusTitle} numberOfLines={2}>
            {item?.productName || itemDetail?.ordersItem?.name}
          </Heading>
          <OrderStatus status={itemDetail?.status || item?.status} />
        </View>
        <Divider />
        <View style={styles.statusContent}>
          <View style={styles.row}>
            <AppText translate style={styles.title}>
              {'profile_info.customer'}
            </AppText>
            <Text style={[styles.value, stylePrimaryText]}>
              {itemDetail?.contactName || item?.contactName}{' '}
            </Text>
          </View>
          <View style={[styles.row, { marginTop: SPACING.XNormal }]}>
            <AppText translate style={styles.title}>
              {'profile_info.profile_code'}
            </AppText>
            <Text style={[styles.value, stylePrimaryText]}>
              {itemDetail?.code || item?.orderCode}
            </Text>
          </View>
        </View>
      </View>
      <CommonTabHeader
        translate
        countInTab={countInTab}
        tabs={APPLICATION_PRODUCT_TAB}
        tabIndex={tabIndex}
        onPress={id => {
          setTabIndex(id);
        }}
        containerStyle={styles.headerTab}
      />
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.wrapper}
        showsVerticalScrollIndicator={false}>
        {tabIndex === tabScreen.INFO ? (
          <InfoTab
            itemDetail={formData}
            onUpdateInfo={onUpdateInfo}
            onAddGroup={onAddGroup}
            onRemoveGroup={onRemoveGroup}
            onCopy={onCopy}
            toggleCopy={toggleCopyProcessed}
          />
        ) : null}
        {tabIndex === tabScreen.QUOTES ? (
          <Quote itemDetail={itemDetail} onChange={setCountInTab} />
        ) : null}
        {itemDetail?.status === INSURANCE_ORDER_STATUS.WaitingForConsider &&
        itemDetail?.expiredPaymentDate ? (
          <View style={styles.noteContainer}>
            <View style={styles.dateContainer}>
              <AppText semiBold translate style={styles.noteExpireDate}>
                {'insurance_record_details.expire_date'}
              </AppText>
              <AppText semiBold translate style={styles.date}>
                {itemDetail?.expiredPaymentDate}
              </AppText>
            </View>
            <AppText semiBold translate style={styles.noteExpireDate}>
              {'insurance_record_details.after_expire_date'}
            </AppText>
          </View>
        ) : null}
      </ScrollView>
      {actionButton()}
    </View>
  );
};

export default WithLoading(InsuranceOrderDetailScreen, [
  ORDER.UPDATE_ORDER_STATUS.HANDLER,
  INSURANCE.GET_INSURANCE_ORDER_FORM_FOR_EDIT.HANDLER,
  INSURANCE.EDIT_INSURANCE_ORDER.HANDLER
]);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },

  contentContainer: {
    backgroundColor: BACKGROUND_COLOR.Primary,
    flex: 1
  },
  statusContainer: {
    ...Shadow,
    marginTop: SPACING.Large,
    marginBottom: SPACING.Medium,
    marginHorizontal: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.Primary,
    borderRadius: BORDER_RADIUS
  },
  statusTitleContainer: {
    flexDirection: 'row',
    padding: SPACING.Medium,
    justifyContent: 'space-between'
  },
  statusTitle: {
    flex: 1
  },
  statusContent: {
    padding: SPACING.Medium
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  value: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  headerTab: {},
  body: {},
  footer: {
    padding: SPACING.Medium,
    paddingTop: SPACING.Small,
    backgroundColor: BACKGROUND_COLOR.White,
    marginTop: SPACING.Normal,
    flexDirection: 'row'
  },
  backTitle: {
    color: CUSTOM_COLOR.Orange
  },
  disabledText: {
    color: CUSTOM_COLOR.White
  },
  flex: {
    flex: 1
  },
  status: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    marginRight: -SPACING.Medium
  },
  wrapper: {
    paddingTop: SPACING.Medium,
    paddingBottom: SPACING.HtmlBottom,
    paddingHorizontal: SPACING.Medium
  },
  actionContainer: {
    padding: SPACING.Medium,
    paddingBottom: isIphoneX ? 0 : SPACING.Medium,
    borderTopWidth: 1,
    borderColor: CUSTOM_COLOR.GalleryDark,
    backgroundColor: BACKGROUND_COLOR.Primary,
    flexDirection: 'row'
  },
  noteContainer: {
    alignSelf: 'center'
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  noteExpireDate: {
    color: CUSTOM_COLOR.ShuttleGray,
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  },
  date: {
    color: CUSTOM_COLOR.PersianGreen,
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead
  }
});
