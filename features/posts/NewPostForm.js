import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Flex,
} from '@chakra-ui/react';
import { BiPoll } from 'react-icons/bi';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import { AiFillCloseCircle } from 'react-icons/ai';
import TabItem from './TabItem';
import { useState } from 'react';
import TextInputs from './PostForm/TextInputs';
import ImageUpload from './PostForm/ImageUpload';
import { useRouter } from 'next/router';
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { db, storage } from '../../firebase/firebase.config';
import useSelectFile from '../../hooks/useSelectFile';

const formTabs = [
  {
    title: 'Post',
    icon: IoDocumentText,
  },
  {
    title: 'Images & Video',
    icon: IoImageOutline,
  },
  {
    title: 'Link',
    icon: BsLink45Deg,
  },
  {
    title: 'Poll',
    icon: BiPoll,
  },
  {
    title: 'Talk',
    icon: BsMic,
  },
];

export default function NewPostForm({ user }) {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: '',
    body: '',
  });
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const router = useRouter();

  async function handleCreatePost() {
    const { communityId } = router.query;

    // create new post object
    const newPost = {
      communityId,
      creatorId: user?.uid,
      creatorDisplayName: user?.email?.split('@')[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp(),
    };

    console.log('newPost', newPost);

    setLoading(true);
    // store the post in db
    try {
      const postRef = collection(db, 'posts');
      const postDocRef = await addDoc(postRef, newPost);

      // check for selected file
      if (selectedFile) {
        console.log('selectedFile', selectedFile);
        // store image file in fb storage => getDownloadURL (returns imageURL)
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, 'data_url');
        const downloadURL = await getDownloadURL(imageRef);

        // update post doc by adding the imageURL
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
      }

      // redirect the user back to the community page using the router
      router.back();
    } catch (error) {
      console.log('handleCreatePost error', error.message);
      setError(true);
    }
    setLoading(false);
  }

  function onTextChange(e) {
    const { name, value } = e.target;
    setTextInputs((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  }

  return (
    <Flex direction='column' bg='white' borderRadius={4} mt={2}>
      <Flex width='100%'>
        {formTabs.map((item) => (
          <TabItem
            key={item.title}
            {...item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex padding={4}>
        {selectedTab === 'Post' && (
          <TextInputs
            textInputs={textInputs}
            handleCreatePost={handleCreatePost}
            onChange={onTextChange}
            loading={loading}
          />
        )}
        {selectedTab === 'Images & Video' && (
          <ImageUpload
            onSelectImage={onSelectFile}
            selectedFile={selectedFile}
            setSelectedTab={setSelectedTab}
            setSelectedFile={setSelectedFile}
          />
        )}
      </Flex>
      {error && (
        <Alert status='error'>
          <AlertIcon />
          <AlertTitle mr={2}>Oops! Something went wrong!</AlertTitle>
          <AlertDescription>Error creating post!</AlertDescription>
          {/* <CloseButton position='absolute' right='8px' top='8px' /> */}
        </Alert>
      )}
    </Flex>
  );
}
