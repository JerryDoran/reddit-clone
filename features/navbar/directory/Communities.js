import { Flex, Icon, MenuItem } from '@chakra-ui/react';
import CreateCommunityModal from '../../modal/createCommunity/CreateCommunityModal';
import { GrAdd } from 'react-icons/gr';
import { useState } from 'react';

export default function Communities() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <MenuItem
        width="100%"
        fontSize="10pt"
        _hover={{ bg: 'gray.100' }}
        onClick={() => setOpen(true)}
      >
        <Flex alignItems="center">
          <Icon fontSize={20} mr={2} as={GrAdd} />
          Create Community
        </Flex>
      </MenuItem>
    </>
  );
}
