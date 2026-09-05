export type StudyStatus = 'not-started' | 'in-progress' | 'mastered';

export interface PortalField {
  id: string;
  label: string;
  type: 'select' | 'radio' | 'text' | 'checkbox' | 'info';
  currentValue: string;
  options?: {
    label: string;
    value: string;
    description?: string;
    isExamTrap?: boolean;
  }[];
  helpText?: string;
  examNote?: string;
}

export interface PortalBladeTab {
  id: string;
  label: string;
  fields: PortalField[];
}

export interface InteractiveBlade {
  resourceName: string;
  serviceCategory: string;
  icon: string;
  tabs: PortalBladeTab[];
}

export interface PortalStep {
  stepNumber: number;
  title: string;
  portalPath: string; // e.g. "Home > Storage accounts > + Create"
  description: string;
  keyFields: { name: string; value: string; hint?: string }[];
}

export interface QuizQuestion {
  id: string;
  scenario: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  trapAlert?: string;
}

export interface CoreConceptSection {
  heading: string;
  content: string;
  diagramType?: 'hub-spoke' | 'rbac-hierarchy' | 'storage-tiers' | 'vm-resilience' | 'nsg-flow' | 'backup-vault' | 'slot-swap' | 'load-balancer-matrix';
  keyPoints: string[];
}

export interface ExamTrap {
  trapTitle: string;
  scenario: string;
  whyItTricksPeople: string;
  correctAnswerRule: string;
}

export interface KeyNumber {
  label: string;
  value: string;
  context: string;
}

export interface CliSnippet {
  title: string;
  cli: string;
  powershell?: string;
  explanation: string;
}

export interface TopicItem {
  id: string;
  title: string;
  domainId: string;
  weightLabel: string;
  summary: string;
  coreConcepts: CoreConceptSection[];
  portalWalkthrough: {
    overview: string;
    steps: PortalStep[];
    interactiveBlade: InteractiveBlade;
  };
  examTraps: ExamTrap[];
  keyNumbers: KeyNumber[];
  cliSnippets: CliSnippet[];
  quiz: QuizQuestion[];
}

export interface DomainSection {
  id: string;
  number: number;
  title: string;
  weight: string;
  weightRange: [number, number];
  color: string;
  badgeBg: string;
  accentBorder: string;
  iconName: string;
  description: string;
  topics: TopicItem[];
}
