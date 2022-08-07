import {useContext} from 'react';

import {
  useGetProjectAdditionalDataLazyQuery,
  useGetPropertyAdditionalDataLazyQuery,
} from '../../api/graphql/generated/graphql';
import {LastModifiedContext} from '../../appData/lastModifiedContext/useLastModifiedContext';
import useGetAdditionData from './useGetAdditionData';

const useProjectAndPropertyAdditionalData = () => {
  const {state: lastModified} = useContext(LastModifiedContext);
  const [propertyAdditionalData, setProperties] = useGetAdditionData({
    updatedItem: lastModified.property,
    useLazyQuery: useGetPropertyAdditionalDataLazyQuery,
    responseDataKey: 'getPropertyPostsAdditionalForSearch',
    idKey: 'propertyPostId',
    idQueryParams: 'propertyPostIds',
  });

  const [projectAdditionalData, setProjects] = useGetAdditionData({
    updatedItem: lastModified.project,
    useLazyQuery: useGetProjectAdditionalDataLazyQuery,
    responseDataKey: 'getProjectsAdditionalForSearch',
    idKey: 'projectId',
    idQueryParams: 'projectIds',
  });

  return {propertyAdditionalData, projectAdditionalData, setProperties, setProjects};
};

export default useProjectAndPropertyAdditionalData;
