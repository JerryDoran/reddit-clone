import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { useState } from 'react';
import { BsFillEyeFill, BsFillPersonFill } from 'react-icons/bs';
import { HiLockClosed } from 'react-icons/hi';
import { auth, db } from '../../../firebase/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function CreateCommunityModal({ open, handleClose }) {
  const [user] = useAuthState(auth);
  const [communityName, setCommunityName] = useState('');
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [communityType, setCommunityType] = useState('public');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    if (error) setError('');
    if (e.target.value.length > 21) return;
    setCommunityName(e.target.value);

    // recalculate how chars are left in the name
    setCharsRemaining(21 - e.target.value.length);
  }

  function handleCommunityTypeChange(e) {
    setCommunityType(e.target.name);
  }

  async function handleCreateCommunity() {
    // Validate community name
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(communityName) || communityName.length < 3) {
      setError(
        'Community names must be between 3 and 21 characters, and can only contain letters, numbers and underscores'
      );
      return;
    }
    setLoading(true);

    try {
      const communityDocRef = doc(db, 'communities', communityName);

      // Database transactions
      await runTransaction(db, async (transaction) => {
        const communityDoc = await transaction.get(communityDocRef);

        // Check if community exists in db.
        if (communityDoc.exists()) {
          throw new Error(`Sorry, r/${communityName} is taken. Try another.`);
        }

        // Create community
        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        });

        // Create communitySnippet for the user
        transaction.set(
          doc(db, `users/${user?.uid}/communitySnippets`, communityName),
          {
            communityId: communityName,
            isModerator: true,
          }
        );
      });
    } catch (error) {
      console.log('handleCreateCommunity error', error);
      setError(error.message);
    }

    setLoading(false);
  }

  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size='lg'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display='flex'
            flexDirection='column'
            fontSize={15}
            padding={3}
          >
            Create a Community
          </ModalHeader>
          <Box pl={3} pr={3}>
            <Divider />
            <ModalCloseButton />
            <ModalBody display='flex' flexDirection='column' padding='10px 0px'>
              <Text fontWeight={600} fontSize={15}>
                Name
              </Text>
              <Text fontSize={11} color='gray.500'>
                Community names including capitalization cannot be changed
              </Text>
              <Text
                fontSize={11}
                color='gray.500'
                position='relative'
                top='25px'
                left='10px'
                width='20px'
                color='gray.400'
              >
                r/
              </Text>
              <Input
                position='relative'
                value={communityName}
                size='sm'
                pl='22px'
                onChange={handleChange}
              />
              <Text
                fontSize='9pt'
                color={charsRemaining === 0 ? 'red' : 'gray.500'}
              >
                {charsRemaining} Characters remaining
              </Text>
              <Text fontSize='9pt' color='red' pt={1}>
                {error}
              </Text>
              <Box my={4}>
                <Text fontWeight={600} fontSize={15} mb={2}>
                  Community Type
                </Text>
                <Stack spacing={2}>
                  <Checkbox
                    name='public'
                    isChecked={communityType === 'public'}
                    onChange={handleCommunityTypeChange}
                  >
                    <Flex alignItems='center'>
                      <Icon as={BsFillPersonFill} color='gray.500' mr={2} />
                      <Text fontSize='10pt' mr={2}>
                        Public
                      </Text>
                      <Text fontSize='8pt' color='gray.500' pt={0.5}>
                        Anyone can view, post and comment to this community
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name='restricted'
                    isChecked={communityType === 'restricted'}
                    onChange={handleCommunityTypeChange}
                  >
                    <Flex alignItems='center'>
                      <Icon as={BsFillEyeFill} color='gray.500' mr={2} />
                      <Text fontSize='10pt' mr={2}>
                        Restricted
                      </Text>
                      <Text fontSize='8pt' color='gray.500' pt={0.5}>
                        Anyone can view this community, but only approved users
                        can post
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name='private'
                    isChecked={communityType === 'private'}
                    onChange={handleCommunityTypeChange}
                  >
                    <Flex alignItems='center'>
                      <Icon as={HiLockClosed} color='gray.500' mr={2} />
                      <Text fontSize='10pt' mr={2}>
                        Private
                      </Text>
                      <Text fontSize='8pt' color='gray.500' pt={0.5}>
                        Ony approved users can view and submit to this community
                      </Text>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>

          <ModalFooter bg='gray.100' borderRadius='0px 0px 10px 10px'>
            <Button
              variant='outline'
              height='30px'
              mr={3}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              height='30px'
              onClick={handleCreateCommunity}
              isLoading={loading}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
