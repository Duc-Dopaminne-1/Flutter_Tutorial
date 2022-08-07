import React, {useEffect, useState} from 'react';

import {useGetProjectsLazyQuery} from '../../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../../api/graphql/useGraphqlApiLazy';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {commonStyles} from '../../../../assets/theme/styles';
import DropdownWithTitle from '../../../../components/DropdownWithTitle';
import {useMount} from '../../../commonHooks';

const PAGE_SIZE = 20;

const mapProjects = (data, selectedProject) => {
  return data?.map((item, index) => ({
    id: item.id || index,
    name: item.name,
    checked:
      (item.projectId === selectedProject?.id || item.id === selectedProject?.id) &&
      selectedProject?.id?.length,
  }));
};
const mapResponseProjectsToDropdownList = (projects = []) => {
  return projects?.map((e, index) => {
    return {
      id: e.projectId || index,
      name: e.projectName,
      checked: false,
    };
  });
};

const SelectProjectDropdownView = ({onSelectedProject = () => {}, project}) => {
  const [projectsData, setProjectsData] = useState([]);
  useEffect(() => {
    if (project) {
      setProjectsData(mapProjects(projectsData, project));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);
  const onSuccessGetProjects = data => {
    const projects = data?.edges ?? [];
    if (!projects || projects.length === 0) {
      return;
    }
    const convertedProjects = mapResponseProjectsToDropdownList(projects);
    setProjectsData(convertedProjects);
  };
  const {startApi: getProjects} = useGraphqlApiLazy({
    graphqlApiLazy: useGetProjectsLazyQuery,
    dataField: 'projectsForPublic',
    queryOptions: {
      variables: {
        order_by: {
          projectName: 'ASC',
        },
        pageSize: PAGE_SIZE,
        projectName: '',
      },
    },
    showSpinner: false,
    onSuccess: onSuccessGetProjects,
  });
  useMount(getProjects);
  const onChosenProject = item => {
    if (item) {
      setProjectsData(mapProjects(projectsData, item));
      onSelectedProject(item);
    }
  };
  return (
    <>
      <DropdownWithTitle
        headerStyles={commonStyles.dropdownHeader}
        inputStyle={commonStyles.dropdownInput}
        title={translate(STRINGS.PROJECT)}
        dropdownPlaceHolderStyle={commonStyles.dropdownPlaceHolder}
        dropdownTitle={translate(STRINGS.SELECT_PROJECT)}
        popupTitle={translate(STRINGS.SELECT_PROJECT)}
        items={projectsData}
        showSearchBox
        error={''}
        itemSelected={() => {}} // TODO Parse data
        onChosen={onChosenProject}
        isRequiredAtLeastOne
        emptyText={translate(STRINGS.DO_NOT_HAVE_DATA)}
      />
    </>
  );
};

export default SelectProjectDropdownView;
