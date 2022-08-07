import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {CONSTANTS, MAX_LENGTH} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import InputSection from '../../../../components/InputSection';
import PropertyPostUtils from '../../PropertyPostUtils';
import {NewPostStyles} from './NewPostConstant';

const MAX_PROJECT_NUMBER = 5;
const otherProject = {
  id: CONSTANTS.DROPDOWN_OTHER_ID,
  name: '',
  checked: false,
};

const mapProjects = (json, checkedId) => {
  const listProjects = json?.edges;
  if (!listProjects || !Array.isArray(listProjects)) {
    return [];
  }
  const projects = listProjects.map(item => ({
    id: item.b2C2CProjectId,
    name: item.b2C2CProjectName?.trim(),
    checked: item.b2C2CProjectId === checkedId,
    projectAddress: item.projectAddress,
  }));
  return projects;
};

const ProjectComponent = ({
  projectId,
  propertyAddress,
  freeTextProject,
  projectName,
  onChangeProject,
  data,
  error,
}) => {
  const [originProjects, setOriginProjects] = useState([]);
  const [focused, setFocused] = useState(false);
  const [listProjects, setListProjects] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const [selectedId, setSelectedId] = useState(data ?? CONSTANTS.DROPDOWN_OTHER_ID);

  const onChangeState = (id, text, projectAddress = {}) => {
    const payload = {};
    if (PropertyPostUtils.isOtherProjectId(id)) {
      payload.freeTextProject = text;
      payload.projectInfo = {
        projectId: '',
      };
      setSelectedId(CONSTANTS.DROPDOWN_OTHER_ID);
    } else {
      payload.freeTextProject = '';
      payload.propertyAddress = projectAddress;
      payload.projectId = id;
      payload.projectInfo = {
        projectName: text,
        projectId: id,
        projectAddress,
      };
      setSelectedId(id);
    }
    onChangeProject(payload);
  };

  useEffect(() => {
    const projects = mapProjects(data, projectId);
    if (!projectId && projects.length > 0) {
      onChangeState(projectId, freeTextProject, propertyAddress);
    }
    setListProjects(projects.length > MAX_PROJECT_NUMBER ? projects.slice(0, 5) : projects);
    setOriginProjects(projects);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onSelectProject = item => {
    if (!item) {
      return;
    }
    if (selectedId && selectedId !== item.id) {
      onChangeState(item.id, item.name, item.projectAddress);
    }
    setShowSuggest(false);
  };

  const onProjectTextChange = text => {
    if (text) {
      if (text.length >= 3) {
        const filterProject = originProjects.filter(item =>
          String(item.name).toLowerCase().includes(text.toLowerCase()),
        );
        setListProjects(
          filterProject.length > MAX_PROJECT_NUMBER ? filterProject.slice(0, 5) : filterProject,
        );
        setShowSuggest(filterProject.length > 0);
      } else {
        setShowSuggest(false);
      }

      onChangeState(otherProject.id, text);
    } else {
      onChangeState(otherProject.id, '');
      setListProjects(
        originProjects.length > MAX_PROJECT_NUMBER ? originProjects.slice(0, 5) : originProjects,
      );
    }
  };

  const onBlur = () => {
    setFocused(false);
    setShowSuggest(false);
  };

  return (
    <>
      <InputSection
        headerTitle={translate(STRINGS.PROJECT)}
        headerStyles={commonStyles.blackTextBold16}
        headerContainerStyle={METRICS.smallMarginTop}
        customStyle={METRICS.tinyPaddingBottom}
        placeholder={translate(STRINGS.PLACE_HOLDER_PROJECT_NAME)}
        placeHolderColor={COLORS.TEXT_DARK_40}
        inputStyle={styles.input(focused)}
        value={projectName ?? freeTextProject}
        onChangeText={onProjectTextChange}
        showLimitedLength
        error={error}
        maxLength={MAX_LENGTH.PROJECT_NAME_INPUT}
        onFocus={() => setFocused(true)}
        onBlur={onBlur}
      />
      {showSuggest && listProjects?.length > 0 && (
        <View style={[NewPostStyles.suggestionContainer, METRICS.smallMarginTop]}>
          {listProjects?.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onSelectProject(item)}
              style={NewPostStyles.itemSuggestion}>
              <Text style={commonStyles.blackText14}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  input: isFocused => ({
    ...commonStyles.inputBorderStyle,
    fontSize: SIZES.FONT_16,
    ...(isFocused && {borderColor: COLORS.PRIMARY_A100}),
  }),
});

export default ProjectComponent;
