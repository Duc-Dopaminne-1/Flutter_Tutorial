import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {useCreateSupportRequestMutation} from '../../../../api/graphql/generated/graphql';
import {
  CONSULT_BANKLOAN_SUPPORT_TYPE,
  CONSULT_PROPERTY_POST_SUPPORT_TYPE,
  CREATE_ACCOUNT_SUPPORT_TYPE,
  DEFAULT_SUPPORT_TYPE,
  SUPPORT_TYPE_ADVIDE_NOT_IN,
} from '../../../../assets/constants';
import {FONTS} from '../../../../assets/theme/fonts';
import {normal} from '../../../../assets/theme/metric';
import ImageProgress from '../../../../components/ImageProgress';
import RequestForm from '../../../../components/RequestForm';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postInfo: {
    flexDirection: 'row',
    marginBottom: normal,
  },
  postInfoImage: {
    width: 135,
    height: 70,
  },
  postTitle: {
    fontSize: 12,
    ...FONTS.semiBold,
  },
  rightInfo: {
    marginLeft: normal,
    flex: 1,
  },
});

const ContactToAdviceForm = ({
  user,
  loan,
  propertyPostId,
  projectId,
  postTitle,
  image,
  hideImage,
  onSubmitSuccess,
  supportRequestType,
  notLoggedIn,
}) => {
  const isCreateAccountSupport = supportRequestType === CREATE_ACCOUNT_SUPPORT_TYPE;
  const isDisableSelectRequestType = () => {
    return (
      supportRequestType === CONSULT_BANKLOAN_SUPPORT_TYPE ||
      supportRequestType === CONSULT_PROPERTY_POST_SUPPORT_TYPE
    );
  };

  const renderPostInfo = () => {
    if (hideImage) {
      return null;
    }
    return (
      <View style={styles.postInfo}>
        <ImageProgress
          imageStyle={styles.postInfoImage}
          containerStyle={styles.postInfoImage}
          imageContainerStyle={styles.postInfoImage}
          url={image}
        />
        <View style={styles.rightInfo}>
          <Text style={styles.postTitle}>{postTitle}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <RequestForm
        user={user}
        loan={loan}
        propertyPostId={propertyPostId}
        projectId={projectId}
        onSubmitSuccess={onSubmitSuccess}
        typeNotIns={SUPPORT_TYPE_ADVIDE_NOT_IN}
        queryLazy={useCreateSupportRequestMutation}
        isEditable={notLoggedIn || isCreateAccountSupport}
        disabledSelect={isDisableSelectRequestType()}
        defaultSelectValue={supportRequestType || DEFAULT_SUPPORT_TYPE}>
        {renderPostInfo()}
      </RequestForm>
    </View>
  );
};

ContactToAdviceForm.propTypes = {
  propertyPostId: PropTypes.string,
  projectId: PropTypes.string,
  onSubmitSuccess: PropTypes.func,
  postTitle: PropTypes.string,
  image: PropTypes.string,
  user: PropTypes.object,
};

ContactToAdviceForm.defaultProps = {
  onSubmitSuccess: () => {},
  propertyPostId: null,
  projectId: null,
  postTitle: '',
  image: null,
  user: {},
};

export default ContactToAdviceForm;
