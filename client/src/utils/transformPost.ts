import type { Post, ApiPost } from "@/types/Post";

export const transformPost = (apiPost: ApiPost): Post => {
  return {
    id: apiPost.id,
    title: apiPost.title,
    slug: apiPost.slug,
    description: apiPost.description,
    image: apiPost.image,
    authorId: apiPost.author_id,
    author: {
      id: apiPost.author.id,
      user_name: apiPost.author.user_name,
    },
    isPublished: apiPost.is_published,
    date: new Date(apiPost.date),
  };
};
