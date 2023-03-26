import { Button, Flex, Image, Stack } from '@chakra-ui/react';
import { useRef } from 'react';

export default function ImageUpload({
  onSelectImage,
  selectedFile,
  setSelectedTab,
  setSelectedFile,
}) {
  const selectedFileRef = useRef(null);
  return (
    <Flex
      justifyContent='center'
      flexDirection='column'
      alignItems='center'
      width='100%'
    >
      {selectedFile ? (
        <>
          <Image src={selectedFile} maxWidth='400px' maxHeight='400px' />
          <Stack direction='row' mt={4}>
            <Button height='28px' onClick={() => setSelectedTab('Post')}>
              Back to Post
            </Button>
            <Button
              height='28px'
              variant='outline'
              onClick={() => setSelectedFile('')}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          justifyContent='center'
          alignItems='center'
          p={20}
          border='1px dashed'
          borderColor='gray.200'
          borderRadius={4}
          width='100%'
        >
          <Button
            variant='outline'
            height='28px'
            onClick={() => selectedFileRef?.current?.click()}
          >
            Upload
          </Button>
          <input
            ref={selectedFileRef}
            type='file'
            hidden
            onChange={onSelectImage}
          />
        </Flex>
      )}
    </Flex>
  );
}
