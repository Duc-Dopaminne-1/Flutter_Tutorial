import {isEmpty, isEqual} from 'lodash';
import React, {createContext, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const defaultProjectInfo = {
  projectId: '',
  isFollowed: false,
  totalFollower: 0,
  totalShare: 0,
};

const defaultPropertyInfo = {
  propertyPostId: '',
  isFollowed: false,
  totalFollower: 0,
  totalShare: 0,
};

const initialState = {
  project: defaultProjectInfo,
  property: defaultPropertyInfo,
};

const LastModifiedContext = createContext(initialState);

const excuteIfValid = (previous, current, execute = () => {}) => {
  if (!isEmpty(current) && !isEqual(previous, current)) {
    execute && execute();
  }
};

const LastModifiedProvider = ({children}) => {
  const [state, setState] = useState(initialState);

  const updateProject = project => {
    if (project) {
      const extractedData = {
        projectId: project.projectId,
        isFollowed: project.isFollowed,
        totalFollower: project.totalFollower,
        totalShare: project.totalShare,
      };
      excuteIfValid(state.project, extractedData, () => {
        setState({...state, project: extractedData});
      });
    }
  };

  const updateProperty = property => {
    if (property) {
      const extractedData = {
        propertyPostId: property.propertyPostId,
        isFollowed: property.isFollowed,
        totalFollower: property.totalFollower,
        totalShare: property.totalShare,
      };
      excuteIfValid(state.property, extractedData, () => {
        setState({...state, property: extractedData});
      });
    }
  };

  const value = {state, updateProject, updateProperty};
  return (
    <LastModifiedContext.Provider value={value}>
      <SafeAreaProvider>{children}</SafeAreaProvider>
    </LastModifiedContext.Provider>
  );
};

export {LastModifiedContext, LastModifiedProvider};
