import { Button, Flex, Input, Stack, Textarea } from '@chakra-ui/react';
import React from 'react';

export default function TextInputs({
  textInputs,
  onChange,
  handleCreatePost,
  loading,
}) {
  return (
    <Stack spacing={3} width='100%'>
      <Input
        name='title'
        value={textInputs.title}
        onChange={onChange}
        fontSize='10pt'
        borderRadius={4}
        placeholder='Title'
        _placeholder={{ color: 'gray.400' }}
        _focus={{
          ouline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'black',
        }}
      />
      <Textarea
        name='body'
        value={textInputs.body}
        onChange={onChange}
        fontSize='10pt'
        borderRadius={4}
        height='100px'
        placeholder='Text (optional)'
        _placeholder={{ color: 'gray.400' }}
        _focus={{
          ouline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'black',
        }}
      />
      <Flex justifyContent='flex-end'>
        <Button
          height='34px'
          padding='0px 30px'
          isDisabled={!textInputs.title}
          isLoading={loading}
          onClick={handleCreatePost}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  );
}
