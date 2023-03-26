import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase.config';
import safeJsonStringify from 'safe-json-stringify';
import NotFound from '../../../features/community/NotFound';
import Header from '../../../features/community/Header';
import PageContent from '../../../features/layout/PageContent';
import CreatePostLink from '../../../features/community/CreatePostLink';
import Posts from '../../../features/posts/Posts';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { communityState } from '../../../atoms/communitiesAtom';
import About from '../../../features/community/About';

export default function CommunityPage({ communityData }) {
  const setCommunityStateValue = useSetRecoilState(communityState);
  if (!communityData) {
    return <NotFound />;
  }

  useEffect(() => {
    setCommunityStateValue((prev) => {
      return {
        ...prev,
        currentCommunity: communityData,
      };
    });
  }, []);

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>
          <About />
        </>
      </PageContent>
    </>
  );
}

export async function getServerSideProps(context) {
  // Get community data
  try {
    const communityDocRef = doc(db, 'communities', context.query.communityId);
    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
            )
          : '',
      },
    };
  } catch (error) {
    // Could add error page here
    console.log('getServerSideProps error:', error);
  }
}
