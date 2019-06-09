// @flow
import { CardBaseProps } from '../../Components/Cards/CardBase';

export interface ConfigProps {
  config: any;
  handleUpdateConfig?: (path: any[], data: any) => void;
  handleConfigChange?: (config: any) => void;
}

export type GroupProps = {
  name: string;
  cards: CardBaseProps[];
  page: number;
  width: number;
};

export const defaultGroup = (page: number) => ({
  name: 'New group',
  cards: [],
  page,
  width: 2
});

export const defaultCard = {
  title: 'New card',
  type: 'markdown',
  content: ''
};

export const items = [
  {
    name: 'general',
    title: 'General',
    items: [
      {
        name: 'dense_toolbar',
        title: 'Dense Toolbar',
        description: 'Should the toolbar use less space?',
        type: 'switch',
        default: false
      }
    ]
  },
  {
    name: 'overview',
    title: 'Overview',
    items: [
      {
        name: 'rows',
        title: 'Rows per Column',
        description: 'How many rows should show per column?',
        type: 'input',
        default: 3
      }
    ]
  }
];
