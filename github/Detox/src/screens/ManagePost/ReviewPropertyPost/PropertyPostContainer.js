/* eslint-disable react-hooks/exhaustive-deps */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useAnalytics} from '@segment/analytics-react-native';
import isEmpty from 'lodash/isEmpty';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Text, View} from 'react-native';
import {useSelector} from 'react-redux';

import {AppContext} from '../../../appData/appContext/useAppContext';
import {getUserId} from '../../../appData/user/selectors';
import {
  COMMENT_OBJECT_TYPES,
  GUARANTEE_CONTRACT_STATUS,
  SEARCH_TYPE_INDEX,
} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';
import CommentComponents from '../../../components/CommentComponents';
import ImageSlider from '../../../components/Slider/ImageSlider';
import {useOpenAgentDetail} from '../../../hooks/useOpenAgentDetail';
import {getTransactionDateTimeString} from '../../../utils/TimerCommon';
import useGetPanoramaByCode from '../../ImagePanorama/hooks/useGetPanoramaByCode';
import {PanoramaApprovalStatuses, PanoramaFormTypes} from '../../ImagePanorama/PanoramaContants';
import ScreenIds from '../../ScreenIds';
import {Category, ClickLocation, TrackingActions} from '../../WithSegment';
import {useGetC2CSimilarPosts} from '../hooks/useGetSimilarPosts';
import useGetStaffByPostId from '../hooks/useGetStaffByPostId';
import useGetStaffByUserId from '../hooks/useGetStaffByUserId';
import {useGetC2CVisitedPosts} from '../hooks/useGetVisitedPosts';
import PropertyPostUtils from '../PropertyPostUtils';
import PropertyType from '../PropertyType';
import {NewPostContext} from '../useNewPost';
import AgentInfomation from './AgentInfomation';
import ApartmentDetail from './ApartmentDetail';
import BaseDetail from './BaseDetail';
import CommissionRow from './CommissionRow';
import CommissionView from './components/CommissionView';
import {HorizontalInfoCell, ProjectHorizontalInfoCell} from './components/InfoCell';
import PropertyDescription from './components/PropertyDescriptionView';
import PropertyGeneralInfo from './components/PropertyGeneralInfoView';
import SimilarPostsView from './components/SimilarPostsView';
import {VisitedPostView} from './components/VisitedPostView';
import DownloadDocumentView from './DownloadDocumentView';
import PositionAndFacility from './PositionAndFacility';
import styles from './styles';

const RejectedReasonText = ({
  isVisible = true,
  rejectedReason = '',
  requestedUpdateReason = '',
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.rejectedReasonTextContainer}>
      {!!rejectedReason && <Text style={styles.textRejectedReason}>{rejectedReason}</Text>}
      {!!requestedUpdateReason && (
        <Text style={styles.textRejectedReason}>{requestedUpdateReason}</Text>
      )}
    </View>
  );
};

const GuaranteeContractInfo = ({
  contractDocument,
  guaranteedPackageStartTime,
  contractStatus,
  onPressSeeDetail,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.textSectionTitle, METRICS.resetMarginBottom]}>
        {translate('propertyPost.contractAndPayment')}
      </Text>
      <View style={commonStyles.separatorRow16} />
      <DownloadDocumentView document={contractDocument} />
      {guaranteedPackageStartTime && (
        <HorizontalInfoCell
          label={translate(STRINGS.DATE_OF_CONTRACT_SIGNING) + ':'}
          value={getTransactionDateTimeString(guaranteedPackageStartTime)}
        />
      )}
      {contractStatus === GUARANTEE_CONTRACT_STATUS.HAS_PAID && (
        <>
          <View style={commonStyles.separatorRow12} />
          <CustomButton
            onPress={onPressSeeDetail}
            titleColor={COLORS.PRIMARY_A100}
            titleStyle={[FONTS.bold, FONTS.fontSize16]}
            title={translate(STRINGS.VIEW_DETAIL)}
          />
        </>
      )}
    </View>
  );
};

export const PropertyPostContainerView = ({
  propertyPostId,
  postTitle,
  isPrivate,
  postDescription,
  propertyName,
  propertyType,
  length,
  width,
  forSale,
  forRent,
  propertyLocation,
  alleyWidth,
  rentPeriod,
  direction,
  legalStatus,
  propertyStatus,
  mortgaged,
  mortgagedBank,
  isCreatedUser,
  capetAreas,
  numberOfFloor,
  b2C2CProjectId,
  b2C2CProjectInfo,
  projectInfo,
  freeTextProject,
  balconyDirection,
  tower,
  floor,
  staffInfo,
  showRejectedReason,
  showUpdatingReason,
  rejectedReason,
  requestedUpdatingReason,
  isShowGoogleStreetView,
  address,
  propertyCode,
  rating,
  comments,
  price,
  priceRaw,
  pricePerSquare,
  buildingArea,
  commissionRaw,
  commissionCurrenyUnit,
  commissionBuyer,
  commissionSeller,
  negotiable,
  guaranteedPackage,
  coordinate,
  nearFacility,
  internalFacility,
  createdDate,
  staffInfoLoading,
  sellerInfo,
  statuses,
  imagesForGallery,
  isPreview,
  viewByOtherMode,
  openAgentDetail,
  navigation,
  onPressStreetView,
  show3D,
  onPress3D,
  commentRef,
  onGeneralViewRender = () => {},
  onContactViewRender = () => {},
  onDetailInfoViewRender = () => {},
  onFacilityViewRender = () => {},
  onCommentViewRender = () => {},
  onSimilarPostsRender = () => {},
  onVisitedPostsRender = () => {},
  onPressSimilarPost = () => {},
  onPressViewCommissionDetail = () => {},
  similarPosts,
  visitedPosts,
  onLoadMoreSimilarPosts,
  loadingSimilarPosts,
  onInteractionWithSimilarPost,
  isTesting,
  onViewMoreSimilarPosts,
  actionInteractionVisitedItem,
  isViewMoreVisibleVisitedPosts,
  onViewMoreVisitedPosts,
  onPressCall,
  onPressChat,
}) => {
  const onPressGuaranteedPackageDetail = () => {
    navigation.navigate(ScreenIds.GuaranteeContractDetail);
  };

  const showFacilitySection =
    !!coordinate?.latitude || !!internalFacility?.length || !!nearFacility?.length;

  const onPressProjectDetail = () => {
    navigation.navigate(ScreenIds.ProjectDetail, {
      projectId: b2C2CProjectInfo.b2CProjectId ?? '',
    });
  };

  const isShowCommentSection = commentRef?.current?.isActive;

  return (
    <>
      <View onLayout={onGeneralViewRender}>
        <RejectedReasonText
          isVisible={showRejectedReason || showUpdatingReason}
          rejectedReason={showRejectedReason && rejectedReason}
          requestedUpdateReason={showUpdatingReason && requestedUpdatingReason}
        />
        <ImageSlider
          images={imagesForGallery}
          onPressStreetView={onPressStreetView}
          onPress3D={onPress3D}
          showStreetView={isShowGoogleStreetView}
          show3D={show3D}
          isTesting={isTesting}
        />
        <View style={styles.propertyGeneralInfoContainer}>
          <PropertyGeneralInfo
            postTitle={postTitle}
            address={address}
            propertyCode={propertyCode}
            rating={rating}
            comments={comments}
            status={statuses[1]}
            createdDate={createdDate}
          />
          <CommissionRow
            hide={!forSale}
            price={price}
            buildingArea={buildingArea}
            pricePerSquare={pricePerSquare}
          />
        </View>
        <View style={commonStyles.separatorRow} />
        <CommissionView
          commission={commissionRaw}
          commissionCurrencyUnit={commissionCurrenyUnit}
          commissionBuyer={commissionBuyer}
          commissionSeller={commissionSeller}
          negotiable={negotiable}
          price={priceRaw}
          onPressViewDetail={onPressViewCommissionDetail}
        />
        {!viewByOtherMode &&
          PropertyPostUtils.getShouldShowGuaranteeContractView(guaranteedPackage) && (
            <>
              <View style={commonStyles.separatorRow8} />
              <GuaranteeContractInfo
                {...guaranteedPackage}
                onPressSeeDetail={onPressGuaranteedPackageDetail}
              />
            </>
          )}
      </View>
      <View
        style={[
          styles.sectionContainer,
          METRICS.horizontalPadding,
          METRICS.smallNormalVerticalPadding,
        ]}
        onLayout={onContactViewRender}>
        {PropertyPostUtils.getVisibleAgentView({
          staffInfo,
          staffInfoLoading,
          sellerInfo,
          viewByOtherMode,
          isPreview,
        }) && (
          <>
            <Text style={[styles.textSectionTitle, HELPERS.fill]}>
              {viewByOtherMode
                ? translate('propertyPost.poster')
                : translate('propertyPost.consultant')}
            </Text>
            <AgentInfomation
              viewOwner={isPreview || !viewByOtherMode}
              onPressAvatar={openAgentDetail}
              onPressName={openAgentDetail}
              state={isPreview || !viewByOtherMode ? staffInfo : sellerInfo}
              showUsersGroup={viewByOtherMode}
              showContactButtons={!isPreview && !viewByOtherMode}
              navigation={navigation}
              onCallCallback={onPressCall}
              onChatCallback={onPressChat}
            />
          </>
        )}
      </View>
      <View
        style={[styles.sectionContainer, METRICS.horizontalPadding, METRICS.smallNormalPaddingTop]}
        onLayout={onDetailInfoViewRender}>
        <Text style={[styles.textSectionTitle, METRICS.resetMarginBottom]}>
          {translate('propertyPost.detailInfo')}
        </Text>
        <PropertyDetail
          navigation={navigation}
          propertyName={propertyName}
          propertyType={propertyType}
          length={length}
          width={width}
          propertyLocation={propertyLocation}
          forRent={forRent}
          alleyWidth={alleyWidth}
          rentPeriod={rentPeriod}
          direction={direction}
          legalStatus={legalStatus}
          propertyStatus={propertyStatus}
          mortgaged={mortgaged}
          mortgagedBank={mortgagedBank}
          isCreatedUser={isCreatedUser}
          capetAreas={capetAreas}
          numberOfFloor={numberOfFloor}
          {...projectInfo}
          {...b2C2CProjectInfo}
          b2C2CProjectId={b2C2CProjectId}
          freeTextProject={freeTextProject}
          balconyDirection={balconyDirection}
          tower={tower}
          floor={floor}
          createdDate={createdDate}
          onPressProjectDetail={onPressProjectDetail}
        />
        <View style={[styles.separatorLine, METRICS.mediumVerticalMargin]} />
        <PropertyDescription postDescription={postDescription} />
      </View>
      <View style={[styles.sectionContainer, METRICS.resetMargin]} onLayout={onFacilityViewRender}>
        {showFacilitySection && (
          <>
            <View
              style={[styles.separatorLine, METRICS.mediumVerticalMargin, METRICS.horizontalMargin]}
            />
            <PositionAndFacility
              coordinate={coordinate}
              nearFacility={nearFacility}
              internalFacility={internalFacility}
            />
            <View style={METRICS.smallNormalMarginBottom} />
          </>
        )}
      </View>
      {!isPrivate && !isPreview && !isTesting && (
        <View
          style={
            isShowCommentSection && [
              styles.sectionContainer,
              METRICS.horizontalPadding,
              METRICS.smallNormalVerticalPadding,
            ]
          }
          onLayout={onCommentViewRender}>
          <CommentComponents
            ref={commentRef}
            customStyle={{backgroundColor: COLORS.NEUTRAL_WHITE}}
            objectTitle={postTitle}
            objectId={propertyPostId}
            feedObjectTypeId={COMMENT_OBJECT_TYPES.POST}
          />
        </View>
      )}
      {!isCreatedUser && !isPrivate && !isPreview && similarPosts.length > 0 && (
        <View
          style={[
            styles.sectionContainer,
            METRICS.smallNormalVerticalPadding,
            METRICS.mediumPaddingBottom,
          ]}
          onLayout={onSimilarPostsRender}>
          <SimilarPostsView
            posts={similarPosts}
            loading={loadingSimilarPosts}
            onPressLoadMore={onLoadMoreSimilarPosts}
            onPressViewMore={onViewMoreSimilarPosts}
            onInteractionWithPost={onInteractionWithSimilarPost}
            onPressSimilarPost={onPressSimilarPost}
            isTesting={isTesting}
          />
        </View>
      )}
      {!!visitedPosts?.length && !isPreview && (
        <View
          style={[styles.sectionContainer, METRICS.smallNormalVerticalPadding]}
          onLayout={onVisitedPostsRender}>
          <VisitedPostView
            posts={visitedPosts}
            isViewMoreVisible={isViewMoreVisibleVisitedPosts}
            onViewMore={onViewMoreVisitedPosts}
            actionInteractionVisitedItem={actionInteractionVisitedItem}
          />
        </View>
      )}
    </>
  );
};

const PropertyDetail = ({
  propertyName,
  propertyType,
  length,
  width,
  forRent,
  propertyLocation,
  alleyWidth,
  rentPeriod,
  direction,
  legalStatus,
  propertyStatus,
  mortgaged,
  mortgagedBank,
  isCreatedUser,
  capetAreas,
  numberOfFloor,
  b2C2CProjectName,
  b2C2CProjectId,
  b2CProjectId,
  freeTextProject,
  onPressProjectDetail,
  balconyDirection,
  tower,
  floor,
}) => {
  const ProjectItem = () => {
    if (b2C2CProjectId) {
      return (
        <ProjectHorizontalInfoCell
          label={translate(STRINGS.PROJECT)}
          value={b2C2CProjectName}
          onPress={onPressProjectDetail}
          isActive={!!b2CProjectId}
        />
      );
    }
    if (isEmpty(freeTextProject)) {
      return null;
    }
    return <HorizontalInfoCell label={translate(STRINGS.PROJECT)} value={freeTextProject} />;
  };

  if (propertyType === PropertyType.apartment) {
    return (
      <ApartmentDetail
        tower={tower}
        floor={floor}
        legalStatus={legalStatus}
        mortgaged={mortgaged}
        mortgagedBank={mortgagedBank}
        isCreatedUser={isCreatedUser}
        rentPeriod={rentPeriod}
        forRent={forRent}
        length={length}
        width={width}
        balconyDirection={balconyDirection}
        direction={direction}
        propertyName={propertyName}
        propertyStatus={propertyStatus}
        ProjectItem={<ProjectItem />}
      />
    );
  } else {
    return (
      <BaseDetail
        propertyName={propertyName}
        propertyType={propertyType}
        length={length}
        width={width}
        propertyLocation={propertyLocation}
        forRent={forRent}
        alleyWidth={alleyWidth}
        rentPeriod={rentPeriod}
        direction={direction}
        legalStatus={legalStatus}
        propertyStatus={propertyStatus}
        mortgaged={mortgaged}
        mortgagedBank={mortgagedBank}
        isCreatedUser={isCreatedUser}
        capetAreas={capetAreas}
        numberOfFloor={numberOfFloor}
        ProjectItem={<ProjectItem />}
      />
    );
  }
};

const getInitState = (moduleState, masterData, currentUserId, viewByOtherMode, isPreview) => {
  const initState = {
    ...moduleState,
    ...PropertyPostUtils.mappingState(
      masterData,
      moduleState,
      currentUserId,
      isPreview,
      viewByOtherMode,
    ),
    viewByOtherMode,
    isPreview,
    staffInfoLoading: true,
  };
  return initState;
};

const PropertyPostContainer = ({
  commentRef,
  showEditPanoramaButton,
  viewByOtherMode,
  onGeneralViewRender,
  onContactViewRender,
  onDetailInfoViewRender,
  onFacilityViewRender,
  onCommentViewRender,
  onSimilarPostsRender,
  onPressSimilarPost,
  onPressViewCommissionDetail,
  isPreview,
  onVisitedPostsRender,
  onRefresh,
}) => {
  const {track} = useAnalytics();
  const isFocused = useIsFocused();
  const {state: moduleState} = useContext(NewPostContext);
  const currentUserId = useSelector(getUserId);
  const {getMasterData, getIsLoggedIn} = useContext(AppContext);
  const masterData = getMasterData();
  const isLogin = getIsLoggedIn();

  const initState = getInitState(
    moduleState,
    masterData,
    currentUserId,
    viewByOtherMode,
    isPreview,
  );
  const navigation = useNavigation();
  const [state, setState] = React.useState(initState);
  const [panoramaDetail, setPanoramaDetail] = useState(null);
  const {propertyPostId, propertyTypeId, propertyAddress, sellerInfo, panoramaImageCode} =
    state.originState ?? {};

  const {getSimilarPosts, items: posts, loading, loadMore} = useGetC2CSimilarPosts();

  const {
    getVisitedPosts,
    items: visitedPosts,
    onViewMoreVisitedPosts,
    isViewMoreVisibleVisitedPosts,
    actionInteractionVisitedItem,
  } = useGetC2CVisitedPosts({currentPropertyPostId: state.originState.propertyPostId});

  const startGetSimilarPosts = () => {
    if (propertyPostId && propertyTypeId && !isPreview) {
      getSimilarPosts({
        propertyPostId,
        propertyType: propertyTypeId,
        cityId: propertyAddress?.cityId,
        districtId: propertyAddress?.districtId,
      });
    }
  };

  const [startGetPanoramaByCode] = useGetPanoramaByCode(setPanoramaDetail);

  useEffect(() => {
    if (panoramaImageCode) {
      startGetPanoramaByCode(panoramaImageCode);
    }
  }, [panoramaImageCode]);

  const show3D = useMemo(() => {
    if (showEditPanoramaButton) {
      return showEditPanoramaButton;
    }

    return (
      panoramaDetail?.panoramaImageDto?.panoramaImageApprovalStatusName ===
      PanoramaApprovalStatuses.APPROVED
    );
  }, [panoramaDetail, showEditPanoramaButton]);

  useEffect(startGetSimilarPosts, [propertyPostId]);

  const startGetVisitedPosts = () => {
    getVisitedPosts();
  };

  useEffect(() => {
    startGetVisitedPosts();
  }, [propertyPostId, isLogin]);

  useEffect(() => {
    if (isFocused) {
      setState({
        ...moduleState,
        ...PropertyPostUtils.mappingState(
          masterData,
          moduleState,
          currentUserId,
          isPreview,
          viewByOtherMode,
        ),
      });
    }
  }, [moduleState.originState]);

  const imagesForGallery = PropertyPostUtils.getMapImages(state?.images);
  const numberImages = `${state.images?.length} ${translate(STRINGS.IMAGE).toLowerCase()}`;
  const {openAgentDetail} = useOpenAgentDetail({
    agentId: sellerInfo?.sellerId,
    isAgent: sellerInfo?.isAgent,
  });

  const {getStaffByPostId} = useGetStaffByPostId();

  const {getStaffByUserId} = useGetStaffByUserId();

  useEffect(() => {
    if (!isEmpty(moduleState?.staffInfo)) {
      setState({
        ...moduleState,
        ...PropertyPostUtils.mappingState(
          masterData,
          moduleState,
          currentUserId,
          isPreview,
          viewByOtherMode,
        ),
        staffInfo: moduleState?.staffInfo,
        staffInfoLoading: false,
      });
    }
  }, [moduleState?.staffInfo]);

  useEffect(() => {
    if (!isEmpty(propertyPostId) && !viewByOtherMode && !isPreview) {
      // post is published
      getStaffByPostId(propertyPostId);
    } else if (isPreview && moduleState.step3Data?.staffUserId) {
      // post is saved
      getStaffByUserId(moduleState.step3Data?.staffUserId);
    }
  }, [propertyPostId]);

  const onShowStreetView = () => {
    const coordinate = {
      longitude: state.longitude,
      latitude: state.latitude,
      radius: 0,
    };
    navigation.navigate(ScreenIds.Streetview, {coordinate});
  };

  const onPress3D = () => {
    if (panoramaImageCode && propertyPostId) {
      navigation.navigate(ScreenIds.ImagePanoramaReview, {
        propertyPostId,
        panoramaImageCode,
        showEditPanoramaButton,
      });
    } else {
      navigation.navigate(ScreenIds.ImagePanoramaUpdate, {
        propertyPostId,
        formType: PanoramaFormTypes.CREATE,
        onCreateSuccess: () => {
          onRefresh();
        },
      });
    }
  };

  const statuses = PropertyPostUtils.getPropertyStatuses({
    propertyPostApprovalStatusName: state?.approvalStatus?.propertyPostApprovalStatusName,
    propertyPostApprovalStatusDescription:
      state?.approvalStatus?.propertyPostApprovalStatusDescription,
    guaranteedPackageStatus:
      state?.guaranteedPackage?.guaranteedPackageStatus || state?.guaranteedPackageStatus,
    guaranteedPackageEndTime:
      state?.guaranteedPackage?.guaranteedPackageEndTime || state?.guaranteedPackageEndTime,
    postServiceType: state?.postServiceType,
    showApprovalStatus: state.showApprovalStatus,
    forSale: state?.forSale,
    forRent: state?.forRent,
    isRented: state?.isRented,
    isSold: state?.isSold,
    viewByOtherMode,
  });

  const onPressViewMoreSimilarPosts = () => {
    const originPropertyTypeId = state.originState.propertyTypeId;
    const originPropertyAddress = state.originState.propertyAddress;
    navigation.push(ScreenIds.Search, {
      tabIndex: SEARCH_TYPE_INDEX.C2C,
      propertyTypeJson: [{id: originPropertyTypeId}],
      placeJson: [
        {
          city: {
            checked: true,
            id: originPropertyAddress?.cityId,
            name: originPropertyAddress?.cityName,
          },
          districts: [
            {
              checked: true,
              id: originPropertyAddress?.districtId,
              name: originPropertyAddress?.districtName,
            },
          ],
        },
      ],
    });
  };

  const onPressCall = () => {
    track(TrackingActions.callButtonClicked, {
      category: Category.buy,
      click_location: ClickLocation.productPage,
    });
  };

  const onPressChat = () => {
    track(TrackingActions.messagesButtonClicked, {
      category: Category.buy,
      click_location: ClickLocation.productPage,
    });
  };

  return (
    <PropertyPostContainerView
      {...state}
      numberImages={numberImages}
      imagesForGallery={imagesForGallery}
      statuses={statuses}
      isPreview={isPreview}
      navigation={navigation}
      commentRef={commentRef}
      viewByOtherMode={viewByOtherMode}
      openAgentDetail={openAgentDetail}
      onPressStreetView={onShowStreetView}
      show3D={show3D}
      onPress3D={onPress3D}
      onGeneralViewRender={onGeneralViewRender}
      onContactViewRender={onContactViewRender}
      onDetailInfoViewRender={onDetailInfoViewRender}
      onFacilityViewRender={onFacilityViewRender}
      onCommentViewRender={onCommentViewRender}
      onSimilarPostsRender={onSimilarPostsRender}
      onPressSimilarPost={onPressSimilarPost}
      onPressViewCommissionDetail={onPressViewCommissionDetail}
      similarPosts={posts}
      onLoadMoreSimilarPosts={loadMore}
      onViewMoreSimilarPosts={onPressViewMoreSimilarPosts}
      loadingSimilarPosts={loading}
      onInteractionWithSimilarPost={startGetSimilarPosts}
      onVisitedPostsRender={onVisitedPostsRender}
      visitedPosts={visitedPosts}
      actionInteractionVisitedItem={actionInteractionVisitedItem}
      isViewMoreVisibleVisitedPosts={isViewMoreVisibleVisitedPosts}
      onViewMoreVisitedPosts={onViewMoreVisitedPosts}
      onPressCall={onPressCall}
      onPressChat={onPressChat}
    />
  );
};

export default PropertyPostContainer;
