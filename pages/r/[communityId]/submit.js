import { Box, Text } from '@chakra-ui/react';
import PageContent from '../../../features/layout/PageContent';
import NewPostForm from '../../../features/posts/NewPostForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/firebase.config';
import { useRecoilValue } from 'recoil';
import { communityState } from '../../../atoms/communitiesAtom';
import useCommunityData from '../../../hooks/useCommunityData';
import About from '../../../features/community/About';

export default function Submit() {
  const [user] = useAuthState(auth);
  // const communityStateValue = useRecoilValue(communityState);
  const { communityStateValue } = useCommunityData();
  console.log('communityStateValue', communityStateValue);
  return (
    <PageContent>
      <>
        <Box padding='14px 0px' borderBottom='1px solid' borderColor='white'>
          <Text>Create Post</Text>
        </Box>
        <NewPostForm user={user} />
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContent>
  );
}
