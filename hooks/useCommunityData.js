import { useRecoilState, useSetRecoilState } from 'recoil';
import { communityState } from '../atoms/communitiesAtom';
import { authModalState } from '../atoms/authModalAtom';
import { auth, db } from '../firebase/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  doc,
  getDocs,
  increment,
  writeBatch,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function useCommunityData() {
  const [user] = useAuthState(auth);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  function onJoinOrLeaveCommunity(communityData, isJoined) {
    // Is user signed in?  if not => open auth model
    if (!user) {
      setAuthModalState({ open: true, view: 'login' });
      return;
    }

    setLoading(true);
    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  }

  async function getMySnippets() {
    try {
      setLoading(true);
      // get user snippets
      const colRef = collection(db, `users/${user?.uid}/communitySnippets`);
      const snippetDocs = await getDocs(colRef);
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      setCommunityStateValue((prev) => {
        return {
          ...prev,
          mySnippets: snippets,
        };
      });
    } catch (error) {
      console.log('getMySnippetsError', error);
      setError(error.message);
    }
    setLoading(false);
  }

  async function joinCommunity(communityData) {
    // batch write
    // create a new community snippet
    try {
      const batch = writeBatch(db);
      const newSnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || '',
      };
      const userDocRef = doc(
        db,
        `users/${user?.uid}/communitySnippets`,
        communityData.id
      );
      batch.set(userDocRef, newSnippet);

      // updating the numberOfMembers in this community adding 1
      const communityDocRef = doc(db, 'communities', communityData.id);
      batch.update(communityDocRef, {
        numberOfMembers: increment(1),
      });

      // This will execute the batch write function
      await batch.commit();

      // update recoil state => communityState.mySnippets
      setCommunityStateValue((prev) => {
        return {
          ...prev,
          mySnippets: [...prev.mySnippets, newSnippet],
        };
      });
    } catch (error) {
      console.log('join community error', error);
      setError(error.message);
    }
    setLoading(false);
  }

  async function leaveCommunity(communityId) {
    // batch write
    // deleting a community snippet from user

    try {
      const batch = writeBatch(db);
      const userDocRef = doc(
        db,
        `users/${user?.uid}/communitySnippets`,
        communityId
      );
      batch.delete(userDocRef);

      // updating the numberOfMembers in this community subtracting 1
      const communityDocRef = doc(db, 'communities', communityId);
      batch.update(communityDocRef, {
        numberOfMembers: increment(-1),
      });

      // This will execute the batch write function
      await batch.commit();

      // update recoil state => communityState.mySnippets
      setCommunityStateValue((prev) => {
        return {
          ...prev,
          mySnippets: prev.mySnippets.filter(
            (snippet) => snippet.communityId !== communityId
          ),
        };
      });
    } catch (error) {
      console.log('leave community error', error);
      setError(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!user) return;
    getMySnippets();
  }, [user]);

  return { communityStateValue, onJoinOrLeaveCommunity, loading };
}
