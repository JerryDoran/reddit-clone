import { deleteObject, ref } from 'firebase/storage';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { communityState } from '../atoms/communitiesAtom';
import { postState } from '../atoms/postsAtom';
import { auth, db, storage } from '../firebase/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { authModalState } from '../atoms/authModalAtom';
import { useRouter } from 'next/router';

export default function usePosts() {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const [user] = useAuthState(auth);
  const { currentCommunity } = useRecoilValue(communityState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const router = useRouter();

  async function onVote(e, post, vote, communityId) {
    e.stopPropagation();
    // check for a user => if not, open auth modal
    if (!user?.uid) {
      setAuthModalState({ open: true, view: 'login' });
      return;
    }
    const { voteStatus } = post;
    const existingVote = postStateValue.postVotes.find(
      (vote) => vote.postId === post.id
    );

    try {
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
        const postVoteRef = doc(
          db,
          'users',
          `${user.uid}/postVotes/${existingVote.id}`
        );
        if (existingVote.voteValue === vote) {
          // user could remove their vote (upvote => neutral OR downvote => neutral)
          voteChange *= -1;
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingVote.id
          );
          // delete the postVote document
          batch.delete(postVoteRef);
        } else {
          // user flipping vote (up => down OR down => up) add/subtract 2 to/from post.voteStatus
          voteChange = 2 * vote;
          updatedPost.voteStatus = voteStatus + 2 * vote;

          const voteIndex = postStateValue.postVotes.findIndex(
            (vote) => vote.id === existingVote.id
          );

          updatedPostVotes[voteIndex] = {
            ...existingVote,
            voteValue: vote,
          };
          // update existing postVote document
          batch.update(postVoteRef, {
            voteValue: vote,
          });
        }
      }

      // update post document

      const postRef = doc(db, 'posts', post.id);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });

      await batch.commit();

      // update state with updated values
      const postIndex = postStateValue.posts.findIndex(
        (item) => item.id === post.id
      );
      updatedPosts[postIndex] = updatedPost;

      setPostStateValue((prev) => {
        return {
          ...prev,
          posts: updatedPosts,
          postVotes: updatedPostVotes,
        };
      });

      if (postStateValue.selectedPost) {
        setPostStateValue((prev) => ({
          ...prev,
          selectedPost: updatedPost,
        }));
      }
    } catch (error) {
      console.log('onVote error', error);
    }
  }

  function onSelectPost(post) {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: post,
    }));
    router.push(`/r/${post.communityId}/comments/${post.id}`);
  }

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

  async function getCommunityPostVotes(communityId) {
    const colRef = collection(db, 'users', `${user?.uid}/postVotes`);
    const postVotesQuery = query(
      colRef,
      where('communityId', '==', communityId)
    );

    const postVoteDocs = await getDocs(postVotesQuery);
    const postVotes = postVoteDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setPostStateValue((prev) => {
      return {
        ...prev,
        postVotes: postVotes,
      };
    });
  }

  useEffect(() => {
    if (!user || !currentCommunity?.id) return;
    getCommunityPostVotes(currentCommunity?.id);
  }, [user, currentCommunity]);

  useEffect(() => {
    // clear user post votes
    if (!user) {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    }
  }, [user]);

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
}
