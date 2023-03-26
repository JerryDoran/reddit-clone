import { atom } from 'recoil';

const defaultPostState = {
  selectedPost: null,
  posts: [],
};

export const postState = atom({
  key: 'postState',
  default: defaultPostState,
});
