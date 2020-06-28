import {
  ConfigurationProps,
  Page,
  GroupProps,
  CardProps,
} from '../Components/Configuration/Config';

export function findPageIdByKey(
  config: ConfigurationProps,
  key: string
): number {
  return config.pages.findIndex((i: Page) => i.key === key);
}

export function findPageIdByPage(
  config: ConfigurationProps,
  page: Page
): number {
  return config.pages.findIndex((i: Page) => i.key === page.key);
}

export function findPageByKey(
  config: ConfigurationProps,
  key: string
): Page | undefined {
  return config.pages.find((i: Page) => i.key === key);
}

export function findGroupIdByKey(
  config: ConfigurationProps,
  key: string
): number {
  return config.groups.findIndex((i: GroupProps) => i.key === key);
}

export function findGroupIdByGroup(
  config: ConfigurationProps,
  group: GroupProps
): number {
  return config.groups.findIndex((i: GroupProps) => i.key === group.key);
}

export function findGroupByKey(
  config: ConfigurationProps,
  key: string
): GroupProps | undefined {
  return config.groups.find((i: GroupProps) => i.key === key);
}

export function findCardIdByKey(
  config: ConfigurationProps,
  key: string
): number {
  return config.cards.findIndex((i: CardProps) => i.key === key);
}

export function findCardIdByCard(
  config: ConfigurationProps,
  card: CardProps
): number {
  return config.cards.findIndex((i: CardProps) => i.key === card.key);
}

export function findCardByKey(
  config: ConfigurationProps,
  key: string
): CardProps | undefined {
  return config.cards.find((i: CardProps) => i.key === key);
}
