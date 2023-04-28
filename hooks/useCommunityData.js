import { useRecoilState, useSetRecoilState } from 'recoil';
import { communityState } from '../atoms/communitiesAtom';
import { authModalState } from '../atoms/authModalAtom';
import { auth, db } from '../firebase/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  writeBatch,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function useCommunityData() {
  const [user] = useAuthState(auth);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

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

  async function getCommunityData(communityId) {
    try {
      const communityDocRef = doc(db, 'communities', communityId);
      const communityDoc = await getDoc(communityDocRef);
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          id: communityDoc.id,
          ...communityDoc.data(),
        },
      }));
    } catch (error) {
      console.log('getCommunityData:', error);
    }
  }

  useEffect(() => {
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [],
      }));
      return;
    }
    getMySnippets();
  }, [user]);

  useEffect(() => {
    const { communityId } = router.query;

    if (communityId && !communityStateValue.currentCommunity) {
      getCommunityData(communityId);
    }
  }, [router.query, communityStateValue.currentCommunity]);

  return { communityStateValue, onJoinOrLeaveCommunity, loading };
}
