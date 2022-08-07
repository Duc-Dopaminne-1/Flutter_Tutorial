import {translate} from '../../assets/localize';

export const getProjectLegalAndHandoverMaterialHeaderTitle = (legalDocs, handoverMaterialDocs) => {
  if (
    legalDocs &&
    legalDocs.length > 0 &&
    handoverMaterialDocs &&
    handoverMaterialDocs.length > 0
  ) {
    return translate('project.detail.headerNav.legalAndHandoverMaterial');
  } else if (legalDocs && legalDocs.length > 0) {
    return translate('project.detail.sections.legal');
  } else if (handoverMaterialDocs && handoverMaterialDocs.length > 0) {
    return translate('project.detail.sections.handoverMaterial');
  }

  return '';
};

export const PROJECT_DETAIL_HEADER_NAV_SORTED = [
  translate('project.detail.headerNav.general'),
  translate('project.detail.headerNav.location'), // maybe null
  translate('project.detail.headerNav.facility'), // maybe null
  translate('project.detail.headerNav.structure'), // maybe null
  translate('project.detail.headerNav.featuredProperty'), // maybe null
  translate('project.detail.headerNav.legalAndHandoverMaterial'), // maybe null
  translate('project.detail.sections.legal'), // maybe null
  translate('project.detail.sections.handoverMaterial'), // maybe null
  translate('project.detail.headerNav.comment'),
  translate('project.detail.headerNav.similarProject'),
];
