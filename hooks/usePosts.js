import { deleteObject, ref } from 'firebase/storage';
import { deleteDoc, doc } from 'firebase/firestore';
import { useRecoilState } from 'recoil';
import { postState } from '../atoms/postsAtom';
import { db, storage } from '../firebase/firebase.config';

export default function usePosts() {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);

  async function onVote() {}

  function onSelectPost() {}

  async function onDeletePost(post) {
    try {
      // check if there is an image related to the post, delete from storage if exists
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }
      // delete post doc from firestore
      const postDocRef = doc(db, 'posts', post.id);
      await deleteDoc(postDocRef);

      // update recoil state
      setPostStateValue((prev) => {
        return {
          ...prev,
          posts: prev.posts.filter((item) => item.id !== post.id),
        };
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
}
