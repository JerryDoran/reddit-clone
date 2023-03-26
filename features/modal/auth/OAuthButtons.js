import { Button, Flex, Image, Text } from '@chakra-ui/react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, db } from '../../../firebase/firebase.config';

export default function OAuthButtons() {
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);

  // function for storing a newly created user in the db without using cloud functions
  async function createUserDocument(user) {
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, JSON.parse(JSON.stringify(user)));
  }

  useEffect(() => {
    if (userCred) {
      createUserDocument(userCred.user);
    }
  }, [userCred]);

  return (
    <Flex flexDirection='column' width='100%' mb={4}>
      <Button
        variant='oauth'
        mb={2}
        isLoading={loading}
        onClick={() => signInWithGoogle()}
      >
        <Image
          src='https://github.com/shadeemerhi/reddit-clone-yt/blob/main/public/images/googlelogo.png?raw=true'
          height='20px'
          mr={4}
        />
        Continue with Google
      </Button>
      <Button variant='oauth'>Some Other Provider</Button>
      {error && <Text>{error.message}</Text>}
    </Flex>
  );
}
