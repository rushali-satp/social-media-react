import React, { useState } from "react";

const PostList = ({
  posts,
  onLike,
  onAddComment,
  onDelete,
  isMyPost
}) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center mt-4">
        <h5 className="text-muted">No Posts Yet</h5>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          onLike={onLike}
          onAddComment={onAddComment}
          onDelete={onDelete}
          isMyPost={isMyPost}
        />
      ))}
    </div>
  );
};

const PostItem = ({
  post,
  onLike,
  onAddComment,
  onDelete,
  isMyPost
}) => {
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText);
    setCommentText("");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDelete(post.id);
    }
  };

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h6 className="card-subtitle mb-2 text-muted">
          @{post.author}
        </h6>

        {post.text && <p className="card-text">{post.text}</p>}

        {post.image && (
          <div className="mb-2 text-center">
            <img
              src={post.image}
              alt="post"
              className="img-fluid rounded"
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
          </div>
        )}

        {/* 🎵 MUSIC (NEW) */}
        {post.music && (
          <div className="mb-2">
            <small className="text-muted">🎵 Music</small>
            <audio controls className="w-100 mt-1">
              <source src={post.music} />
              Your browser does not support audio.
            </audio>
          </div>
        )}

      <div className="d-flex gap-2">

        {/* 👍 Like */}
        <button
          className="btn btn-outline-primary btn-sm me-2"
          onClick={() => onLike(post.id)}
        >
          👍 {post.likes}
        </button>

        <button className="btn btn-outline-secondary btn-sm">
          💬 {post.comments ? post.comments.length : 0}
        </button>

        {/* 🗑 Delete (Only in My Posts) */}
        {isMyPost && (
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDelete}
          >
            🗑 Delete
          </button>
        )}

     </div>

        {/* 💬 Existing comments */}
       {post.comments && post.comments.length > 0 && (
        <div className="mt-2">
          {post.comments.map((comment) => (
            <div key={comment.commentId} className="small mb-1">
              💬 {comment.commentText}
            </div>
          ))}
        </div>
      )}


        {/* ➕ Add new comment */}
        <div className="mt-2 d-flex gap-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            className="btn btn-primary btn-sm"
            onClick={handleCommentSubmit}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostList;
