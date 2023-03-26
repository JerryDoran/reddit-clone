import { Flex } from '@chakra-ui/react';
import AuthModal from '../../modal/auth/AuthModal';
import AuthButtons from './AuthButtons';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase/firebase.config';
import Icons from './Icons';
import UserMenu from './UserMenu';

export default function RightContent({ user }) {
  return (
    <>
      <AuthModal />
      <Flex justifyContent="center" alignItems="center">
        {user ? <Icons /> : <AuthButtons />}
        <UserMenu user={user} />
      </Flex>
    </>
  );
}
