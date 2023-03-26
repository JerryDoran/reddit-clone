import { Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Flex
      direction='column'
      justify='center'
      alignItems='center'
      minHeight='60vh'
    >
      Sorry that community does not exist or has been banned
      <Link href='/'>
        <Button mt={4}>GO HOME</Button>
      </Link>
    </Flex>
  );
}
