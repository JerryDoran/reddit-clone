import { useState } from 'react';
import {
  Flex,
  Icon,
  Image,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsChat, BsDot } from 'react-icons/bs';
import { FaReddit } from 'react-icons/fa';
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from 'react-icons/io5';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export default function PostItem({
  post,
  userIsCreator,
  userVoteValue,
  onVote,
  onDeletePost,
  onSelectPost,
}) {
  const router = useRouter();
  const [loadingImage, setLoadingImage] = useState(true);
  const [error, setError] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // this line detects whether or not we are on a single post page.  If the onSelectPost is undefined(falsy)
  // then we are on the single post page
  const singlePostPage = !onSelectPost;

  const toast = useToast();

  async function handleDelete(e) {
    e.stopPropagation();
    setLoadingDelete(true);
    try {
      const success = await onDeletePost(post);

      if (!success) {
        throw new Error('Failed to delete post!');
      }

      toast({
        title: 'Post deleted!',
        description: 'Your post successfully deleted!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      if (singlePostPage) {
        router.push(`/r/${post.communityId}`);
      }
    } catch (error) {
      setError(error.message);
      toast({
        title: 'Delete Error!',
        description: 'There was a problem deleting the post.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setLoadingDelete(false);
  }

  return (
    <Flex
      border='1px solid'
      bg='white'
      borderColor={singlePostPage ? 'white' : 'gray.300'}
      borderRadius={singlePostPage ? '4px 4px 0px 0px' : '4px'}
      _hover={{ borderColor: singlePostPage ? 'none' : 'gray.500' }}
      cursor={singlePostPage ? 'unset' : 'pointer'}
      onClick={() => onSelectPost && onSelectPost(post)}
    >
      <Flex
        flexDirection='column'
        alignItems='center'
        bg={singlePostPage ? 'none' : 'gray.100'}
        p={2}
        width='40px'
        borderRadius={singlePostPage ? '0' : '3px 0px 0px 3px'}
      >
        <Icon
          as={
            userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
          }
          color={userVoteValue === 1 ? 'brand.100' : 'gray.400'}
          fontSize={22}
          onClick={(e) => onVote(e, post, 1, post.communityId)}
          cursor='pointer'
        />
        <Text fontSize='9pt'>{post?.voteStatus}</Text>
        <Icon
          as={
            userVoteValue === -1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={userVoteValue === -1 ? '#4379ff' : 'gray.400'}
          fontSize={22}
          onClick={(e) => onVote(e, post, -1, post.communityId)}
          cursor='pointer'
        />
      </Flex>
      <Flex flexDirection='column' width='100%'>
        <Stack spacing={1} padding='10px'>
          <Stack
            direction='row'
            spacing={0.6}
            alignItems='center'
            fontSize='9pt'
          >
            {/* Home page check */}
            <Text>
              Posted by u/{post?.creatorDisplayName}{' '}
              {moment(new Date(post?.createdAt?.seconds * 1000)).fromNow()}
            </Text>
          </Stack>
          <Text fontSize='12pt' fontWeight={600}>
            {post?.title}
          </Text>
          <Text fontSize='10pt'>{post?.body}</Text>
          {post?.imageURL && (
            <Flex justifyContent='center' alignItems='center' padding={2}>
              {loadingImage && (
                <Skeleton height='200px' width='100%' borderRadius={4} />
              )}
              <Image
                src={post.imageURL}
                maxHeight='460px'
                alt='Post Image'
                display={loadingImage ? 'none' : 'unset'}
                onLoad={() => setLoadingImage(false)}
              />
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={0.5} color='gray.500'>
          <Flex
            alignItems='center'
            padding='8px 10px'
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor='pointer'
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize='9pt'>{post?.numberOfComments}</Text>
          </Flex>
          <Flex
            alignItems='center'
            padding='8px 10px'
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor='pointer'
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize='9pt'>Share</Text>
          </Flex>
          <Flex
            alignItems='center'
            padding='8px 10px'
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
            cursor='pointer'
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize='9pt'>Save</Text>
          </Flex>
          {userIsCreator && (
            <Flex
              alignItems='center'
              padding='8px 10px'
              borderRadius={4}
              _hover={{ bg: 'gray.200' }}
              cursor='pointer'
              onClick={handleDelete}
            >
              {loadingDelete ? (
                <Spinner size='sm' />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                  <Text fontSize='9pt'>Delete</Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
