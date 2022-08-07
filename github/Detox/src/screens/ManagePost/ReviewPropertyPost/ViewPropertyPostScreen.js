import {useAnalytics} from '@segment/analytics-react-native';
import isEqual from 'lodash/isEqual';
import React, {useContext, useMemo, useRef} from 'react';
import {Image, Keyboard, RefreshControl, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';

import {AppContext} from '../../../appData/appContext/useAppContext';
import {addItemVisitedC2C} from '../../../appData/c2c/actions';
import {getUserId} from '../../../appData/user/selectors';
import {CommissionCurrencyUnit, CONSTANTS, UPDATE_ITEM_STRATEGY} from '../../../assets/constants';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {Message} from '../../../assets/localize/message/Message';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import BaseScreen from '../../../components/BaseScreen';
import CustomFooterButtons from '../../../components/Button/CustomFooterButtons';
import FollowButton from '../../../components/Button/FollowButton';
import CenterText from '../../../components/CenterText';
import ScrollViewWithAnimatedHeader from '../../../components/List/ScrollViewWithAnimatedHeader';
import ModalPopup from '../../../components/Modal/ModalPopup';
import ModalWithModalize, {useModalize} from '../../../components/Modal/ModalWithModalize';
import {extractAddressData} from '../../../utils/DataProcessUtil';
import {getPropertyPostApprovalStatusById, getPropertyTypeById} from '../../../utils/GetMasterData';
import {getImageSize, IMAGE_RATIO, SCREEN_SIZE} from '../../../utils/ImageUtil';
import {useLogin} from '../../Auth/useLogin';
import {useMount} from '../../commonHooks';
import {formatDirection} from '../../Home/TopenerOfMonth/types';
import ScreenIds from '../../ScreenIds';
import {Category, ClickLocation, TrackingActions} from '../../WithSegment';
import ContactFooter from '../Contact/ContactFooter';
import PostSuccessScreen from '../PostSuccess/PostSuccessScreen';
import PropertyPostUtils, {
  VIEW_PROPERTY_POST_HEADER_POSITION_CUSTOMER,
  VIEW_PROPERTY_POST_HEADER_POSITION_OWNER,
} from '../PropertyPostUtils';
import {initialState as newPostInitialState, NewPostContext} from '../useNewPost';
import {useCheckPostCanBeEdited, useGetPropertyPostDetail} from '../usePropertyPostActions';
import ClosePropertyPostPopup from './ClosePropertyPostPopup';
import CommissionDetailModalContainer from './components/CommissionDetailModalContainer';
import PropertyPostContainer from './PropertyPostContainer';
import {ReportFeature} from './ReportFeature';
import {ShareControl} from './ShareControl';

const IMAGE_SIZE = getImageSize(SCREEN_SIZE.WIDTH, IMAGE_RATIO.R16x9);

const ViewPropertyPostScreen = ({navigation, route}) => {
  const {propertyPostId, viewByOtherMode, afterContactSuccess} = route?.params || {};
  const {track} = useAnalytics();
  const [showClosePost, setShowClosePost] = React.useState(false);
  const {state, setState, setInputFieldState, resetEditDataToOriginState} =
    useContext(NewPostContext);
  const {getMasterData, showErrorAlert, showAppModal} = useContext(AppContext);
  const [showClosePostButton, setShowClosePostButton] = React.useState(false);
  const [showEditPostButton, setShowEditPostButton] = React.useState(false);
  const commentRef = useRef(null);
  const canRequestSupport = useRef(null);
  const [showSuccessPopup, setShowSuccessPopup] = React.useState(false);
  const userId = useSelector(getUserId);
  const dispatch = useDispatch();
  const {notLoggedIn} = useLogin();

  const [sections, setSections] = React.useState({});
  const headerNavs = useRef({});

  const postInteractionModal = useRef(null);
  const commissionDetailModal = useRef(null);

  const {openModal: openCommissionDetailModal, closeModal: closeCommissionDetailModal} =
    useModalize(commissionDetailModal);

  const isAlreadyContactSuccess =
    afterContactSuccess ||
    (state.alreadyContactedToBuy && state.alreadyContactedToRent) ||
    (state.originState?.forSale && !state.originState?.forRent && state.alreadyContactedToBuy) ||
    (state.originState?.forRent && !state.originState?.forSale && state.alreadyContactedToRent);

  const {getPropertyPostDetail, loading} = useGetPropertyPostDetail({
    propertyPostId: propertyPostId,
    onSuccess: onSuccessGetPostDetail,
  });

  const {checkProperty} = useCheckPostCanBeEdited();

  function onSuccessGetPostDetail(postDetail) {
    //check if view current user post or other user post
    const createdPostUserId = postDetail.originState?.createdByUserId;
    const isViewingMyPost = createdPostUserId && userId && createdPostUserId === userId;

    if (isViewingMyPost && !viewByOtherMode) {
      //only display close post button for selling post
      const {shouldShow} = PropertyPostUtils.canClosePost(getMasterData(), postDetail.originState);
      const canEditPost = PropertyPostUtils.canEditPost(getMasterData(), postDetail.originState);

      setShowClosePostButton(shouldShow);
      setShowEditPostButton(canEditPost);
      canRequestSupport.current = PropertyPostUtils.canRequestSupport(
        getMasterData(),
        postDetail.originState,
      );
    }

    if (isEqual(postDetail, newPostInitialState)) {
      showErrorAlert(translate(Message.POM_ERR_MOBILE_001));
    }

    let emptyValue;

    track(TrackingActions.productViewed, {
      category: Category.buy,
      address: extractAddressData(postDetail.originState?.propertyAddress) ?? '',
      name: postDetail.originState?.postTitle ?? '',
      property_code: postDetail.originState?.propertyCode ?? '',
      property_type:
        getPropertyTypeById(getMasterData(), postDetail.originState?.propertyTypeId)
          ?.propertyTypeDescription ?? '',
      property_status:
        getPropertyPostApprovalStatusById(
          getMasterData(),
          postDetail.originState?.propertyPostApprovalStatusId,
        )?.propertyPostApprovalStatusDescription ?? '',
      sale_price: postDetail.originState?.price,
      sale_commission: PropertyPostUtils.parseCommission(
        postDetail?.originState?.commission,
        postDetail?.originState?.saleCommissionCurrencyUnitId,
        CommissionCurrencyUnit.PERCENTAGE,
      ),
      image_url: postDetail?.images?.map(e => e.uri || e.url)?.shift() || '',
      apartment_area: postDetail.originState?.buildingArea || emptyValue,
      direction: formatDirection(postDetail.originState?.direction),
      bedroom_number: postDetail.originState?.numberOfBedrooms || emptyValue,
      bathroom_number: postDetail.originState?.numberOfBathrooms || emptyValue,
      length: postDetail.originState?.length || emptyValue,
      width: postDetail.originState?.width || emptyValue,
      block: postDetail.originState?.blockName || emptyValue,
      floor: postDetail.originState?.numberOfFloor || emptyValue,
      rent_price: postDetail.originState?.propertyPostForRentDto?.rentPrice ?? 0,
      rent_commission: PropertyPostUtils.parseCommission(
        postDetail.originState?.propertyPostForRentDto?.rentCommission,
        postDetail.originState?.propertyPostForRentDto?.rentCommissionCurrencyUnitId,
        CommissionCurrencyUnit.PERCENTAGE,
      ),
    });
  }

  const loadData = () => {
    getPropertyPostDetail(propertyPostId);
    commentRef?.current?.refreshComment();
  };

  useMount(() => {
    if (notLoggedIn) {
      dispatch(addItemVisitedC2C(propertyPostId));
    }
    loadData();
  });

  const onPressEdit = () => {
    checkProperty({
      propertyPostId,
      onError: error => {
        if (error?.errorMessageCode === Message.CTD_ERR_026) {
          showAppModal({
            isVisible: true,
            title: translate(STRINGS.NOTIFICATION),
            message: translate(Message.CTD_ERR_026),
          });
        } else {
          showAppModal({
            isVisible: true,
            title: translate(STRINGS.NOTIFICATION),
            message: translate(error?.errorMessage),
          });
        }
      },
      onSuccess: isValid => {
        if (isValid) {
          resetEditDataToOriginState();
          showAppModal({
            isVisible: true,
            title: translate(STRINGS.NOTIFICATION),
            message: translate('propertyPost.newPost.confirmUpdatePropertyPost'),
            okText: translate(STRINGS.UPDATE),
            onOkHandler: () => {
              navigation.navigate(ScreenIds.GeneralDescription);
            },
            cancelText: translate(STRINGS.CANCEL),
          });
        }
      },
    });
  };

  const onPressClosePost = () => {
    setShowClosePost(true);
  };

  const onDismissPopup = () => {
    setShowClosePost(false);
  };

  const onClosePostSuccess = () => {
    setShowClosePost(false);
    setShowSuccessPopup(true);
  };

  const onReviewClosedPost = () => {
    loadData();
    setInputFieldState({shouldRefreshList: true});
    navigation.navigate(ScreenIds.ManagePost);
    navigation.navigate(ScreenIds.YourPropertyPost);
  };

  const openPostInteractionModal = () => {
    Keyboard.dismiss();
    postInteractionModal.current?.open();
  };

  const needShowLike = () => {
    const showShareLike = PropertyPostUtils.canShowShareLike(
      getMasterData(),
      state.originState?.propertyPostApprovalStatusId,
    );
    return !loading && propertyPostId && showShareLike;
  };

  const onViewRender = (event, sectionName) => {
    const height = event.nativeEvent.layout.height;
    const position = event.nativeEvent.layout.y;

    if (
      headerNavs.current[sectionName]?.height !== height ||
      headerNavs.current[sectionName]?.position !== position
    ) {
      headerNavs.current = {...headerNavs.current, [sectionName]: {height, position}};

      const headerLength = viewByOtherMode
        ? VIEW_PROPERTY_POST_HEADER_POSITION_CUSTOMER.length - 3 // facility ,similar + visited posts may be null
        : VIEW_PROPERTY_POST_HEADER_POSITION_OWNER.length - 1; // facility may be null;

      if (Object.keys(headerNavs.current).length >= headerLength) {
        setSections(headerNavs.current);
      }
    }
  };

  const onPressSimilarPost = postId => {
    navigation.push(ScreenIds.ViewPropertyPost, {
      propertyPostId: postId,
      viewByOtherMode: true,
    });
  };

  const renderFollowButton = () => {
    const onSucceedFollow = () => {
      track(TrackingActions.productFollowClicked, {
        click_location: ClickLocation.product,
        category: Category.buy,
        name: state?.originState?.postTitle,
        property_type:
          getPropertyTypeById(getMasterData(), state.originState?.propertyTypeId)
            ?.propertyTypeDescription ?? '',
      });

      setState({
        ...state,
        originState: {
          ...state.originState,
          isFollowed: !state.originState.isFollowed,
          totalFollower: state.originState.totalFollower + 1,
        },
      });
    };

    const onUnFollowSuccess = () => {
      setState({
        ...state,
        originState: {
          ...state.originState,
          isFollowed: !state.originState.isFollowed,
          totalFollower: state.originState.totalFollower - 1,
        },
      });
    };

    if (state?.originState?.postTitle && state?.originState?.propertyTypeId) {
      const heartIcon = state.originState.isFollowed
        ? IMAGES.IC_HEART_FILL
        : IMAGES.IC_HEART_LINEAR;
      return (
        <FollowButton
          onFollowSuccess={onSucceedFollow}
          onUnFollowSuccess={onUnFollowSuccess}
          followStrategy={UPDATE_ITEM_STRATEGY.NORMAL}
          isFollowed={state.originState.isFollowed}
          isHeartIcon={true}
          propertyPostId={propertyPostId}
          customIcon={heartIcon}
          followerCount={state?.originState?.totalFollower}
        />
      );
    }
    return null;
  };

  const onPressViewCommissionDetail = () => {
    openCommissionDetailModal();
  };

  const modals = (
    <>
      <ModalWithModalize getModalRef={postInteractionModal} handlePosition="outside">
        <View style={styles.postInteractionModalContainer}>
          <ShareControl state={state} setState={setState} />
          <View style={commonStyles.separatorRow24} />
          <ReportFeature propertyPostId={propertyPostId} initReported={state.reported} />
        </View>
      </ModalWithModalize>
      <ModalWithModalize getModalRef={commissionDetailModal} handlePosition="outside">
        <CommissionDetailModalContainer
          totalAmount={PropertyPostUtils.calculateTotalCommissionAmount(
            state?.originState?.price,
            state?.originState?.commission,
            state?.originState?.saleCommissionCurrencyUnitId,
          )}
          buyerPercentage={state?.originState?.commissionBuyer}
          sellerPercentage={state?.originState?.commissionSeller}
          onPressClose={closeCommissionDetailModal}
        />
      </ModalWithModalize>
    </>
  );

  const renderBodyView = () => (
    <>
      {loading ? (
        <CenterText loading={loading} />
      ) : (
        <PropertyPostContainer
          commentRef={commentRef}
          showEditPanoramaButton={showEditPostButton}
          viewByOtherMode={viewByOtherMode}
          onGeneralViewRender={event =>
            onViewRender(event, translate('propertyPost.headerNav.general'))
          }
          onContactViewRender={event =>
            onViewRender(
              event,
              viewByOtherMode
                ? translate('propertyPost.headerNav.contact')
                : translate('propertyPost.headerNav.support'),
            )
          }
          onDetailInfoViewRender={event =>
            onViewRender(event, translate('propertyPost.headerNav.detailInfo'))
          }
          onFacilityViewRender={event =>
            onViewRender(event, translate('propertyPost.headerNav.facility'))
          }
          onCommentViewRender={event =>
            onViewRender(event, translate('propertyPost.headerNav.comment'))
          }
          onSimilarPostsRender={event =>
            onViewRender(event, translate('propertyPost.headerNav.similarPost'))
          }
          onVisitedPostsRender={event =>
            onViewRender(event, translate('propertyPost.headerNav.visitedPost'))
          }
          onPressSimilarPost={onPressSimilarPost}
          onPressViewCommissionDetail={onPressViewCommissionDetail}
          onRefresh={loadData}
        />
      )}
    </>
  );

  const content = useMemo(renderBodyView, [loading, sections]);

  return (
    <BaseScreen
      title={translate(STRINGS.DETAIL)}
      isBackable={false}
      modals={modals}
      leftComponent={
        <TouchableOpacity
          hitSlop={CONSTANTS.HIT_SLOP}
          onPress={() => navigation.goBack()}
          style={METRICS.smallNormalMarginRight}>
          <Image
            source={IMAGES.ARROW_LEFT_LINEAR}
            style={styles.iconBackHeader}
            resizeMode="contain"
          />
        </TouchableOpacity>
      }
      rightComponent={
        <View style={styles.headerButtonShare}>
          {needShowLike() && viewByOtherMode && (
            <>
              {renderFollowButton()}
              <View style={commonStyles.separatorColumn16} />
              <TouchableOpacity onPress={openPostInteractionModal}>
                <Icon name="more-horiz" size={24} />
              </TouchableOpacity>
            </>
          )}
        </View>
      }>
      <ScrollViewWithAnimatedHeader
        sections={sections}
        threshold={(IMAGE_SIZE.HEIGHT * 2) / 3}
        loading={loading}
        scrollViewProps={{
          keyboardShouldPersistTaps: 'handled',
          contentContainerStyle: HELPERS.fillGrow,
          refreshControl: <RefreshControl refreshing={loading} onRefresh={loadData} />,
        }}>
        {content}
      </ScrollViewWithAnimatedHeader>
      {viewByOtherMode && !!propertyPostId && (
        <ContactFooter
          post={state}
          loading={loading}
          isAlreadyContactSuccess={isAlreadyContactSuccess}
          showConsultantRequestBtn={false}
          showContactBtn={PropertyPostUtils.canContactToBuy(getMasterData(), state, userId)}
        />
      )}
      {!viewByOtherMode && (showEditPostButton || showClosePostButton) && (
        <View style={[commonStyles.footerContainer, commonStyles.borderTop]}>
          <CustomFooterButtons
            nextButtonTitle={translate('propertyPost.editInfo')}
            cancelButtonTitle={
              showClosePostButton
                ? translate('propertyPost.closePost')
                : translate('propertyPost.editInfo')
            }
            cancelTextStyle={{color: COLORS.PRIMARY_A100}}
            onPressNext={onPressEdit}
            onPressCancel={showClosePostButton ? onPressClosePost : onPressEdit}
            hideNextButton={!showClosePostButton}
          />
        </View>
      )}
      {showClosePost && (
        <ModalPopup
          visible={showClosePost}
          onPressOutSide={onDismissPopup}
          animationType="slide"
          contentContainerStyle={styles.containerPopupClose}
          avoidKeyboard={true}>
          <ClosePropertyPostPopup
            propertyPostId={propertyPostId}
            onPressDismiss={onDismissPopup}
            onClosePostSuccess={onClosePostSuccess}
          />
        </ModalPopup>
      )}
      {showSuccessPopup && (
        <ModalPopup
          contentContainerStyle={styles.successPopupStyle}
          visible={showSuccessPopup}
          animationType="slide">
          <PostSuccessScreen
            onPressDismiss={onDismissPopup}
            onReviewPost={onReviewClosedPost}
            title={translate(Message.POM_MES_001)}
            description={''}
          />
        </ModalPopup>
      )}
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  containerPopupClose: {
    justifyContent: 'flex-end',
  },
  successPopupStyle: {
    padding: 0,
    margin: 0,
  },
  headerButtonShare: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  postInteractionModalContainer: {
    width: '100%',
    marginTop: 24,
    marginBottom: 38,
    paddingHorizontal: 16,
  },
  iconBackHeader: {
    width: 24,
    height: 24,
  },
});

export default ViewPropertyPostScreen;
