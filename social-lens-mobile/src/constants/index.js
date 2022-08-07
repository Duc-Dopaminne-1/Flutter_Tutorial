export * from './colors'
export * from './fonts'
import I18n from 'app/i18n'

export const CampaignType = {
  STANDARD: 'STANDARD',
  CONVERSATION: 'CONVERSATION',
  APPLICATION: 'APPLICATION'
};

export const QuestionType = {
  INSTRUCTION_QUESTION: 'INSTRUCTION',
  OPEN_TEXT_QUESTION: 'OPEN_TEXT',
  ONE_CHOICE_QUESTION: 'ONE_CHOICE',
  MULTIPLE_CHOICE_QUESTION: 'MULTIPLE_CHOICE',
  RANKING_CHOICE_QUESTION: 'RANKING_CHOICE',
  BLANK_QUESTION: 'BLANK'
};

export const GenderList = [
  I18n.t('male'),
  I18n.t('female'),
  I18n.t('nonBinary'),
  I18n.t('preferAnswer'),
];

export const EducationList = [
  I18n.t('noSchooling'),
  I18n.t('nurserySchool'),
  I18n.t('someHigh'),
  I18n.t('highSchool'),
  I18n.t('someCollege'),
  I18n.t('training'),
  I18n.t('associateDegree'),
  I18n.t('bachelorDegree'),
  I18n.t('masterDegree'),
  I18n.t('professionalDegree'),
  I18n.t('doctorateDegree'),
];

export const RelationshipList = [
  I18n.t('single'),
  I18n.t('committedRelationship'),
  I18n.t('married'),
  I18n.t('widowed'),
  I18n.t('divorced'),
  I18n.t('separated'),
];

export const ChildrenList = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  I18n.t('more'),
];

export const EthnicityList = [
  I18n.t('americanIndian'),
  I18n.t('black'),
  I18n.t('asian'),
  I18n.t('white'),
  I18n.t('latino'),
  I18n.t('other'),
  I18n.t('preferAnswer'),
];