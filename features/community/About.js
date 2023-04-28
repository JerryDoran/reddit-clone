import {
  Box,
  Flex,
  Text,
  Icon,
  Stack,
  Divider,
  Button,
  Image,
  Spinner,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import moment from 'moment';
import Link from 'next/link';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { RiCakeLine, RiErrorWarningLine } from 'react-icons/ri';
import { FaReddit } from 'react-icons/fa';
import { auth, db, storage } from '../../firebase/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRef, useState } from 'react';
import useSelectFile from '../../hooks/useSelectFile';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useSetRecoilState } from 'recoil';
import { communityState } from '../../atoms/communitiesAtom';

export default function About({ communityData }) {
  const [fileUploading, setFileUploading] = useState(false);
  const [error, setError] = useState(false);
  const [user] = useAuthState(auth);
  const selectedFileRef = useRef();
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const setCommunityStateValue = useSetRecoilState(communityState);

  async function updateImage() {
    if (!selectedFile) return;
    setFileUploading(true);
    try {
      const imageRef = ref(storage, `communities/${communityData.id}/image`);
      await uploadString(imageRef, selectedFile, 'data_url');
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(db, 'communities', communityData.id), {
        imageURL: downloadURL,
      });
      setCommunityStateValue((prev) => {
        return {
          ...prev,
          currentCommunity: {
            ...prev.currentCommunity,
            imageURL: downloadURL,
          },
        };
      });
    } catch (error) {
      console.log('updateImageError', error);
      setError(true);
    }
    setFileUploading(false);
  }

  return (
    <Box position='sticky' top='14px'>
      <Flex
        justifyContent='space-between'
        alignItems='center'
        bg='blue.400'
        color='white'
        p={3}
        borderRadius='4px 4px 0px 0px'
      >
        <Text fontSize='10pt' fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>
      <Flex direction='column' p={3} bg='white' borderRadius='0px 0px 4px 4px'>
        <Stack>
          <Flex width='100%' p={2} fontSize='10pt' fontWeight={700}>
            <Flex direction='column' flexGrow={1}>
              <Text>{communityData?.numberOfMembers?.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction='column' flexGrow={1}>
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex
            alignItems='center'
            width='100%'
            fontWeight={500}
            fontSize='10pt'
          >
            <Icon as={RiCakeLine} fontSize={18} mr={2} />
            {communityData?.createdAt && (
              <Text mt={1}>
                Created{' '}
                {moment(
                  new Date(communityData.createdAt.seconds * 1000)
                ).format('MMM DD, YYYY')}
              </Text>
            )}
          </Flex>
          <Link href={`/r/${communityData.id}/submit`}>
            <Button mt={3} height='30px' width='100%'>
              Create Post
            </Button>
          </Link>
          {user?.uid === communityData.creatorId && (
            <>
              <Divider />
              <Stack spacing={1} fontSize='10pt'>
                <Text fontWeight={600}>Admin</Text>
                <Flex alignItems='center' justifyContent='space-between'>
                  <Text
                    color='blue.400'
                    cursor='pointer'
                    _hover={{ textDecoration: 'underline' }}
                    onClick={() => selectedFileRef.current?.click()}
                  >
                    Change Image
                  </Text>
                  {communityData.imageURL || selectedFile ? (
                    <Image
                      src={selectedFile || communityData.imageURL}
                      borderRadius='full'
                      boxSize='40px'
                      alt='Community Image'
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={40}
                      color='brand.100'
                      mr={2}
                    />
                  )}
                </Flex>
                {selectedFile &&
                  (fileUploading ? (
                    <Spinner />
                  ) : (
                    <Text cursor='pointer' onClick={updateImage}>
                      Save Changes
                    </Text>
                  ))}
                <Input
                  id='file-upload'
                  type='file'
                  accept='image/x-png,image/gif,image/jpeg,image/jpg'
                  hidden
                  ref={selectedFileRef}
                  onChange={onSelectFile}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
      {error && (
        <Alert status='error'>
          <AlertIcon />
          <AlertTitle fontSize='9pt' mr={6}>
            Error!
          </AlertTitle>
          <AlertDescription fontSize='9pt'>
            Uploading image failed!
          </AlertDescription>
          {/* <CloseButton position='absolute' right='8px' top='8px' /> */}
        </Alert>
      )}
    </Box>
  );
}
