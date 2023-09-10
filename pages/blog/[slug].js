import styles from '@styles/Admin.module.css';
import AuthCheck from '@components/AuthCheck';
import { firestore, auth, serverTimestamp } from '@lib/firebase';
import ImageUploader from '@components/ImageUploader';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminPostEdit(props) {

    return (
        <AuthCheck>
            <PostManager />
        </AuthCheck>
    );

}

function PostManager() {
    const [preview, setPreview] = useState(false);
    const [post, setPost] = useState(null); // Use state to store the post data

    const router = useRouter();
    const { slug } = router.query;
    const postRef = firestore.collection('posts').where('slug', '==', slug);

    console.log(post);

    useEffect(() => {
        // Create a function to fetch the post data based on the slug
        const fetchPost = async () => {
            try {
                const postSnapshot = await postRef.get();

                if (!postSnapshot.empty) {
                    // Assuming you only expect one matching post
                    const postData = postSnapshot.docs[0].data();
                    console.log(postSnapshot.docs[0])
                    setPost({id:postSnapshot.docs[0].id,data:postData});
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        if (slug) {
            fetchPost();
        }
    }, [slug]); // Run this effect whenever the slug changes

    return (
        <main className={styles.container}>
            {post && (
                <>
                    <section>
                        <h1>{post.data.title}</h1>
                        <p>ID: {post.data.slug}</p>

                        <PostForm defaultValues={post.data} preview={preview} postId={post.id} />
                    </section>

                    <aside>
                        <h3>Tools</h3>
                        <button onClick={() => setPreview(!preview)}>
                            {preview ? 'Edit' : 'Preview'}
                        </button>

                        <Link href={`/${post.data.username}/${post.data.slug}`}>Live view</Link>

                        <DeletePostButton postRef={post.id} />
                    </aside>
                </>
            )}
        </main>
    );
}

function PostForm({ defaultValues, preview,postId }) {

    console.log("POSTID:",postId)

    const postRef= firestore.collection('posts').doc(postId);

    const { register, errors, handleSubmit, formState, reset, watch } = useForm({ defaultValues, mode: 'onChange' });

    const { isValid, isDirty } = formState;

    const tagOptions = ['SOP', 'Blog', 'Hack', 'VISA', 'Essay'];

    const updatePost = async ({ content, published, tag }) => {
        await postRef.update({
            content,
            published,
            updatedAt: serverTimestamp(),
            tag
        });

        reset({ content, published });

        toast.success('Post updated successfully!');
    };

    return (
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className="card">
                    <ReactMarkdown>{watch('content')}</ReactMarkdown>
                </div>
            )}

            <select
                name="tag"
                {...register('tag', {
                    required: { value: true, message: 'Tag is required' },
                })}
                className="w-full h-10 px-4 py-2 bg-white border rounded-lg shadow appearance-none focus:outline-none focus:ring focus:border-blue-500"
            >
                <option value="" disabled selected>
                    Select a tag
                </option>
                {tagOptions.map((tag, index) => (
                    <option key={index} value={tag}>
                        {tag}
                    </option>
                ))}
            </select>

            <div className={preview ? styles.hidden : styles.controls}>
                <ImageUploader />

                <textarea
                    name="content"
                    {...register('content', {
                        maxLength: { value: 20000, message: 'Content is too long' },
                        minLength: { value: 10, message: 'Content is too short' },
                        required: { value: true, message: 'Content is required' },
                    })}
                ></textarea>


                {errors && <p className="text-danger">{errors}</p>}

                <fieldset>
                    <input
                        className={styles.checkbox}
                        name="published"
                        type="checkbox"
                        {...register('published')} // Provide the field name as an argument to register
                    />
                    <label>Published</label>

                </fieldset>

                <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
                    Save Changes
                </button>
            </div>
        </form>
    );
}

function DeletePostButton({ id }) {
    const router = useRouter();

    const postRef = firestore.collection('posts').doc(id);
    const userPostRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(id);

    const deletePost = async () => {
        const doIt = confirm('are you sure!');
        if (doIt) {
            await postRef.delete();
            await userPostRef.delete();
            console.log("POST DELETED")
            //router.push('/blog');
            toast('post annihilated ', { icon: '🗑️' });
        }
    };

    return (
        <button className="btn-red" onClick={deletePost}>
            Delete
        </button>
    );
}

//delete post not working check