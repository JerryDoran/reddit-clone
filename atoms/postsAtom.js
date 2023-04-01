import { atom } from 'recoil';

const defaultPostState = {
  selectedPost: null,
  posts: [],
  postVotes: [],
};

export const postState = atom({
  key: 'postState',
  default: defaultPostState,
});
