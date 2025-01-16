"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";

type MetadataType = {
  mimetype: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  archiveCount: number;
  shareCount: number;
};

export type PostMediaType = {
  mimeType: string;
  id: number;
  title: string;
  description: string;
  url: string;
  metadata: MetadataType;
};

export type PostType = {
  id: number;
  userId: number;
  title: string;
  avatar: string;
  mediaResource: PostMediaType[];
  username: string;
  metadata: MetadataType;
  createdAt: string;
  body: string;
};

interface PostContextType {
  posts: PostType[];
  loading: boolean;
  fetchPosts: () => Promise<void>;
  fetchPostDetail: (id: number) => PostType | null;
  likePost: (postId: number) => Promise<void>;
  followUser: (userId: number) => Promise<void>;
  updateCommentsCount: (postId: number, newCount: number) => void;
  updateViewsCount: (postId: number, newCount: any) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
};

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider = ({ children }: PostProviderProps) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_BASEURL;

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/posts?page=1&limit=20`);
      const data = await response.json();
      if (response.ok) {
        setPosts(data.data.posts);
      }
    } catch (error) {
      console.log("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const fetchPostDetail = useCallback(
    (id: number): PostType | null => {
      try {
        setLoading(false)
        const post = posts.find((p) => p.id === id);
        return post || null;
      } catch (error) {
        console.log("Error fetching post details:", error);
        return null;
      } finally {
        setLoading(false)
      }
    },
    [posts]
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSetLike = (postId: number, data: any) => {
    const postLike = {
      metadata: { ...data.metadata, likesCount: data.metadata.likesCount },
    };
    if (posts && posts.length > 0) {
      setPosts((prevPosts) =>
        prevPosts?.map((post) =>
          post.id === postId ? { ...post, ...postLike } : post
        )
      );
    }
  };

  const likePost = async (postId: number) => {
    try {
      const response = await fetch(`${baseUrl}/posts/${postId}/toggle-like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        handleSetLike(postId, data.data);
      }
    } catch (error) {
      console.log("Error liking post:", error);
    }
  };

  const followUser = async (userId: number) => {
    try {
      await fetch(`${baseUrl}/users/follows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.log("Error following user:", error);
    }
  };

  const updateCommentsCount = (postId: number, newCount: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, metadata: { ...post.metadata, commentsCount: newCount } }
          : post
      )
    );
  };

  const updateViewsCount = (postId: number, updater: any) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
            ...post,
            mediaResource: post.mediaResource.map(
              (media: PostMediaType, index) =>
                index === 0
                  ? {
                    ...media,
                    metadata: {
                      ...media.metadata,
                      viewsCount: updater(media.metadata.viewsCount || 0),
                    },
                  }
                  : media
            ),
          }
          : post
      )
    );
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        fetchPosts,
        fetchPostDetail,
        likePost,
        followUser,
        updateCommentsCount,
        updateViewsCount,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
