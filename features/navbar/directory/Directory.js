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

import { ChevronDownIcon } from '@chakra-ui/icons';
import { TiHome } from 'react-icons/ti';
import Communities from './Communities';

export default function Directory() {
  return (
    <Menu>
      <MenuButton
        cursor='pointer'
        padding='0px 6px'
        borderRadius={4}
        _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
        ml={2}
        mr={2}
      >
        <Flex
          alignItems='center'
          justifyContent='space-between'
          width={{ base: 'auto', lg: '200px' }}
        >
          <Flex alignItems='center'>
            <Icon as={TiHome} fontSize={22} mr={{ base: 1, md: 2 }} mb={1} />
            <Flex display={{ base: 'none', md: 'flex' }}>
              <Text fontWeight={600} fontSize='10pt'>
                Home
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  );
}
