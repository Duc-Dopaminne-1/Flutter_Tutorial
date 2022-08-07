import { cloneDeep, isEmpty } from 'lodash';
import { ATTRIBUTE_TYPE } from '../global/entity_type';
import { IDS_DEPENDENT_PAY } from '../screens/credit/create_or_edit/constants';
const { useMemo } = require('react');

export function useEmptyForm(data, isHideDependentPay = null) {
  const processedData = useMemo(() => {
    let cloneData = cloneDeep(data);
    if (isHideDependentPay) {
      cloneData?.forEach((item, index) => {
        if (IDS_DEPENDENT_PAY.includes(item.code)) {
          delete cloneData[index];
        }
      });
    }
    return cloneData?.filter(item => item);
  }, [data, isHideDependentPay]);

  const verifyFillAll = useMemo(() => {
    if (!Array.isArray(data) || isEmpty(data)) {
      return true;
    }
    const tempIsFillAll = processedData?.every(component =>
      !isEmpty(component?.eavAttribute)
        ? component?.eavAttribute?.every(
            item =>
              !item?.error &&
              (item?.isRequired
                ? (item.type !== ATTRIBUTE_TYPE.address && !!item?.value) ||
                  item?.mediaUploadValue?.length > 0 ||
                  (item.type === ATTRIBUTE_TYPE.address &&
                    (item?.addressData?.isChecked ||
                      item?.addressData?.addressDetail?.every(
                        addr => !!addr.value && !addr?.error
                      )))
                : true)
          )
        : !isEmpty(component?.listComponent)
        ? component?.listComponent?.every(
            item =>
              !item?.error &&
              (item?.isRequired
                ? (item.type !== ATTRIBUTE_TYPE.address && !!item?.value) ||
                  item?.mediaUploadValue?.length > 0 ||
                  (item.type === ATTRIBUTE_TYPE.address &&
                    (item?.addressData?.isChecked ||
                      item?.addressData?.addressDetail?.every(
                        addr => !!addr.value && !addr?.error
                      )))
                : true)
          )
        : !isEmpty(component?.listAttribute)
        ? component?.listAttribute?.every(
            item =>
              !item?.error &&
              (item?.isRequired
                ? (item.type !== ATTRIBUTE_TYPE.address && !!item?.value) ||
                  item?.mediaUploadValue?.length > 0 ||
                  (item.type === ATTRIBUTE_TYPE.address &&
                    (item?.addressData?.isChecked ||
                      item?.addressData?.addressDetail?.every(
                        addr => !!addr.value && !addr?.error
                      )))
                : true)
          )
        : false
    );
    return tempIsFillAll;
  }, [data, processedData]);
  return verifyFillAll;
}
