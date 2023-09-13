import { getUserWithUsername, postToJSON, firestore } from '@lib/firebase';
import UserProfile from '@components/UserProfile';
import Metatags from '@components/Metatags';
import PostFeed from '@components/PostFeed';

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  // JSON serializable data
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = firestore
      .collection('posts')
      .where('published', '==', true)
      .where('username', '==', username)
      .orderBy('createdAt', 'desc')
      .limit(5);
    posts = (await postsQuery.get()).docs.map(postToJSON);

    console.log("posts:", posts)
  } else {
    console.log("no user DOC")
  }



  return {
    props: { user, posts }, // will be passed to the page component as props
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <Metatags title={user.username} description={`${user.username}'s public profile`} />
      <UserProfile user={user} />
      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'space-around', backgroundColor:'pink', justifyContent:'space-around'}}>
        <div style={{ width: '20%', backgroundColor:'yellow' }}>
          Schedule call from here
        </div>
        <div style={{width:'50%', backgroundColor:'red'}}>
          <PostFeed posts={posts} />
        </div>
        <div style={{ width: '20%', backgroundColor:'yellow' }}>
          IMPACT MADE HERE
        </div>

      </div>

    </main>
  );
}
