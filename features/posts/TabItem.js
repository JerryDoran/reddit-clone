import { Flex, Icon, Text } from '@chakra-ui/react';

export default function TabItem({ title, icon, selected, setSelectedTab }) {
  return (
    <Flex
      justifyContent='center'
      alignItems='center'
      flexGrow={1}
      padding='14px 0px'
      cursor='pointer'
      fontWeight={700}
      _hover={{ bg: 'gray.50' }}
      color={selected ? 'blue.500' : 'gray.500'}
      borderWidth={selected ? '0px 1px 2px 0px' : '0px 1px 1px 0px'}
      borderBottomColor={selected ? 'blue.500' : 'gray.200'}
      borderRightColor='gray.200'
      onClick={() => setSelectedTab(title)}
    >
      <Flex alignItems='center' height='20px' mr={2}>
        <Icon as={icon} />
      </Flex>
      <Text fontSize='10pt'>{title}</Text>
    </Flex>
  );
}
