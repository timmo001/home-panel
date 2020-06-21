export type Page = 'Overview' | 'Configuration';
export type Editing = 0 | 1 | 2;

// -2 - Unloaded
// -1 - Loading
// 1 - Loaded
// 2 - Error
export type ProgressState = -2 | -1 | 1 | 2;

export interface Option {
  label: string;
  value: string;
}
