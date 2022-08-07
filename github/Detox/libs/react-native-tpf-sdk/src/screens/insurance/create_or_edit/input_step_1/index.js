import {
  clearInsuranceOrderResult,
  createInsuranceOrderHandle,
  getInsuranceOrderForCreateFormClear
} from '../../../../redux/actions/insurance';
import { deleteOrderClear, deleteOrderHandle } from '../../../../redux/actions/order';
import { getShowAlertError } from '../../../../redux/actions/system';
import { INSURANCE } from '../../../../redux/actionsType';
import { DynamicInputForm, PrimaryButton, WithLoading } from '../../../../components/';
import AppText from '../../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../../constants/colors';
import {
  CONFIRM_SAVE_DRAFT_ORDER,
  CONFIRM_SAVE_ORDER,
  CREATE_OR_EDIT_INSURANCE_ORDER_ERROR
} from '../../../../constants/errors';
import SCREENS_NAME from '../../../../constants/screens';
import { BORDER_RADIUS, SPACING } from '../../../../constants/size';
import { Shadow } from '../../../../constants/stylesCSS';
import { cloneDeep, isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { useEmptyForm } from '../../../../hooks/useEmptyForm';
import { scale } from '../../../../utils/responsive';
import ProgressPurchase from '../../components/progress_purchase';
import __ from 'lodash';
import { isIphoneX } from '../../../../helpers/device';
import SecondaryButton from '../../../../components/secondary_button';
import { MEMBER_TYPE } from '../../../../global/member_type';
import { INSURANCE_ORDER_STATUS } from '../../../../global/order_status';
import { attributeCopyCode, hardAAACodesOptionMe, hardAttributeAAARelate } from '../constants';
import {
  findGroupFormByAttributeCode,
  findIndexAttributeFromGroup,
  findAttributeFromGroup,
  findOptionDataFromAttribute
} from '../helpers';
import { ICSupportRequire } from '../../../../assets/icons';

const data = [
  {
    value: '0',
    title: 'common.no'
  },
  {
    value: '1',
    title: 'common.yes'
  }
];

const InsurancePurchaseScreen = props => {
  const {
    navigation,
    route: { params: screenState }
  } = props;

  const dispatch = useDispatch();

  const [formData, setFormData] = useState();
  const [contactInfo, setContactInfo] = useState();
  const [productForm, setProductForm] = useState();
  const [loaded, setLoaded] = useState(false);
  const role = useSelector(state => state.auth.role);
  const [toggleCopy, setToggleCopy] = useState(null);
  const [parentFieldGroupIdCopy, setParentFieldGroupIdCopy] = useState(null);
  const [AAAErrMsg, setAAAErrMsg] = useState(null);
  const { lang } = useSelector(state => state.setting);

  const itemDetail = useSelector(state => state.insurance.insuranceOrderFormCreate);

  const { profile, topenIdProfile } = useSelector(state => state.member);
  const onChangeContactInfo = listComponent => {
    setContactInfo({ ...contactInfo, listComponent });
    setFormData({
      ...screenState?.form,
      contact: { ...contactInfo, listComponent }
    });
  };

  const initForm = components => {
    const PADVComponent = findGroupFormByAttributeCode(components, 'PADP_Vehicle');

    if (PADVComponent) {
      const indexPADVSlot = findIndexAttributeFromGroup(PADVComponent, 'PVI_PADP_slot_number');
      const listAttributeInstance = [...PADVComponent?.listAttribute];
      if (indexPADVSlot !== -1) {
        listAttributeInstance[indexPADVSlot].isRequired = false;
        listAttributeInstance[indexPADVSlot].hidden = true;
      }
      setProductForm({ ...productForm, components });
    }

    //AAA - Bảo hiểm gia đình carrer  1
    const AAAFamilyInsuranceCareer1 = findGroupFormByAttributeCode(
      components,
      'AAA_Family_InsurerCareer1'
    );
    if (AAAFamilyInsuranceCareer1) {
      const indexAAASlot1 = findIndexAttributeFromGroup(
        AAAFamilyInsuranceCareer1,
        'AAA_Family_InsurerCareerDesc1'
      );
      const AAAFamilyInsuranceStatus1 = findAttributeFromGroup(
        AAAFamilyInsuranceCareer1,
        'AAA_Family_InsurerCareer1'
      );
      const selectedAlias = findOptionDataFromAttribute(AAAFamilyInsuranceStatus1);
      const listAttributeInstance = [...AAAFamilyInsuranceCareer1?.listAttribute];
      if (selectedAlias?.code !== '0016' && indexAAASlot1 !== -1) {
        listAttributeInstance[indexAAASlot1].isRequired = false;
        listAttributeInstance[indexAAASlot1].hidden = true;
      }
      setProductForm({ ...productForm, components });
    }

    //AAA - Bảo hiểm gia đình carrer 2
    const AAAFamilyInsuranceCareer2 = findGroupFormByAttributeCode(
      components,
      'AAA_Family_InsurerCareer2'
    );

    if (AAAFamilyInsuranceCareer2) {
      const indexAAASlot2 = findIndexAttributeFromGroup(
        AAAFamilyInsuranceCareer2,
        'AAA_Family_InsurerCareerDesc2'
      );
      const AAAFamilyInsuranceStatus2 = findAttributeFromGroup(
        AAAFamilyInsuranceCareer2,
        'AAA_Family_InsurerCareer2'
      );
      const selectedAlias = findOptionDataFromAttribute(AAAFamilyInsuranceStatus2);

      const listAttributeInstance = [...AAAFamilyInsuranceCareer2?.listAttribute];
      if (selectedAlias?.code !== '0016' && indexAAASlot2 !== -1) {
        listAttributeInstance[indexAAASlot2].isRequired = false;
        listAttributeInstance[indexAAASlot2].hidden = true;
      }
      setProductForm({ ...productForm, components });
    }

    // AAA - bảo hiểm cá nhân
    const AAAPersonalInsuranceCareer = findGroupFormByAttributeCode(
      components,
      'AAA_Individual_InsurerCareer'
    );

    if (AAAPersonalInsuranceCareer) {
      const indexAAA = findIndexAttributeFromGroup(
        AAAPersonalInsuranceCareer,
        'AAA_Individual_InsurerCareerDesc'
      );
      const AAAPersonalInsuranceStatus = findAttributeFromGroup(
        AAAPersonalInsuranceCareer,
        'AAA_Individual_InsurerCareer'
      );
      const selectedAlias = findOptionDataFromAttribute(AAAPersonalInsuranceStatus);
      const listAttributeInstance = [...AAAPersonalInsuranceCareer?.listAttribute];
      if (selectedAlias?.code !== '0016' && indexAAA !== -1) {
        listAttributeInstance[indexAAA].isRequired = false;
        listAttributeInstance[indexAAA].hidden = true;
      }
      setProductForm({ ...productForm, components });
    }
  };

  const onChangeProductForm = (listComponent, groupId, attributeId) => {
    const PADVComponent = findGroupFormByAttributeCode(listComponent, 'PADP_Vehicle');
    if (PADVComponent) {
      const index = findIndexAttributeFromGroup(PADVComponent, 'PADP_Vehicle');
      const PADVStatus = findAttributeFromGroup(PADVComponent, 'PADP_Vehicle');

      const selected = PADVStatus?.value || '';

      const selectedAlias = __.find(data || [], o => parseInt(o?.value) === +selected);

      let listComponentInstance = [...listComponent];

      const indexPADVSlot = findIndexAttributeFromGroup(PADVComponent, 'PVI_PADP_slot_number');

      const listAttributeInstance = [...PADVComponent?.listAttribute];

      if (indexPADVSlot !== -1) {
        if (selectedAlias?.value !== '0') {
          listAttributeInstance[indexPADVSlot].isRequired = true;
          listAttributeInstance[indexPADVSlot].hidden = false;
          listComponentInstance[index] = {
            ...listComponentInstance[index],
            listAttribute: [...listAttributeInstance]
          };
        } else {
          listAttributeInstance[indexPADVSlot].isRequired = false;
          listAttributeInstance[indexPADVSlot].hidden = true;
          listComponentInstance[index] = {
            ...listComponentInstance[index],
            listAttribute: [...listAttributeInstance]
          };
        }
      }
    }
    let AAAFamilyInsuranceStatus1;
    let AAAFamilyInsuranceStatus2;
    let AAAPersonalInsuranceStatus;
    //AAA - Bảo hiểm gia đình career 1
    const AAAFamilyInsuranceCareer1 = findGroupFormByAttributeCode(
      listComponent,
      'AAA_Family_InsurerCareer1'
    );
    if (AAAFamilyInsuranceCareer1) {
      const index = findIndexAttributeFromGroup(
        AAAFamilyInsuranceCareer1,
        'AAA_Family_InsurerCareer1'
      );
      AAAFamilyInsuranceStatus1 = findAttributeFromGroup(
        AAAFamilyInsuranceCareer1,
        'AAA_Family_InsurerCareer1'
      );
      const selectedAlias = findOptionDataFromAttribute(AAAFamilyInsuranceStatus1);

      let listComponentInstance = [...listComponent];
      const indexAAASlot1 = findIndexAttributeFromGroup(
        AAAFamilyInsuranceCareer1,
        'AAA_Family_InsurerCareerDesc1'
      );
      const listAttributeInstance = [...AAAFamilyInsuranceCareer1?.listAttribute];
      if (indexAAASlot1 !== -1) {
        if (selectedAlias?.code === '0016') {
          listAttributeInstance[indexAAASlot1].isRequired = true;
          listAttributeInstance[indexAAASlot1].hidden = false;
          listComponentInstance[index] = {
            ...listComponentInstance[index],
            listAttribute: [...listAttributeInstance]
          };
        } else {
          listAttributeInstance[indexAAASlot1].isRequired = false;
          listAttributeInstance[indexAAASlot1].hidden = true;
          listComponentInstance[index] = {
            ...listComponentInstance[index],
            listAttribute: [...listAttributeInstance]
          };
        }
      }
    }
    //AAA - Bảo hiểm gia đình career 2
    const AAAFamilyInsuranceCareer2 = findGroupFormByAttributeCode(
      listComponent,
      'AAA_Family_InsurerCareer2'
    );

    if (AAAFamilyInsuranceCareer2) {
      const index = findIndexAttributeFromGroup(
        AAAFamilyInsuranceCareer2,
        'AAA_Family_InsurerCareer2'
      );
      AAAFamilyInsuranceStatus2 = findAttributeFromGroup(
        AAAFamilyInsuranceCareer2,
        'AAA_Family_InsurerCareer2'
      );

      const selectedAlias = findOptionDataFromAttribute(AAAFamilyInsuranceStatus2);
      let listComponentInstance = [...listComponent];
      const indexAAASlot2 = findIndexAttributeFromGroup(
        AAAFamilyInsuranceCareer2,
        'AAA_Family_InsurerCareerDesc2'
      );

      const listAttributeInstance = [...AAAFamilyInsuranceCareer2?.listAttribute];
      if (indexAAASlot2 !== -1) {
        if (selectedAlias?.code === '0016') {
          listAttributeInstance[indexAAASlot2].isRequired = true;
          listAttributeInstance[indexAAASlot2].hidden = false;
          listComponentInstance[index] = {
            ...listComponentInstance[index],
            listAttribute: [...listAttributeInstance]
          };
        } else {
          listAttributeInstance[indexAAASlot2].isRequired = false;
          listAttributeInstance[indexAAASlot2].hidden = true;
          listComponentInstance[index] = {
            ...listComponentInstance[index],
            listAttribute: [...listAttributeInstance]
          };
        }
      }
    }
    //AAA - Bảo hiểm AAA cá nhân
    const AAAPersonalInsuranceCareer = findGroupFormByAttributeCode(
      listComponent,
      'AAA_Individual_InsurerCareer'
    );

    if (AAAPersonalInsuranceCareer) {
      AAAPersonalInsuranceStatus = findAttributeFromGroup(
        AAAPersonalInsuranceCareer,
        'AAA_Individual_InsurerCareer'
      );
      const index = findIndexAttributeFromGroup(
        AAAPersonalInsuranceStatus,
        'AAA_Individual_InsurerCareer'
      );
      const selectedAlias = findOptionDataFromAttribute(AAAPersonalInsuranceStatus);
      let listComponentInstance = [...listComponent];
      const indexAAA = findIndexAttributeFromGroup(
        AAAPersonalInsuranceCareer,
        'AAA_Individual_InsurerCareerDesc'
      );

      const listAttributeInstance = [...AAAPersonalInsuranceCareer?.listAttribute];
      if (indexAAA !== -1) {
        if (selectedAlias?.code === '0016') {
          listAttributeInstance[indexAAA].isRequired = true;
          listAttributeInstance[indexAAA].hidden = false;
          listComponentInstance[index] = {
            ...listComponentInstance[index],
            listAttribute: [...listAttributeInstance]
          };
        } else {
          listAttributeInstance[indexAAA].isRequired = false;
          listAttributeInstance[indexAAA].hidden = true;
          listComponentInstance[index] = {
            ...listComponentInstance[index],
            listAttribute: [...listAttributeInstance]
          };
        }
      }
    }
    // disable copy value (this is feature disable copy when change input of copied form group)
    const changeGroup = listComponent.find(item => item.groupId === groupId);
    const changeAttribute = changeGroup?.listAttribute?.find(
      item => item.attributeId === attributeId
    );
    changeGroup?.listAttribute?.forEach(att => {
      if (attributeCopyCode.includes(att.attributeCode)) {
        const mapping = att.copyValue.mapping;
        const idsCopied = [];
        for (const k in mapping) {
          idsCopied.push(mapping[k].To);
        }
        if (idsCopied.includes(attributeId)) {
          toggleCopyProcessed?.forEach(item => {
            if (item?.groupId === groupId) {
              if (changeAttribute.value) {
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

    // AAA check high risk job
    const checkedFamilyField2 = AAAFamilyInsuranceStatus2?.optionData?.find(
      item => item?.value?.toString() === AAAFamilyInsuranceStatus2?.value?.toString()
    );
    const checkedFamilyField1 = AAAFamilyInsuranceStatus1?.optionData?.find(
      item => item?.value?.toString() === AAAFamilyInsuranceStatus1?.value?.toString()
    );
    const checkPersonal = AAAPersonalInsuranceStatus?.optionData?.find(
      item => item?.value?.toString() === AAAPersonalInsuranceStatus?.value?.toString()
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
    const parentField = listComponent?.find(item => item.groupId === parentFieldGroupIdCopy);
    const addMoreFields = listComponent.filter(item => item.addedByField && item);
    const addedMoreData = addMoreFields.map(item => {
      return {
        attributeForm: item.listAttribute,
        groupId: item.groupId
      };
    });
    let dataProcessed = listComponent?.map(item => {
      if (item?.groupId === parentField?.groupId) {
        return {
          ...item,
          listAttributeForm: addedMoreData
        };
      } else {
        return item;
      }
    });

    setProductForm({
      ...productForm,
      listComponent: dataProcessed
    });
    setFormData({
      ...screenState?.form,
      productForm: {
        ...productForm,
        listComponent: dataProcessed
      }
    });
  };

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

  useEffect(() => {
    if (!isEmpty(screenState?.form)) {
      setFormData({
        ...screenState?.form,
        contact: {
          ...screenState?.form.contact,
          memberId: profile?.id,
          memberTopener: {
            ...screenState?.form.memberTopener,
            memberTopenerLastName: topenIdProfile?.name || profile?.name
          }
        }
      });
      setContactInfo({ ...screenState?.form?.contact });
      setProductForm({ ...screenState?.form?.productForm });
      setLoaded(true);
    }
  }, [profile, topenIdProfile?.name, screenState]);

  useEffect(() => {
    if (loaded) {
      initForm(productForm?.listComponent);
    }
  }, [loaded]);

  useEffect(() => {
    return () => {
      dispatch(getInsuranceOrderForCreateFormClear());
    };
  }, [dispatch]);

  // On Next Button Handle
  const onPress = useCallback(() => {
    const cloneFormData = cloneDeep(formData);
    cloneFormData?.productForm?.listComponent?.forEach((item, index) => {
      if (item.listAttributeForm) {
        cloneFormData.productForm.listComponent[index].isListInputForm = true;
      }
    });
    dispatch(
      createInsuranceOrderHandle({
        ...{
          ...cloneFormData,
          id: insuranceCreateOrEditOrderResult?.id || null,
          productForm: {
            ...cloneFormData.productForm,
            listComponent: cloneFormData.productForm.listComponent.filter(
              item => !item.addedByField
            )
          }
        },
        status: formData?.status || 'Draft',
        step: 1,
        isTopener: role === MEMBER_TYPE.Topener
      })
    );
  }, [dispatch, formData, role]);

  const onSave = useCallback(() => {
    dispatch(
      createInsuranceOrderHandle({
        ...formData,
        status: formData?.status || 'Draft',
        action: 'Back',
        step: 1,
        isTopener: role === MEMBER_TYPE.Topener
      })
    );
  }, [dispatch, formData, role]);

  const onCancel = useCallback(() => {
    if (itemDetail?.id) {
      dispatch(deleteOrderHandle({ id: itemDetail?.id }));
    }
    navigation.goBack();
  }, [dispatch, itemDetail, navigation]);

  // Check status of data after call API Create with status Draft
  const { insuranceCreateOrEditOrderResult } = useSelector(state => state.insurance);
  useEffect(() => {
    if (insuranceCreateOrEditOrderResult?.isSuccess && insuranceCreateOrEditOrderResult.step == 1) {
      if (insuranceCreateOrEditOrderResult?.isBack) {
        navigation.goBack();
      } else {
        navigation.navigate(SCREENS_NAME.INSURANCE_CONFIRM_INFO_SCREEN, {
          productInfo: screenState?.productInfo,
          data: insuranceCreateOrEditOrderResult,
          action: screenState?.action,
          form: screenState.form
        });
        dispatch(clearInsuranceOrderResult());
      }
    } else if (insuranceCreateOrEditOrderResult?.isError) {
      dispatch(getShowAlertError(CREATE_OR_EDIT_INSURANCE_ORDER_ERROR));
    }
    return () => {
      dispatch(clearInsuranceOrderResult());
    };
  }, [
    dispatch,
    insuranceCreateOrEditOrderResult,
    navigation,
    screenState?.action,
    screenState.productInfo,
    screenState.form
  ]);

  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      if (!isEmpty(itemDetail)) {
        setFormData({ ...formData, ...itemDetail });
      }
    });
    return () => {
      focusListener();
    };
  }, [formData, itemDetail, navigation]);

  const isContactFillAll = useEmptyForm(contactInfo?.listComponent);
  const isProductFillAll = useEmptyForm(productForm?.listComponent);

  const onBackAction = useCallback(() => {
    if (isContactFillAll && isProductFillAll) {
      dispatch(
        getShowAlertError({
          ...(itemDetail?.status === INSURANCE_ORDER_STATUS.Draft
            ? CONFIRM_SAVE_DRAFT_ORDER
            : CONFIRM_SAVE_ORDER),
          cancelAction: onCancel,
          confirmAction: onSave
        })
      );
    } else {
      navigation.goBack();
    }
  }, [
    navigation,
    dispatch,
    onCancel,
    onSave,
    isContactFillAll,
    isProductFillAll,
    itemDetail?.status
  ]);

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
      const cloneData = cloneDeep(productForm);
      toggleCopyProcessed?.forEach(item => {
        if (item.isActive) {
          cloneData?.listComponent?.forEach((com, idx) => {
            if (com.groupId !== item.groupId) {
              com.listAttribute.forEach((attr, i) => {
                if (attr?.copyValue?.GroupId === item.parentId) {
                  cloneData.listComponent[idx].listAttribute[i].hidden = true;
                }
              });
            }
          });
        } else {
          cloneData?.listComponent?.forEach((com, idx) => {
            if (com.groupId !== item.groupId) {
              com.listAttribute.forEach((attr, i) => {
                if (attr?.copyValue?.GroupId === item.parentId) {
                  cloneData.listComponent[idx].listAttribute[i].hidden = false;
                }
              });
            }
          });
        }
        cloneData.listComponent.forEach((v, i) => {
          if (item.groupId === v.groupId) {
            v.listAttribute.forEach((att, idx) => {
              if (hardAttributeAAARelate.includes(att.attributeCode)) {
                if (item.isActive) {
                  cloneData.listComponent[i].listAttribute[idx].hidden = true;
                  cloneData.listComponent[i].listAttribute[idx].isRequired = false;
                  cloneData.listComponent[i].listAttribute[idx].optionData?.forEach(option => {
                    if (hardAAACodesOptionMe.includes(option.code)) {
                      cloneData.listComponent[i].listAttribute[idx].value = `${option.value}`;
                    }
                  });
                } else {
                  cloneData.listComponent[i].listAttribute[idx].hidden = false;
                  cloneData.listComponent[i].listAttribute[idx].isRequired = true;
                }
              }
            });
          }
        });
      });
      setProductForm({
        ...productForm,
        listComponent: cloneData?.listComponent
      });
      setFormData({
        ...screenState?.form,
        productForm: {
          ...productForm,
          listComponent: cloneData?.listComponent
        }
      });
    }
  }, [toggleCopyProcessed]);

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
      formData?.contact?.listComponent?.forEach((item, index) => {
        if (item.groupId === rootItem.copyValue.GroupId) {
          rootItem?.copyValue?.mapping?.forEach(id => {
            item?.eavAttribute.forEach(v => {
              if (id.From === v.attributeId) {
                values.push({ ...v, copyTo: id.To });
              }
            });
          });
        }
      });
      const newProductForm = cloneDeep(productForm);
      const stateCopy = toggleCopyProcessed?.find(
        item => item.groupId === rootItem.copyValue.InputFormGroupId
      );
      productForm?.listComponent?.forEach((item, index) => {
        if (item.groupId === rootItem.copyValue.InputFormGroupId) {
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
      setProductForm({
        ...productForm,
        listComponent: newProductForm?.listComponent
      });
      setFormData({
        ...screenState?.form,
        productForm: {
          ...productForm,
          listComponent: newProductForm?.listComponent
        }
      });
    },
    [
      formData?.contact?.listComponent,
      handleToggleCopy,
      productForm,
      screenState?.form,
      toggleCopyProcessed
    ]
  );

  const onAddGroup = useCallback(
    (attribute, index) => {
      if (!parentFieldGroupIdCopy) {
        setParentFieldGroupIdCopy(attribute.groupId);
      }
      let tmp = [...productForm.listComponent];
      const cloneData = attribute.listAttribute.map((item, i) => {
        return { ...item, value: null };
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

      let dataProcessed = tmp.map((item, i) => {
        if (item.groupId === attribute.groupId) {
          return {
            ...item,
            isListInputForm: false
          };
        }
        return item;
      });
      setProductForm({ ...productForm, listComponent: dataProcessed });
      setFormData({
        ...screenState?.form,
        productForm: {
          ...productForm,
          listComponent: dataProcessed
        }
      });
    },
    [parentFieldGroupIdCopy, productForm, screenState?.form]
  );

  const onRemoveGroup = useCallback(
    groupId => {
      let newProductForm = cloneDeep(productForm);
      const idxDeletedItem = newProductForm?.listComponent?.findIndex(
        item => item.groupId === groupId
      );

      newProductForm?.listComponent.forEach((item, index) => {
        if (item.groupId === parentFieldGroupIdCopy) {
          newProductForm?.listComponent[index]?.listAttributeForm?.forEach((attr, idx) => {
            if (attr.groupId === groupId) {
              newProductForm?.listComponent[index]?.listAttributeForm?.splice(idx, 1);
            }
          });
        }
      });

      if (idxDeletedItem) {
        newProductForm?.listComponent.splice(idxDeletedItem, 1);
        if (!newProductForm?.listComponent?.[idxDeletedItem]?.addedByField) {
          newProductForm.listComponent[idxDeletedItem - 1].isListInputForm = true;
        }
      }
      setProductForm({ ...productForm, listComponent: newProductForm?.listComponent });
      setFormData({
        ...screenState?.form,
        productForm: {
          ...productForm,
          listComponent: newProductForm?.listComponent
        }
      });
    },
    [parentFieldGroupIdCopy, productForm, screenState?.form]
  );

  useEffect(() => {
    navigation.setOptions({
      backAction: onBackAction
    });
  }, [navigation, onBackAction]);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        extraHeight={80}
        keyboardOpeningTime={-1}
        enableResetScrollToCoords={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}>
        <AppText translate bold={true} style={styles.title}>
          {(screenState.productInfo?.name || formData?.ordersItem.name || '') + ''}
        </AppText>
        <ProgressPurchase
          style={styles.progressContainer}
          currentStepIndex={0}
          stepList={[
            'product_screen.progress_purchase_item_01',
            'product_screen.progress_purchase_item_02',
            screenState?.action === 'update' ? 'common.update' : 'common.payment'
          ]}
        />
        <View style={{ marginHorizontal: SPACING.Medium }}>
          <DynamicInputForm
            listComponent={contactInfo?.listComponent}
            onChange={onChangeContactInfo}
          />
          <DynamicInputForm
            listComponent={productForm?.listComponent}
            onChange={onChangeProductForm}
            formData={formData}
            onAddGroup={onAddGroup}
            onCopy={onCopy}
            onRemoveGroup={onRemoveGroup}
            toggleCopy={toggleCopyProcessed}
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.footer}>
        <View style={[styles.flex, { marginRight: scale(15) }]}>
          <SecondaryButton
            translate
            title={'common.back'}
            onPress={onBackAction}
            // backgroundColor={'rgba(240, 140, 49, 0.25)'}
            // backgroundColorDisabled={BACKGROUND_COLOR.Silver}
          />
        </View>
        <View style={styles.flex}>
          <PrimaryButton
            translate
            disabled={!(isContactFillAll && isProductFillAll)}
            title={'common.continue_text'}
            onPress={onPress}
            // disabledText={styles.disabledText}
            // backgroundColorDisabled={BACKGROUND_COLOR.Silver}
          />
        </View>
      </View>
    </View>
  );
};

export default WithLoading(InsurancePurchaseScreen, [INSURANCE.CREATE_INSURANCE_ORDER.HANDLER]);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  flex: {
    flex: 1
  },
  list: {
    paddingVertical: SPACING.Normal
  },
  title: {
    paddingTop: SPACING.Medium,
    marginHorizontal: SPACING.Medium,
    textAlign: 'center',
    lineHeight: LINE_HEIGHT.Heading,
    fontSize: FONT_SIZE.Heading
  },
  progressContainer: {
    marginTop: SPACING.Large,
    marginBottom: SPACING.Medium
  },
  footer: {
    padding: SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.White,
    paddingBottom: isIphoneX ? 0 : SPACING.Medium,
    borderTopWidth: 1,
    borderColor: CUSTOM_COLOR.GalleryDark,
    flexDirection: 'row'
  },
  backTitle: {
    color: CUSTOM_COLOR.Orange
  },
  disabledText: {
    color: CUSTOM_COLOR.White
  },
  dropdownBackground: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dropdownContainer: {
    minHeight: '25%',
    width: '75%',
    backgroundColor: CUSTOM_COLOR.White,
    borderRadius: BORDER_RADIUS
  },
  expandView: {
    marginHorizontal: SPACING.Medium,
    marginVertical: SPACING.Normal
  },
  inputContainer: {
    marginVertical: SPACING.Normal
  },
  buttonContainer: {
    marginHorizontal: SPACING.Medium,
    marginVertical: SPACING.Normal,
    flex: 1
  },
  butotnGroupContainer: {
    flexDirection: 'row'
  }
});
