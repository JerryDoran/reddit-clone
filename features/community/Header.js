import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react';
import { FaReddit } from 'react-icons/fa';
import useCommunityData from '../../hooks/useCommunityData';

export default function Header({ communityData }) {
  const { communityStateValue, onJoinOrLeaveCommunity, loading } =
    useCommunityData();

  // '!!' operator converts a value to a boolean
  const isJoined = !!communityStateValue.mySnippets.find(
    (item) => item.communityId === communityData.id
  );

  return (
    <Flex direction='column' width='100%' height='146px'>
      <Box height='50%' bg='blue.400' />
      <Flex justifyContent='center' bg='white' flexGrow={1}>
        <Flex width='95%' maxWidth='860px'>
          {communityStateValue.currentCommunity.imageURL ? (
            <Image
              src={communityStateValue.currentCommunity.imageURL}
              borderRadius='full'
              boxSize='66px'
              alt='community image'
              position='relative'
              top={-3}
              color='blue.500'
              border='4px solid white'
            />
          ) : (
            <Flex
              width={68}
              height={68}
              bg='white'
              position='relative'
              top={-3}
              border='4px solid white'
              borderRadius={50}
              alignItems='center'
              justifyContent='center'
            >
              <Icon
                as={FaReddit}
                fontSize={64}
                color='blue.500'
                borderRadius={50}
              />
            </Flex>
          )}
          <Flex padding='10px 16px'>
            <Flex direction='column' mr={6}>
              <Text fontWeight={800} fontSize='16pt'>
                {communityData.id}
              </Text>
              <Text fontWeight={600} fontSize='10pt' color='gray.400'>
                r/{communityData.id}
              </Text>
            </Flex>
            <Button
              variant={isJoined ? 'outline' : 'solid'}
              height={30}
              px={6}
              isLoading={loading}
              onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
            >
              {isJoined ? 'Joined' : 'Join'}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
