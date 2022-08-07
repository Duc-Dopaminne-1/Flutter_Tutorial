import {SUGGEST_TYPE} from '../assets/constants';
import {extractAddressData} from './DataProcessUtil';

const mapDataSuggestionSearch = (project, property, agent) => {
  const listProject = [];
  const listProperty = [];
  const listAgent = [];
  if (project && project.length > 0) {
    project.forEach(item => {
      listProject.push({
        type: SUGGEST_TYPE.project,
        id: item.projectId,
        title: item.projectName,
        description: extractAddressData(item.projectAddress),
      });
    });
  }
  if (property && property.length > 0) {
    property.forEach(item => {
      listProperty.push({
        type: SUGGEST_TYPE.property,
        id: item.propertyPostId,
        title: item.postTitle,
        description: extractAddressData(item.propertyAddress, true),
      });
    });
  }
  if (agent && agent.length > 0) {
    agent.forEach(item => {
      listAgent.push({
        type: SUGGEST_TYPE.agency,
        id: item.agentId,
        title: ` ${item.lastName} ${item.firstName}`,
        description: item.agentGroupDescription,
        avatar: item.profilePhoto,
      });
    });
  }
  const arrayData = [...listProject, ...listProperty, ...listAgent];
  return arrayData;
};

const SearchSuggestUtils = {
  mapDataSuggestionSearch,
};

export default SearchSuggestUtils;
