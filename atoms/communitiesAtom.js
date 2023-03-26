import { atom } from 'recoil';

const defaultCommunityState = {
  mySnippets: [],
  currentCommunity: {},
};

export const communityState = atom({
  key: 'communityState',
  default: defaultCommunityState,
});
