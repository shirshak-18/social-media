import { Form, useActionData, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import { PostList } from "../store/post-list-store";

const CreatePost = () => {
  //const { addPost } = useContext(PostList);
  const createdPost = useActionData();
  const { addPost } = useContext(PostList);
  const navigate = useNavigate();
  const hasNavigated = useRef(false);
  useEffect(() => {
    if (createdPost && !hasNavigated.current) {
      addPost(createdPost);
      hasNavigated.current = true;
      navigate("/");
    }
  }, [addPost, createdPost, navigate]);

  return (
    <Form method="POST" className="create-post">
      <div className="mb-3">
        <label htmlFor="userId" className="form-label">
          Enter your User Id here
        </label>
        <input
          type="text"
          name="userId"
          className="form-control"
          id="userId"
          placeholder="Your User Id"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Post Title
        </label>
        <input
          type="text"
          name="title"
          className="form-control"
          id="title"
          placeholder="How are you feeling today..."
        />
      </div>

      <div className="mb-3">
        <label htmlFor="body" className="form-label">
          Post Content
        </label>
        <textarea
          type="text"
          name="body"
          rows="4"
          className="form-control"
          id="body"
          placeholder="Tell us more about it"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="reactions" className="form-label">
          Number of reactions
        </label>
        <input
          type="text"
          name="reactions"
          className="form-control"
          id="reactions"
          placeholder="How many people reacted to this post"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="tags" className="form-label">
          Enter your hashtags here
        </label>
        <input
          type="text"
          className="form-control"
          id="tags"
          name="tags"
          placeholder="Please enter tags using space"
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Post
      </button>
    </Form>
  );
};

export async function createPostAction({ request }) {
  const formData = await request.formData();
  const postData = Object.fromEntries(formData);

  postData.tags = postData.tags.split(" ");

  postData.reactions = {
    likes: Number(postData.reactions),
    dislikes: 0,
  };

  const response = await fetch("https://dummyjson.com/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });

  const createdPost = await response.json();

  return createdPost;
}

export default CreatePost;
