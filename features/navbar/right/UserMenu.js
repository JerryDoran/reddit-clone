import {
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { FaRedditSquare } from 'react-icons/fa';
import { VscAccount } from 'react-icons/vsc';
import { CgProfile } from 'react-icons/cg';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { IoSparkles } from 'react-icons/io5';
import { MdOutlineLogin } from 'react-icons/md';
import { auth } from '../../../firebase/firebase.config';
import { signOut } from 'firebase/auth';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';
import { communityState } from '../../../atoms/communitiesAtom';

export default function UserMenu({ user }) {
  const setAuthModalState = useSetRecoilState(authModalState);
  const resetCommunityState = useResetRecoilState(communityState);

  async function logout() {
    await signOut(auth);
    // clear community state
    resetCommunityState();
  }

  return (
    <Menu>
      <MenuButton
        cursor='pointer'
        padding='0px 6px'
        borderRadius={4}
        _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
      >
        <Flex alignItems='center'>
          <Flex alignItems='center'>
            {user ? (
              <>
                <Icon
                  as={FaRedditSquare}
                  fontSize={24}
                  mr={1}
                  color='gray.300'
                />
                <Flex
                  flexDirection='column'
                  display={{ base: 'none', lg: 'flex' }}
                  fontSize='8pt'
                  alignItems='flex-start'
                  mr={8}
                >
                  <Text fontWeight={700}>
                    {user?.displayName || user?.email?.split('@')[0]}
                  </Text>
                  <Flex>
                    <Icon as={IoSparkles} color='brand.100' mr={1} />
                    <Text color='gray.400'>1 karma</Text>
                  </Flex>
                </Flex>
              </>
            ) : (
              <Icon as={VscAccount} fontSize={24} color='gray.400' mr={1} />
            )}
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        {user ? (
          <>
            <MenuItem
              fontSize='10pt'
              fontWeight={700}
              _hover={{ bg: 'blue.500', color: 'white', transition: '200ms' }}
            >
              <Flex alignItems='center'>
                <Icon as={CgProfile} fontSize={20} mr={2} />
                Profile
              </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              fontSize='10pt'
              fontWeight={700}
              _hover={{ bg: 'blue.500', color: 'white', transition: '200ms' }}
              onClick={logout}
            >
              <Flex alignItems='center'>
                <Icon as={MdOutlineLogin} fontSize={20} mr={2} />
                Logout
              </Flex>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              fontSize='10pt'
              fontWeight={700}
              _hover={{ bg: 'blue.500', color: 'white', transition: '200ms' }}
              onClick={() => setAuthModalState({ open: true, view: 'login' })}
            >
              <Flex alignItems='center'>
                <Icon as={MdOutlineLogin} fontSize={20} mr={2} />
                Log In / Sign Up
              </Flex>
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
}
