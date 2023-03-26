import { Flex } from '@chakra-ui/react';
import React from 'react';

export default function PageContent({ children }) {
  return (
    <Flex justifyContent='center' p='16px 0px'>
      <Flex width='95%' maxWidth='865px' justifyContent='center'>
        {/* Left Hand Side */}
        <Flex
          flexDirection='column'
          width={{ base: '100%', md: '65%' }}
          mr={{ base: 0, md: 6 }}
        >
          {children && children[0]}
        </Flex>

        {/* Right Hand Side */}
        <Flex
          flexDirection='column'
          display={{ base: 'none', md: 'flex' }}
          flexGrow={1}
        >
          {children && children[1]}
        </Flex>
      </Flex>
    </Flex>
  );
}
