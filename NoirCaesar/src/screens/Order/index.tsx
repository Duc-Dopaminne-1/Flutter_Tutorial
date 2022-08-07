import { View, RefreshControl, ActivityIndicator, SectionList, SectionListData } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import Container from '@components/Container';
import styles from './styles';
import translate from '@src/localize';
import { CustomHeader } from '@src/components/CustomHeader';
import { BACK } from '@src/constants/icons';
import NavigationActionsService from '@src/navigation/navigation';
import { OrdersItem } from '@src/components/FlatListItem/OrdersItem';
import { useDispatch, useSelector } from 'react-redux';
import { getListOrder, getOrderDetail } from '@src/modules/payment/actions';
import { RootState } from '@src/types/types';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IOrder, IOrderLine } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';
import { formatDate } from '@src/utils/date';
import { colors } from '@src/constants/vars';
import { usePrevious } from '@src/hooks/usePrevious';
import { clone } from 'lodash';
import { OrderSection } from '@src/components/OrderSection';
import { paymentOrder } from '@src/utils/payment';
import { CustomPopup } from '@src/components/CustomPopup';
import EmptyData from '@src/components/EmptyData';
import { IError } from '@src/modules/base';

interface ICustomOrder {
  orderLine: IOrderLine;
  status: string;
  date_placed: string;
}

interface IOrderSection {
  title: string;
  data: ICustomOrder[];
}

const Orders = () => {
  const dispatch = useDispatch();

  const sectionListRef = useRef<any>(null);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const previousLoading = usePrevious(loading);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState<IOrderSection[]>([]);
  const [sectionTitleList, setSectionTitleList] = useState<string[]>([]);
  const [isShowPopup, setShowPopup] = useState<boolean>(false);

  const orderList = useSelector<RootState, IPagination<IOrder> | undefined>((state: RootState) => state.payment.orderList);

  useEffect(() => {
    NavigationActionsService.showLoading();
    fetchOrder();
  }, []);

  useEffect(() => {
    if (loading && previousLoading !== loading) {
      dispatch(
        getListOrder({
          page: page,
          limit: 10,
          onSuccess: () => {
            setPage(page + 1);
            setTimeout(() => {
              NavigationActionsService.hideLoading();
              setLoading(false);
              setIsRefreshing(false);
            }, 500);
          },
          onFail: error => {
            setTimeout(() => {
              NavigationActionsService.hideLoading();
              setLoading(false);
              setIsRefreshing(false);
              NavigationActionsService.showErrorPopup(error);
            }, 500);
          },
        }),
      );
    }
  }, [loading]);

  useEffect(() => {
    parseData();
  }, [orderList]);

  const onBack = () => {
    NavigationActionsService.toggleDrawer(true);
  };

  const fetchOrder = () => {
    setLoading(true);
  };

  const handleRefresh = () => {
    setPage(1);
    setIsRefreshing(true);
    setTimeout(() => {
      fetchOrder();
    }, 500);
  };

  const handleLoadMore = () => {
    if (!loading && !isRefreshing && orderList && orderList.next && orderList.results.length !== orderList.count) {
      fetchOrder();
    }
  };

  const parseData = () => {
    const cloneData = clone(orderList?.results ? orderList.results : []);

    const orderData: IOrderSection[] = cloneData.map((item: IOrder) => ({
      title: item.number,
      data: item.lines.map((line: IOrderLine) => ({
        orderLine: line,
        status: item.status,
        date_placed: item.date_placed,
      })),
    }));

    const sectionList: string[] = [];

    cloneData.forEach(item => {
      sectionList.push(item.number);
    });

    orderData.length > 0 && setData(orderData);
    sectionList.length > 0 && setSectionTitleList(sectionList);
  };

  const onPressSectionPayment = (id?: number) => {
    if (id) {
      NavigationActionsService.showLoading();
      dispatch(
        getOrderDetail({
          order_id: id,
          onSuccess: (order: IOrder) => {
            setTimeout(() => {
              NavigationActionsService.hideLoading();
              paymentOrder(
                order.payment_url,
                order.provider,
                () => {
                  setShowPopup(true);
                },
                (error: IError) => {
                  NavigationActionsService.showCustomPopup({
                    text: error.message,
                    buttonRedTitle: "Close",
                    onPressRedButton: () => {
                      NavigationActionsService.hideCustomPopup();
                      reloadData();
                    }
                  })
                },
                reloadData,
              );
            }, 500);
          },
          onFail: error => {
            NavigationActionsService.hideLoading();
            NavigationActionsService.showErrorPopup(error);
          },
        }),
      );
    }
  };

  const onPressActivePopUp = () => {
    setShowPopup(false);
    reloadData();
  };

  const reloadData = () => {
    handleRefresh();
    sectionListRef.current &&
      sectionListRef.current.scrollToLocation({
        sectionIndex: 0,
        itemIndex: 0,
        viewPosition: 0,
        animated: true,
      });
  };

  const renderHeader = () => {
    return <CustomHeader leftImage={BACK} leftAction={onBack} title={translate('order.orders')} />;
  };

  const renderSection = ({ section }: { section: SectionListData<ICustomOrder> }) => {
    const index = sectionTitleList.indexOf(section.title);
    const status = orderList?.results[index] ? orderList?.results[index].status_label : '';
    const orderId = orderList?.results[index] && orderList.results[index].id;
    return <OrderSection title={section.title} status={status} onPressPayment={onPressSectionPayment.bind(undefined, orderId)} />;
  };

  const renderFooter = () => {
    return loading && orderList && orderList.count > 0 ? <ActivityIndicator color={colors.WHITE} /> : null;
  };

  const renderItem = ({ item }: { item: ICustomOrder }) => {
    const { orderLine, date_placed } = item;
    const { product, quantity, price_incl_tax_excl_discounts } = orderLine;
    const { images } = product;
    const image = images && images[0];

    return (
      <OrdersItem
        url={image && image.original}
        title={product && product.title}
        price={price_incl_tax_excl_discounts.toString()}
        date={date_placed && formatDate(date_placed)}
        quantity={quantity.toString()}
      />
    );
  };

  const renderRefreshControl = () => {
    return <RefreshControl tintColor={colors.WHITE} refreshing={isRefreshing} onRefresh={handleRefresh} />;
  };

  const renderList = () => {
    return (
      <SectionList
        ref={sectionListRef}
        style={{ flex: 1 }}
        keyExtractor={index => index.toString()}
        sections={data}
        renderItem={renderItem}
        renderSectionHeader={renderSection}
        refreshControl={renderRefreshControl()}
        ListEmptyComponent={<EmptyData />}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    );
  };

  return (
    <Container>
      <CustomPopup text={translate('order.order_success')} loading={isShowPopup} onPressRedButton={onPressActivePopUp} />
      <View style={{ flex: 1 }}>
        {renderHeader()}
        <View style={styles.container}>{renderList()}</View>
      </View>
    </Container>
  );
};

export default Orders;
