import { useAuthState } from 'react-firebase-hooks/auth';
import PageContent from '../../../../features/layout/PageContent';
import PostItem from '../../../../features/posts/PostItem';
import usePosts from '../../../../hooks/usePosts';
import { auth } from '../../../../firebase/firebase.config';

export default function PostDetailsPage() {
  const [user] = useAuthState(auth);
  const { postStateValue, setPostStateValue, onDeletePost, onVote } =
    usePosts();
  return (
    <PageContent>
      <>
        {postStateValue.selectedPost && (
          <PostItem
            post={postStateValue.selectedPost}
            onVote={onVote}
            onDeletePost={onDeletePost}
            userVoteValue={
              postStateValue.postVotes.find(
                (item) => item.postId === postStateValue.selectedPost?.id
              )?.voteValue
            }
            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
          />
        )}
      </>
      <>{/* About */}</>
    </PageContent>
  );
}
