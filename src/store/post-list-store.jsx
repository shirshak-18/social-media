import { createContext, useCallback, useEffect, useReducer } from "react";

export const PostList = createContext({
  postList: [],
  addPost: () => {},
  deletePost: () => {},
});

const postListReducer = (currPostList, action) => {
  let newPostList = currPostList;
  if (action.type === "DELETE_POST") {
    newPostList = currPostList.filter(
      (post) => post.id !== action.payload.postId
    );
  } else if (action.type === "ADD_INITIAL_POSTS") {
    newPostList = Array.isArray(action.payload.posts)
      ? action.payload.posts
      : [];
  } else if (action.type === "ADD_POST") {
    newPostList = [action.payload, ...currPostList];
  }
  return newPostList;
};

const PostListProvider = ({ children }) => {
  const [postList, dispatchPostList] = useReducer(postListReducer, []);
  useEffect(() => {
    fetch("https://dummyjson.com/posts")
      .then((res) => res.json())
      .then((data) => {
        dispatchPostList({
          type: "ADD_INITIAL_POSTS",
          payload: {
            posts: Array.isArray(data.posts) ? data.posts : [],
          },
        });
      })
      .catch((error) => {
        console.error("Failed to load posts", error);
        dispatchPostList({
          type: "ADD_INITIAL_POSTS",
          payload: { posts: [] },
        });
      });
  }, []);

  const addPost = (post) => {
    dispatchPostList({
      type: "ADD_POST",
      payload: post,
    });
  };

  // const addInitialPosts = (posts) => {
  //   dispatchPostList({
  //     type: "ADD_INITIAL_POSTS",
  //     payload: {
  //       posts,
  //     },
  //   });
  // };

  const deletePost = useCallback(
    (postId) => {
      dispatchPostList({
        type: "DELETE_POST",
        payload: {
          postId,
        },
      });
    },
    [dispatchPostList]
  );

  return (
    <PostList.Provider value={{ postList, addPost, deletePost }}>
      {children}
    </PostList.Provider>
  );
};

export default PostListProvider;
