import { Button, Flex, Input, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, db } from '../../../firebase/firebase.config';
import { FIREBASE_ERRORS } from '../../../firebase/errors';
import { addDoc, collection } from 'firebase/firestore';

export default function SignUp() {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState();

  // react-firebase-hooks
  const [createUserWithEmailAndPassword, userCred, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  // Firebase logic goes here
  function handleSubmit(e) {
    e.preventDefault();
    if (error) setError('');
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
  }

  function handleChange(e) {
    setSignUpForm((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  // function for storing a newly created user in the db without using cloud functions
  async function createUserDocument(user) {
    const colRef = collection(db, 'users');
    await addDoc(colRef, JSON.parse(JSON.stringify(user)));
  }

  useEffect(() => {
    if (userCred) {
      createUserDocument(userCred.user);
    }
  }, [userCred]);

  return (
    <form onSubmit={handleSubmit}>
      <Input
        required
        name='email'
        placeholder='email'
        type='email'
        mb={2}
        onChange={handleChange}
        fontSize='10pt'
        _placeholder={{ color: 'gray.500' }}
        _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        bg='gray.50'
      />
      <Input
        required
        name='password'
        placeholder='password'
        type='password'
        mb={2}
        onChange={handleChange}
        fontSize='10pt'
        _placeholder={{ color: 'gray.500' }}
        _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        bg='gray.50'
      />
      <Input
        required
        name='confirmPassword'
        placeholder='confirm password'
        type='password'
        mb={2}
        onChange={handleChange}
        fontSize='10pt'
        _placeholder={{ color: 'gray.500' }}
        _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        bg='gray.50'
      />

      <Text textAlign='center' color='red.500' fontSize='10pt'>
        {error || FIREBASE_ERRORS[userError?.message]}
      </Text>

      <Button
        width='100%'
        height='36px'
        mt={2}
        mb={2}
        type='submit'
        isLoading={loading}
      >
        Sign Up
      </Button>
      <Flex fontSize='9pt' justifyContent='center'>
        <Text mr={2}>Already a redditor?</Text>
        <Text
          color='blue.500'
          cursor='pointer'
          fontWeight={700}
          onClick={() =>
            setAuthModalState((prev) => {
              return {
                ...prev,
                view: 'login',
              };
            })
          }
        >
          LOGIN
        </Text>
      </Flex>
    </form>
  );
}
