import { useEffect, useState, useCallback } from "react";
import Post from "./Post";
import { useAuth } from "../../Providers/AuthProvider";
import "../../styles/MainScreen.css";
import { Skeleton } from "../../components/ui/PostSkeleton";

const MainScreen = () => {
  const { getCurrentUser, getAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const baseUrl = process.env.REACT_APP_BASEURL;

  const fetchposts = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/posts?page=1&&limit=20`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setPosts(data.data.posts);
        console.log(data.data.posts);

        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }, [baseUrl]);

  useEffect(() => {
    console.log("getCurrentUser, getAuth", getCurrentUser(), getAuth());
    fetchposts();
  }, [fetchposts, getAuth, getCurrentUser]);

  return (
    <>
      <div className="md:col-span-3 grid grid-cols gap-4 w-full">
        {posts.length < 1 || loading ? (
          <Skeleton />
        ) : (
          posts &&
          posts.map((post, index) => {
            return (
                <Post
                  key={index}
                  resource={post}
                  className="col-span-1 py-2 border-b-black ml-24"
                  media={post.thumbnailUrl}
                  profilePic={post.avatar}
                  title={post.title}
                  description={post.body}
                  likesCount={post.likesCount}
                  commentsCount={post.commentsCount}
                  pin={188.9}
                  views={202.2}
                  shares={202.2}
                />
            );
          })
        )}
      </div>
    </>
  );
};

export default MainScreen;
