import styles from '@styles/Post.module.css';
import PostContent from '@components/PostContent';
import HeartButton from '@components/HeartButton';
import AuthCheck from '@components/AuthCheck';
import Metatags from '@components/Metatags';
import { UserContext } from '@lib/context';
import { firestore, getUserWithUsername, postToJSON } from '@lib/firebase';
import { useRouter } from 'next/router';

import Link from 'next/link';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useContext, useEffect, useState } from 'react';

export default function Post() {
  const router = useRouter();
  const { username, slug } = router.query;
  const [post, setPost] = useState(null);
  const [postRef, setPostRef] = useState(null);

  useEffect(() => {
    if (username && slug) {
      const postRef = firestore
        .collection('posts')
        .where('username', '==', username)
        .where('published', '==', true)
        .where('slug', '==', slug);

        setPostRef(postRef);

      const getPost = async () => {
        try {
          const querySnapshot = await postRef.get();
          if (!querySnapshot.empty) {
            const postData = querySnapshot.docs[0].data();
            setPost(postData);
          } else {
            // Handle the case where no matching post was found.
          }
        } catch (error) {
          // Handle any errors that may occur during the query.
          console.error('Error getting post:', error);
        }
      };

      getPost();
    }
  }, [username, slug]);

  if (!username || !slug) {
    // Render loading or error state if username or slug is not available yet.
    return <div>Loading...</div>;
  }

  // Render post content here.
  return (
    <div>
      {/* Render your post content using the 'post' state */}
      {post ? (
        <div>
          {/* Render your post content using 'post' */}
          <main className={styles.container}>
            <Metatags title={post.title} description={post.title} />

            <section>
              <PostContent post={post} />
            </section>

            <aside className="card">
              <p>
                <strong>{post.heartCount || 0} 🤍</strong>
              </p>
              {/*<HeartButton postRef={postRef} / >  improve this according to vote in opp*/}
            </aside>
          </main>
        </div>
      ) : (
        <div>No post found.</div>
      )}
    </div>
  );

}
