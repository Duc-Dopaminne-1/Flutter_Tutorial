import React from 'react';
import {FlatList} from 'react-native';

import {translate} from '../../assets/localize';
import PageScreen from '../../components/PageScreen';
import {LearningResourceGridView} from './components/LearningResourceGridView';
import {LearningResourceHeader} from './components/LearningResourceHeader';
import {LearningResourceKnowledge} from './components/LearningResourceKnowledge';
import LearningResourceListView from './components/LearningResourceListView';
import {LearningResourceTypeId} from './utils/LearningResourcesUtils';

export function LearningResourceScreen(): React.ReactElement {
  const renderBodyHeader = () => {
    return (
      <>
        <LearningResourceHeader />
        <LearningResourceKnowledge />
        <LearningResourceGridView
          title={translate('knowledge.tab.news')}
          categoryId={LearningResourceTypeId.News}
        />
        <LearningResourceListView
          title={translate('knowledge.tab.goodTips')}
          categoryId={LearningResourceTypeId.Tips}
        />
      </>
    );
  };

  const renderBodyFooter = () => {
    return (
      <>
        <LearningResourceGridView
          title={translate('knowledge.tab.softSkill')}
          categoryId={LearningResourceTypeId.Guide}
        />
        <LearningResourceListView
          title={translate('knowledge.tab.lifeStyle')}
          categoryId={LearningResourceTypeId.LifeStyle}
        />
      </>
    );
  };

  return (
    <PageScreen
      title={translate('learningResources.title')}
      rightComponent={null}
      showHeaderShadow={false}>
      <FlatList
        data={[]}
        ListHeaderComponent={renderBodyHeader}
        ListFooterComponent={renderBodyFooter}
        renderItem={null}
      />
    </PageScreen>
  );
}
