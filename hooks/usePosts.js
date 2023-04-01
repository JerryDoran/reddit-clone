import { deleteObject, ref } from 'firebase/storage';
import { collection, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { useRecoilState } from 'recoil';
import { postState } from '../atoms/postsAtom';
import { auth, db, storage } from '../firebase/firebase.config';

export default function usePosts() {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const [user] = useAuthState(auth);

  async function onVote(post, vote, communityId) {
    // check for a user => if not, open auth modal
    try {
      const { voteStatus } = post;
      const existingVote = postStateValue.postVotes.find(
        (vote) => vote.postId === post.id
      );

      const batch = writeBatch(db);
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];
      let voteChange = vote;

      if (!existingVote) {
        // create a new postVote document
        const postVoteRef = doc(
          collection(db, 'users', `${user?.uid}/postVotes`)
        );

        const newVote = {
          id: postVoteRef.id,
          postId: post.id,
          communityId,
          voteValue: vote, // 1 or -1
        };

        batch.set(postVoteRef, newVote);

        // add or subtract 1 to/from post.voteStatus
        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      } else {
        if (removingVote) {
          // user could remove their vote (upvote => neutral OR downvote => neutral)
          // delete the postVote document
        } else {
          // user flipping vote (up => down OR down => up) add/subtract 2 to/from post.voteStatus
          // update existing postVote document
        }
      }
    } catch (error) {
      console.log('onVote error', error);
    }
  }

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
