import isEmpty from 'lodash/isEmpty';
import React, {Fragment, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  LayoutAnimation,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {COMMENT_OBJECT_TYPES, TRANSACTION_MODE} from '../../assets/constants';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS, normal} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import BaseScreen from '../../components/BaseScreen';
import CustomButton from '../../components/Button/CustomButton';
import CenterText from '../../components/CenterText';
import CommentComponents from '../../components/CommentComponents';
import CustomIconButton from '../../components/CustomIconButton';
import DocumentItem from '../../components/DocumentItem';
import ScrollViewWithAnimatedHeader from '../../components/List/ScrollViewWithAnimatedHeader';
import ProjectItem from '../../components/ProjectItem';
import {mapSearchItemUi} from '../../components/SearchProjectItem/types';
import SectionHorizontalList from '../../components/SectionHorizontalList';
import {ShareIcon} from '../../components/ShareIcon';
import {SizeBox} from '../../components/SizeBox';
import TextView from '../../components/TextView';
import {useShare} from '../../hooks/useShare';
import {extractFileName} from '../../utils/DataProcessUtil';
import {downloadFileAzure} from '../../utils/fileHandler';
import {getImageSize, IMAGE_RATIO, SCREEN_SIZE} from '../../utils/ImageUtil';
import {projectPaddingStyle} from '../../utils/RenderUtil';
import FeaturedItem from './FeaturedItem';
import GeneralInfo from './GeneralInfo';
import {
  getProjectLegalAndHandoverMaterialHeaderTitle,
  PROJECT_DETAIL_HEADER_NAV_SORTED,
} from './ProjectDetailUtils';
import ProjectSection from './ProjectSection';
import Selector from './Selector';
import styles from './styles';

const DEFAULT_ITEMS_LIMIT = 5;
const IMAGE_SIZE = getImageSize(SCREEN_SIZE.WIDTH, IMAGE_RATIO.R16x9);

const Sections = ({sectionsInfo, onViewRendered, projectAddress, isTesting}) => {
  return (
    <>
      {sectionsInfo.map(it => {
        return (
          <View key={it.title} onLayout={event => onViewRendered(event, it.title)}>
            <ProjectSection {...it} key={it.title} address={projectAddress} isTesting={isTesting} />
          </View>
        );
      })}
    </>
  );
};

export const ViewBottom = ({
  projectStatus,
  onNeedAdvice,
  onReserve,
  isShowButtonBook,
  notLoggedIn,
  isMemberUser,
}) => {
  const statusCheck =
    projectStatus === TRANSACTION_MODE.BOOKING || projectStatus === TRANSACTION_MODE.DEPOSIT;
  // Giai đoạn sắp mở bán chưa login và member không show button book
  const isShowButtonRight = (statusCheck || notLoggedIn || isMemberUser) && isShowButtonBook;
  const getProjectStatusText = () => {
    switch (projectStatus) {
      case TRANSACTION_MODE.BOOKING:
        if (notLoggedIn) {
          return translate(STRINGS.LOGIN);
        } else if (isMemberUser) {
          return translate(STRINGS.UPGRADE_TO_AGENCY);
        } else {
          return translate(STRINGS.RESERVE);
        }
      case TRANSACTION_MODE.DEPOSIT:
        return translate(STRINGS.CONFIRM);
      default:
        return '';
    }
  };

  return (
    <View style={commonStyles.footerContainer}>
      <CustomButton
        style={isShowButtonRight ? styles.buttonLeft : styles.buttonLeftWithoutMargin}
        titleColor={isShowButtonRight ? COLORS.PRIMARY_A100 : COLORS.NEUTRAL_WHITE}
        titleStyle={{...FONTS.bold}}
        title={translate('common.moreAdvice')}
        onPress={onNeedAdvice}
      />
      {isShowButtonRight && (
        <CustomButton
          style={styles.buttonRight}
          title={getProjectStatusText()}
          onPress={onReserve}
        />
      )}
    </View>
  );
};

const DocumentHeader = ({title, description, isExpanded, onPress, headerBackgroundColor}) => {
  return (
    <TouchableOpacity
      style={[styles.documentListHeader, {backgroundColor: headerBackgroundColor}]}
      onPress={onPress}>
      <View style={[HELPERS.fill, HELPERS.mainSpaceBetween]}>
        <Text style={[commonStyles.blackTextBold12, FONTS.fontSize16]}>{title}</Text>
        <View style={commonStyles.separatorRow4} />
        <Text style={commonStyles.blackText14}>{description}</Text>
      </View>
      <View style={HELPERS.mainCenter}>
        <Image
          source={isExpanded ? IMAGES.ARROW_UP_FILL : IMAGES.ARROW_DOWN_FILL}
          resizeMode="center"
        />
      </View>
    </TouchableOpacity>
  );
};

const DocumentList = ({title, description, files, headerBackgroundColor}) => {
  const [expand, setExpand] = useState(false);

  const onPressHeader = () => {
    LayoutAnimation.configureNext(LayoutAnimation.create(200, 'linear', 'opacity'));
    setExpand(!expand);
  };

  const onItemPress = async (url, fileName) => {
    await downloadFileAzure(url, fileName);
  };

  return (
    <>
      <DocumentHeader
        title={title}
        description={description}
        isExpanded={expand}
        onPress={onPressHeader}
        headerBackgroundColor={headerBackgroundColor}
      />
      <View style={commonStyles.separatorRow4} />
      {expand && (
        <View style={styles.documentContainer}>
          {files.map((e, index) => (
            <Fragment key={e?.name || e?.url || index}>
              {index > 0 && <View style={styles.separatorWhite} />}
              <DocumentItem
                key={extractFileName(e.url)}
                name={extractFileName(e.url)}
                onPress={() => onItemPress(e.url, e?.name || extractFileName(e.url))}
              />
            </Fragment>
          ))}
        </View>
      )}
    </>
  );
};

const LegalAndHandoverDocuments = ({legalDocs, handoverMaterialDocs}) => {
  if (!handoverMaterialDocs?.length && !legalDocs?.length) {
    return null;
  }

  const showLegalDocs = legalDocs?.length > 0;
  const showHandoverMaterialDocs = handoverMaterialDocs?.length > 0;

  const sectionTitle = getProjectLegalAndHandoverMaterialHeaderTitle(
    legalDocs,
    handoverMaterialDocs,
  );

  return (
    <>
      <View style={commonStyles.separatorRow8WithColor} />
      <View style={[METRICS.horizontalPadding, METRICS.smallNormalVerticalPadding]}>
        <Text style={styles.textProjectSection}>{sectionTitle}</Text>
        {showLegalDocs && (
          <>
            <View style={commonStyles.separatorRow16} />
            <DocumentList
              title={translate('project.detail.sections.legalDocument')}
              description={translate('project.detail.sections.legalDocumentDescription')}
              files={legalDocs ?? []}
              headerBackgroundColor={COLORS.BLUE_90}
            />
          </>
        )}
        {showHandoverMaterialDocs && (
          <>
            <View style={commonStyles.separatorRow16} />
            <DocumentList
              title={translate('project.detail.sections.handoverMaterial')}
              description={translate('project.detail.sections.handoverMaterialDescription')}
              files={handoverMaterialDocs ?? []}
              headerBackgroundColor={COLORS.ORANGE_90}
            />
          </>
        )}
      </View>
    </>
  );
};

const ProjectSimilar = ({
  projectSimilar,
  updateProjectSimilar,
  onViewMoreProjectSimilar,
  formatPrice,
  onPressItem,
}) => {
  if (isEmpty(projectSimilar)) {
    return null;
  }
  return (
    <>
      <SectionHorizontalList
        title={translate('project.detail.sections.similarProject')}
        titleStyle={[styles.textProjectSection, {marginBottom: normal}]}
        showViewMore
        isShowTotalCount={false}
        onViewMore={onViewMoreProjectSimilar}
        renderItem={({item, index}) => {
          const mappingItem = mapSearchItemUi(item, formatPrice);
          return (
            <ProjectItem
              actions={{
                updateItem: updateProjectSimilar,
              }}
              onPress={onPressItem}
              style={projectPaddingStyle(index)}
              key={index}
              projectInfo={mappingItem}
            />
          );
        }}
        loading={false}
        keyExtractor={item => `${item.projectId}`}
        maxRenderItemCount={DEFAULT_ITEMS_LIMIT}
        items={projectSimilar}
      />
    </>
  );
};

const SaleProgramDocuments = ({documents}) => {
  if (!documents?.length) {
    return null;
  }

  const onPressDownloadAll = () => {
    documents?.forEach(async e => {
      await downloadFileAzure(e?.url, e?.name);
    });
  };

  const onDownLoadDocument = async (url, name) => {
    await downloadFileAzure(url, name);
  };

  return (
    <>
      <View style={commonStyles.separatorRow8WithColor} />
      <View style={commonStyles.separatorRow16} />
      <TextView
        title={translate('project.detail.sections.saleProgram')}
        titleStyle={styles.textProjectSection}
        containerStyle={styles.projectSectionTitleContainer}
        customRightComponent={
          <TouchableOpacity onPress={onPressDownloadAll}>
            <Text style={styles.textProjectSectionDescription}>
              {translate('common.downloadAll')}
            </Text>
          </TouchableOpacity>
        }
      />
      <View style={[METRICS.horizontalPadding]}>
        {documents.map((e, index) => (
          <Fragment key={e?.url || e?.name || index}>
            {index > 0 && <View style={[styles.separator, METRICS.resetMargin]} />}
            <DocumentItem
              key={extractFileName(e.url)}
              name={extractFileName(e.url)}
              onPress={() => onDownLoadDocument(e.url, e?.name || extractFileName(e.url))}
            />
          </Fragment>
        ))}
      </View>
    </>
  );
};

export const ProjectDetailView = ({
  startYear,
  projectTypeName,
  projectStatusDescription,
  images,
  projectName,
  minPrice,
  commission,
  investorOwnerLogo,
  investorId,
  investorCode,
  investor,
  overallDescription,
  projectType,
  totalArea,
  address,
  projectDetailInfoSections,
  saleProgramDocs,
  legalDocs,
  handoverMaterialDocs,
  totalFollower,
  maxBookingNumber = 0,
  needShowMatterport,
  needShowVideoview,
  needShowStreetview,
  onPress3D,
  onPressVideo,
  onPressStreetview,
  onPressInvestor,
  projectStatus,
  onViewRendered = () => {},
  onGeneralViewRendered,
  onLegalDocumentsViewRendered,
  onFeaturedItemsRendered,
  onSimilarProjectRendered,
  isTesting,
  projectItems,
  projectStatusId,
  onToggleFollowStatus,
  isFollowed,
  projectSimilar,
  formatPrice,
  updateProjectSimilar,
  onViewMoreProjectSimilar,
  onPressSimilarItem,
}) => {
  return (
    <>
      <View onLayout={onGeneralViewRendered}>
        <GeneralInfo
          isFollowed={isFollowed}
          projectStatus={projectStatus}
          projectStatusDescription={projectStatusDescription}
          projectStatusId={projectStatusId}
          maxBookingNumber={maxBookingNumber}
          startYear={startYear}
          projectTypeName={projectTypeName}
          images={images}
          projectName={projectName}
          minPrice={minPrice}
          commission={commission}
          investorOwnerLogo={investorOwnerLogo}
          investorId={investorId}
          investorCode={investorCode}
          investor={investor}
          overallDescription={overallDescription}
          projectType={projectType}
          totalArea={totalArea}
          address={address}
          followerCount={totalFollower ?? 0}
          needShowMatterport={needShowMatterport}
          needShowVideoview={needShowVideoview}
          needShowStreetview={needShowStreetview}
          onPress3D={onPress3D}
          onPressVideo={onPressVideo}
          onPressStreetview={onPressStreetview}
          onPressInvestor={onPressInvestor}
          isTesting={isTesting}
          onToggleFollowStatus={onToggleFollowStatus}
        />
      </View>
      <Sections
        sectionsInfo={projectDetailInfoSections}
        onViewRendered={onViewRendered}
        projectAddress={address}
        isTesting={isTesting}
      />
      {!!projectItems?.length && (
        <>
          <View style={commonStyles.separatorRow8WithColor} />
          <View onLayout={onFeaturedItemsRendered}>
            <View style={[METRICS.horizontalPadding, METRICS.smallNormalVerticalPadding]}>
              <Text style={styles.textProjectSection}>
                {translate('project.detail.sections.featuredProperty')}
              </Text>
              <View style={commonStyles.separatorRow16} />
              <FlatList
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.propertyPostId}
                horizontal
                data={projectItems}
                renderItem={({item}) => {
                  return <FeaturedItem item={item} />;
                }}
              />
            </View>
          </View>
        </>
      )}
      <View onLayout={onLegalDocumentsViewRendered}>
        <LegalAndHandoverDocuments
          legalDocs={legalDocs}
          handoverMaterialDocs={handoverMaterialDocs}
        />
        <SaleProgramDocuments documents={saleProgramDocs} />
      </View>
      <View onLayout={onSimilarProjectRendered}>
        <ProjectSimilar
          onPressItem={onPressSimilarItem}
          onViewMoreProjectSimilar={onViewMoreProjectSimilar}
          formatPrice={formatPrice}
          updateProjectSimilar={updateProjectSimilar}
          projectSimilar={projectSimilar}
        />
      </View>
    </>
  );
};

const mapDocumentsProject = dataString => {
  const jsonData = JSON.parse(dataString);
  const documents = jsonData?.documents,
    images = jsonData?.images;
  if (documents?.length && images?.length) {
    return documents.concat(images);
  } else if (documents?.length) {
    return documents;
  } else if (images?.length) {
    return images;
  }
  return [];
};

const getTotalSections = ({
  projectDetail,
  projectDetailInfoSections,
  legalDocs,
  handoverMaterialDocs,
  saleProgramDocs,
}) => {
  let total = 2; // default: "Tổng quan" & "Bình luận"

  projectDetailInfoSections?.forEach(e => {
    if (!PROJECT_DETAIL_HEADER_NAV_SORTED.find(headerName => headerName === e.title)) {
      return;
    }

    for (const key in e.sectionData) {
      if (e.sectionData[key]) {
        total++;
        break;
      }
    }
  });

  if (legalDocs?.length || handoverMaterialDocs?.length || saleProgramDocs?.length) {
    total++;
  }

  if (projectDetail.projectItems?.length) {
    total++;
  }

  return total;
};

const ProjectDetailContainer = ({
  loading,
  onRefresh,
  projectDetail,
  address,
  onToggleFollowStatus,
  projectStatus,
  onNeedAdvice,
  onReserve,
  needShowMatterport,
  needShowStreetview,
  onPress3D,
  onPressStreetview,
  needShowVideoview,
  updateProjectSimilar,
  onPressVideo,
  onPressInvestor,
  isShowButtonBook,
  notLoggedIn,
  isMemberUser,
  showBottomView = true,
  projectSimilar,
  formatPrice,
  onViewMoreProjectSimilar,
  onPressSimilarItem,
}) => {
  const generalInfo = Selector.generalInfoMapper(projectDetail);
  const {
    startYear = 0,
    projectTypeName,
    images = [],
    projectName = '',
    minPriceFormatted = '',
    commission = '',
    investorOwnerLogo = null,
    investorId = '',
    investorCode = '',
    investor = '',
    overallDescription = '',
    projectType = '',
    totalArea = '',
  } = generalInfo ?? {};

  const {
    saleProgramMediaInfo = '{}',
    legalInformationMediaInfo = '{}',
    handoverMaterialMediaInfo = '{}',
    saleSeasonInfo = {},
    totalFollower,
    projectStatusDescription,
    projectItems,
    projectStatusId,
    isFollowed,
  } = projectDetail;

  const saleProgramDocs = useMemo(
    () => mapDocumentsProject(saleProgramMediaInfo),
    [saleProgramMediaInfo],
  );
  const legalDocs = useMemo(
    () => mapDocumentsProject(legalInformationMediaInfo),
    [legalInformationMediaInfo],
  );
  const handoverMaterialDocs = useMemo(
    () => mapDocumentsProject(handoverMaterialMediaInfo),
    [handoverMaterialMediaInfo],
  );

  const totalSections = useMemo(
    () =>
      getTotalSections({
        projectDetail,
        projectDetailInfoSections,
        legalDocs,
        saleProgramDocs,
        handoverMaterialDocs,
      }),
    [projectDetail, projectDetailInfoSections, legalDocs, saleProgramDocs, handoverMaterialDocs],
  );

  const commentRef = useRef(null);

  const contentList = useRef(null);

  const headerNavs = useRef({});

  const [sections, setSections] = useState({});

  const projectDetailInfoSections = Selector.getProjectSectionData(projectDetail);

  // const ShareControl = () => {
  //   const {showShare} = useShare({
  //     totalShare: generalInfo.totalShare,
  //     projectId: generalInfo.projectId,
  //     message: generalInfo.projectName,
  //     title: generalInfo.projectName,
  //   });
  //   return <ShareIcon totalShare={generalInfo.totalShare} onPress={showShare} />;
  // };

  const onRefreshData = () => {
    commentRef?.current?.refreshComment();
    onRefresh();
  };

  const onPressMap = () => {
    contentList.current?.scrollToSection(translate('project.detail.headerNav.location'));
  };

  const onViewRendered = (event, sectionName) => {
    const height = event.nativeEvent.layout.height;
    const position = event.nativeEvent.layout.y;

    const isIncludeInHeader = !!PROJECT_DETAIL_HEADER_NAV_SORTED.find(e => e === sectionName);

    if (
      (headerNavs.current[sectionName]?.height !== height ||
        headerNavs.current[sectionName]?.position !== position) &&
      isIncludeInHeader
    ) {
      const newHeaders = {...headerNavs.current, [sectionName]: {height, position}};
      headerNavs.current = newHeaders;

      if (Object.keys(newHeaders).length >= totalSections) {
        setSections(newHeaders);
      }
    }
  };

  const renderBodyView = () => (
    <>
      {isEmpty(projectDetail) || loading ? (
        <CenterText loading={loading} />
      ) : (
        <ProjectDetailView
          loading={loading}
          onRefresh={onRefresh}
          isFollowed={isFollowed}
          updateProjectSimilar={updateProjectSimilar}
          projectStatusDescription={projectStatusDescription}
          projectStatusId={projectStatusId}
          startYear={startYear}
          projectTypeName={projectTypeName}
          images={images}
          projectName={projectName}
          formatPrice={formatPrice}
          minPrice={minPriceFormatted}
          commission={commission}
          projectSimilar={projectSimilar}
          investorOwnerLogo={investorOwnerLogo}
          investorId={investorId}
          investorCode={investorCode}
          investor={investor}
          overallDescription={overallDescription}
          projectType={projectType}
          totalArea={totalArea}
          onPressSimilarItem={onPressSimilarItem}
          address={address}
          legalDocs={legalDocs}
          handoverMaterialDocs={handoverMaterialDocs}
          saleProgramDocs={saleProgramDocs}
          maxBookingNumber={saleSeasonInfo?.maxBookingNumber}
          totalFollower={totalFollower}
          onToggleFollowStatus={onToggleFollowStatus}
          needShowMatterport={needShowMatterport}
          needShowVideoview={needShowVideoview}
          needShowStreetview={needShowStreetview}
          onPress3D={onPress3D}
          onPressVideo={onPressVideo}
          onPressStreetview={onPressStreetview}
          onPressInvestor={onPressInvestor}
          projectStatus={projectStatus}
          isShowButtonBook={isShowButtonBook}
          onReserve={onReserve}
          projectDetailInfoSections={projectDetailInfoSections}
          onViewMoreProjectSimilar={onViewMoreProjectSimilar}
          onViewRendered={onViewRendered}
          onGeneralViewRendered={event =>
            onViewRendered(event, translate('project.detail.headerNav.general'))
          }
          onLegalDocumentsViewRendered={event =>
            onViewRendered(
              event,
              getProjectLegalAndHandoverMaterialHeaderTitle(legalDocs, handoverMaterialDocs),
            )
          }
          onFeaturedItemsRendered={event =>
            onViewRendered(event, translate('project.detail.headerNav.featuredProperty'))
          }
          onSimilarProjectRendered={event =>
            onViewRendered(event, translate('project.detail.headerNav.similarProject'))
          }
          projectItems={projectItems}
        />
      )}
      <View
        onLayout={event => onViewRendered(event, translate('project.detail.headerNav.comment'))}>
        <CommentComponents
          ref={commentRef}
          customStyle={{paddingHorizontal: normal}}
          objectTitle={projectDetail.projectName}
          objectId={projectDetail.projectId}
          feedObjectTypeId={COMMENT_OBJECT_TYPES.PROJECT}
        />
      </View>
    </>
  );

  const content = useMemo(renderBodyView, [
    generalInfo,
    address,
    projectDetail,
    loading,
    projectStatus,
    renderBodyView,
  ]);

  const {showShare} = useShare({
    projectId: projectDetail?.id,
    message: projectDetail?.projectName,
    title: projectDetail?.projectName,
    onAfterShare: () => {},
  });

  return (
    <BaseScreen
      containerStyle={{backgroundColor: COLORS.NEUTRAL_WHITE}}
      titleProps={{numberOfLines: 1}}
      rightComponent={
        <View style={HELPERS.rowCenter}>
          <CustomIconButton
            image={IMAGES.IC_MAP_FILL}
            imageStyle={styles.iconMap}
            onPress={onPressMap}
          />
          <SizeBox width={28} />
          <ShareIcon hideLabel onPress={showShare} hideMarginRight />
        </View>
      }
      title={translate(STRINGS.DETAIL)}>
      <ScrollViewWithAnimatedHeader
        ref={contentList}
        sections={sections}
        threshold={(IMAGE_SIZE.HEIGHT * 2) / 3}
        loading={loading}
        scrollViewProps={{
          keyboardShouldPersistTaps: 'always',
          contentContainerStyle: HELPERS.fillGrow,
          refreshControl: <RefreshControl refreshing={loading} onRefresh={onRefreshData} />,
        }}>
        {content}
      </ScrollViewWithAnimatedHeader>
      {showBottomView ? (
        <ViewBottom
          projectStatus={projectStatus}
          isShowButtonBook={isShowButtonBook}
          onNeedAdvice={onNeedAdvice}
          onReserve={onReserve}
          notLoggedIn={notLoggedIn}
          isMemberUser={isMemberUser}
        />
      ) : null}
    </BaseScreen>
  );
};

export default ProjectDetailContainer;
