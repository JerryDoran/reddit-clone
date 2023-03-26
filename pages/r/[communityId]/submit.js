import { Box, Text } from '@chakra-ui/react';
import PageContent from '../../../features/layout/PageContent';
import NewPostForm from '../../../features/posts/NewPostForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/firebase.config';
import { useRecoilValue } from 'recoil';
import { communityState } from '../../../atoms/communitiesAtom';

export default function Submit() {
  const [user] = useAuthState(auth);
  const communityStateValue = useRecoilValue(communityState);
  console.log('communityStateValue', communityStateValue);
  return (
    <PageContent>
      <>
        <Box padding='14px 0px' borderBottom='1px solid' borderColor='white'>
          <Text>Create Post</Text>
        </Box>
        <NewPostForm user={user} />
      </>
      <></>
    </PageContent>
  );
}
