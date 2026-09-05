import { domain1 } from './domain1';
import { domain2 } from './domain2';
import { domain3 } from './domain3';
import { domain4 } from './domain4';
import { domain5 } from './domain5';
import type { DomainSection, TopicItem } from '../types';

export const allDomains: DomainSection[] = [
  domain1,
  domain2,
  domain3,
  domain4,
  domain5
];

export const allTopics: TopicItem[] = allDomains.flatMap(d => d.topics);

export function getTopicById(id: string): TopicItem | undefined {
  return allTopics.find(t => t.id === id);
}

export function getDomainByTopicId(topicId: string): DomainSection | undefined {
  return allDomains.find(d => d.topics.some(t => t.id === topicId));
}

export const totalTopicsCount = allTopics.length;

export const totalQuizCount = allTopics.reduce((acc, t) => acc + t.quiz.length, 0);
