import PropertyPostUtils from '../PropertyPostUtils';

export const isOtherProject = projectId => {
  return !PropertyPostUtils.isOtherProjectId(projectId);
};
