import {
  ConfigurationProps,
  PageProps,
  GroupProps,
  CardProps
} from 'Components/Configuration/Config';

export function findPageIdByKey(config: ConfigurationProps, key: string) {
  return config.pages.findIndex((i: PageProps) => i.key === key);
}

export function findPageIdByPage(config: ConfigurationProps, page: PageProps) {
  return config.pages.findIndex((i: PageProps) => i.key === page.key);
}

export function findPageByKey(config: ConfigurationProps, key: string) {
  return config.pages.find((i: PageProps) => i.key === key);
}

export function findGroupIdByKey(config: ConfigurationProps, key: string) {
  return config.groups.findIndex((i: GroupProps) => i.key === key);
}

export function findGroupIdByGroup(
  config: ConfigurationProps,
  group: GroupProps
) {
  return config.groups.findIndex((i: GroupProps) => i.key === group.key);
}

export function findGroupByKey(config: ConfigurationProps, key: string) {
  return config.groups.find((i: GroupProps) => i.key === key);
}

export function findCardIdByKey(config: ConfigurationProps, key: string) {
  return config.cards.findIndex((i: CardProps) => i.key === key);
}

export function findCardIdByCard(config: ConfigurationProps, card: CardProps) {
  return config.cards.findIndex((i: CardProps) => i.key === card.key);
}

export function findCardByKey(config: ConfigurationProps, key: string) {
  return config.cards.find((i: CardProps) => i.key === key);
}
