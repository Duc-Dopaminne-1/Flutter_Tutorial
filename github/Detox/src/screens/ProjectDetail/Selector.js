import {translate} from '../../assets/localize';
import logService from '../../service/logService';
import JsonDataUtils from '../../utils/JsonDataUtils';
import MeasureUtils from '../../utils/MeasureUtils';
import {parseStringToJSON} from '../../utils/StringUtils';

const generalInfoMapper = projectDetail => {
  const {
    featurePhotos,
    projectName,
    projectStatusDescription,
    commissionRates,
    investorOwnerName,
    projectTypeDescription,
    isFollowed,
    totalFollower,
    projectId,
    overviewMediaInfo,
    projectItems,
    totalShare,
    startYear,
    overallDescription,
    totalArea,
    projectTypeName,
    investorDetailPath,
    investorId,
    investorOwnerLogo,
    minPrice,
    locationMediaInfo,
    groundPlanMediaInfo,
    facilitiesMediaInfo,
  } = projectDetail ?? {};

  const overviewImages = parseStringToJSON(overviewMediaInfo)?.images || [];
  const locationMediaImages = parseStringToJSON(locationMediaInfo)?.images || [];
  const groundPlanMediaImages = parseStringToJSON(groundPlanMediaInfo)?.images || [];
  const facilitiesMediaImage = parseStringToJSON(facilitiesMediaInfo)?.images || [];
  let imagesGallery = [];
  if (featurePhotos) {
    imagesGallery = [{url: featurePhotos}].concat(
      overviewImages,
      locationMediaImages,
      groundPlanMediaImages,
      facilitiesMediaImage,
    );
  } else {
    imagesGallery = overviewImages;
  }

  const investorCode =
    investorDetailPath
      ?.toString()
      .toLocaleUpperCase()
      .match(/MCDT\d+/g)
      ?.toString() ?? null;

  return {
    images: imagesGallery,
    projectName,
    projectTypeName,
    startYear,
    overallDescription,
    totalArea,
    projectItems: projectItems ?? [],
    projectStatus: projectStatusDescription,
    commission: commissionRates ?? '',
    projectType: projectTypeDescription,
    investor: investorOwnerName,
    isFollowed: isFollowed,
    totalFollower,
    video: overviewMediaInfo,
    projectId,
    totalShare: totalShare,
    investorId,
    investorCode,
    investorOwnerLogo,
    minPrice,
    minPriceFormatted: MeasureUtils.getPriceDescriptionNoUnitInput(minPrice),
  };
};

const sectionMapper = (description, mediaInfo, projectAddress) => {
  let result = {description: description ?? ''};
  try {
    const coordinates = projectAddress && {
      latitude: projectAddress?.latitude ?? '',
      longitude: projectAddress?.longitude ?? '',
    };
    const info = JsonDataUtils.parseJSONObject(mediaInfo);
    result = {
      mapview: coordinates,
      ...info,
      ...result,
    };
  } catch (error) {
    logService.log(error);
  }
  return result;
};

const getProjectSectionData = projectDetail => {
  const sections = [];
  if (projectDetail) {
    sections.push({
      title: translate('project.detail.sections.description'),
      sectionData: sectionMapper(
        projectDetail.overviewDescription,
        projectDetail.overviewMediaInfo,
      ),
    });
    sections.push({
      title: translate('project.detail.sections.overallScale'),
      sectionData: sectionMapper(projectDetail.sizingDescription, projectDetail.sizingMediaInfo),
    });
    sections.push({
      title: translate('project.detail.sections.location'),
      sectionData: sectionMapper(
        projectDetail.locationDescription,
        projectDetail.locationMediaInfo,
        projectDetail.projectAddress,
      ),
    });
    sections.push({
      title: translate('project.detail.sections.facility'),
      sectionData: sectionMapper(
        projectDetail.facilitiesDescription,
        projectDetail.facilitiesMediaInfo,
      ),
    });
    sections.push({
      title: translate('project.detail.sections.ground'),
      sectionData: sectionMapper(
        projectDetail.groundPlanDescription,
        projectDetail.groundPlanMediaInfo,
      ),
    });
  }
  return sections;
};

export default {
  generalInfoMapper,
  sectionMapper,
  getProjectSectionData,
};
