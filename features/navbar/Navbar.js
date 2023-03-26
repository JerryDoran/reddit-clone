import { Flex, Image } from '@chakra-ui/react';
import { auth } from '../../firebase/firebase.config';
import RightContent from './right/RightContent';
import SearchInput from './SearchInput';
import { useAuthState } from 'react-firebase-hooks/auth';
import Directory from './directory/Directory';

export default function Navbar() {
  const [user, loading, error] = useAuthState(auth);
  return (
    <Flex
      bg="white"
      height="44px"
      padding="6px 12px"
      justifyContent={{ md: 'space-between' }}
    >
      <Flex
        alignItems="center"
        width={{ base: '40px', md: 'auto' }}
        mr={{ base: 0, md: 2 }}
      >
        <Image
          src="https://raw.githubusercontent.com/shadeemerhi/reddit-clone-yt/d2470a696e9eae2c86622d23ff5256ad45daf2ae/public/images/redditFace.svg"
          height="30px"
        />
        <Image
          src="https://raw.githubusercontent.com/shadeemerhi/reddit-clone-yt/d2470a696e9eae2c86622d23ff5256ad45daf2ae/public/images/redditText.svg"
          height="46px"
          display={{ base: 'none', md: 'unset' }}
        />
      </Flex>
      {user && <Directory />}
      <SearchInput user={user} />
      <RightContent user={user} />
    </Flex>
  );
}
