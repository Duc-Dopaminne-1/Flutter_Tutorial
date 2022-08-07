import React, {forwardRef, useContext, useImperativeHandle, useMemo, useRef} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Portal} from 'react-native-portalize';

import {AppContext} from '../../appData/appContext/appContext';
import {NOTIFICATION_TYPE, TYPE_SORT_NOTIFY} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import CustomFooterButtons from '../../components/Button/CustomFooterButtons';
import ModalWithModalize, {useModalize} from '../../components/Modal/ModalWithModalize';
import {SizeBox} from '../../components/SizeBox';
import useMergeState from '../../hooks/useMergeState';
import ListCheckHighlightItems from '../MessageNotification/components/ListCheckHighlightItems';

const initOptionsSort = [
  {
    id: 1,
    type: TYPE_SORT_NOTIFY.IS_UNREAD,
    value: true,
    title: translate('notification.modal.unread'),
  },
  {
    id: 2,
    type: TYPE_SORT_NOTIFY.IS_UNREAD,
    value: false,
    title: translate('notification.modal.read'),
  },
];

const initOptionsType = [
  {
    id: null,
    title: `${translate(STRINGS.NOTIFICATION_TAB_ALL)}`,
  },
  {
    id: NOTIFICATION_TYPE.TRANSACTION,
    title: `${translate(STRINGS.NOTIFICATION_TAB_TRANSACTION)}`,
  },
  {
    id: NOTIFICATION_TYPE.SUGGESTION,
    title: `${translate(STRINGS.NOTIFICATION_TAB_SUGGESTION)}`,
  },
  {
    id: NOTIFICATION_TYPE.SYSTEM,
    title: `${translate(STRINGS.NOTIFICATION_TAB_SYSTEM)}`,
  },
];

const Section = ({children, title}) => {
  return (
    <View>
      <Text style={{...FONTS.bold, fontSize: SIZES.FONT_16}}>{title}</Text>
      <SizeBox height={SIZES.SEPARATOR_8} />
      {children}
    </View>
  );
};

export const initialFilter = {
  notificationType: initOptionsType[0],
  sortNotify: {},
};

type ModalSortNotifyProps = {
  onApplySort: Function,
  currentFilter: typeof initialFilter,
};

const ModalSortNotify = ({onApplySort, currentFilter}: ModalSortNotifyProps, ref) => {
  const {
    state: {summaryNoti},
  } = useContext(AppContext);

  const modalRef = useRef();
  const {closeModal, openModal} = useModalize(modalRef);
  const [state, setState] = useMergeState(initialFilter);

  useImperativeHandle(ref, () => ({
    openModal: openModalFilter,
  }));

  const listTypeNotification = useMemo(() => {
    return initOptionsType.map(item => {
      let unReadByType = 0;
      switch (item.id) {
        case NOTIFICATION_TYPE.TRANSACTION:
          unReadByType = summaryNoti?.totalTypeTransactionUnread;
          break;
        case NOTIFICATION_TYPE.SUGGESTION:
          unReadByType = summaryNoti?.totalTypeSuggestionUnread;
          break;
        case NOTIFICATION_TYPE.SYSTEM:
          unReadByType = summaryNoti?.totalTypeSystemUnread;
          break;
        default:
          unReadByType = summaryNoti?.totalNotificationUnread;
          break;
      }
      const newTitle = `${item.title} (${unReadByType})`;
      return {...item, title: newTitle};
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summaryNoti?.totalNotificationUnread]);

  const openModalFilter = () => {
    openModal();
    setState(currentFilter);
  };

  const onSelectType = item => {
    setState({notificationType: item});
  };
  const onSelectSort = item => {
    if (item.id === state.sortNotify.id) {
      setState({sortNotify: {}});
    } else {
      setState({sortNotify: item});
    }
  };

  const applySort = () => {
    closeModal();
    onApplySort && onApplySort(state);
  };
  const resetSort = () => {
    setState(initialFilter);
    onApplySort && onApplySort(initialFilter);
  };

  return (
    <Portal>
      <ModalWithModalize getModalRef={modalRef} handlePosition="outside">
        <View style={styles.wrapperContent}>
          <Text style={styles.title}>{translate('notification.modal.filter')}</Text>
          <Section title={translate('notification.modal.typeNotify')}>
            <ListCheckHighlightItems
              data={listTypeNotification}
              currentItem={state.notificationType}
              onSelect={onSelectType}
            />
          </Section>
          <SizeBox height={SIZES.SEPARATOR_8} />
          <Section title={translate('notification.modal.sort')}>
            <ListCheckHighlightItems
              data={initOptionsSort}
              currentItem={state.sortNotify}
              onSelect={onSelectSort}
            />
          </Section>
        </View>
        <View style={styles.footer}>
          <CustomFooterButtons
            nextButtonTitle={translate('notification.modal.apply')}
            cancelButtonTitle={translate('notification.modal.reset')}
            onPressCancel={resetSort}
            onPressNext={applySort}
          />
        </View>
        <SafeAreaView />
      </ModalWithModalize>
    </Portal>
  );
};
export default forwardRef(ModalSortNotify);

const styles = StyleSheet.create({
  title: {...FONTS.bold, fontSize: SIZES.FONT_24, marginBottom: SIZES.MARGIN_32},
  wrapperContent: {padding: SIZES.PADDING_16, paddingBottom: SIZES.PADDING_8},
  footer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.GREY_F0,
  },
});
