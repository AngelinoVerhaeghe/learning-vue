import { defineStore } from "pinia";
import api from "@/api/axios";
import type { ApiPost, ApiPostResponse, ApiResponse, Post } from "@/types/Post";
import { ref } from "vue";
import router from "@/router";
import { useToastHandler } from "@/composables/useToastHandler";
import { useToastStore } from "@/stores/ToastStore";
import { transformPost } from "@/utils/transformPost";

useToastHandler();

const toastStore = useToastStore();

export const usePostStore = defineStore("post", () => {
  const posts = ref<Post[]>([]);
  const post = ref<Post | null>(null);
  const loading = ref(false);

  const loadPosts = async () => {
    try {
      const response = await api.get<ApiResponse>("/api/posts");
      if (response.status === 200) {
        if (response.data.posts && response.data.posts.length > 0) {
          posts.value = response.data.posts.map((apiPost: ApiPost) =>
            transformPost(apiPost),
          );
        } else {
          console.log("No posts available.");
          posts.value = []; // Set posts to an empty array if there are no posts
        }
      } else {
        console.error(
          `Failed to load posts: Server responded with status code ${response.status}`,
        );
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    }
  };

  const createPost = async (
    title: string,
    slug: string,
    description: string,
    image: string,
    authorId: number,
    isPublished: boolean,
    date: Date,
  ) => {
    if (!title || title.trim() === "") {
      throw new Error("Title is required");
    }

    if (!description || description.trim() === "") {
      throw new Error("Description is required");
    }

    if (authorId === null || authorId === undefined) {
      throw new Error("Author is required");
    }

    if (!date) {
      throw new Error("Date is required");
    }

    try {
      // Choose a random keyword to generate a random image
      const keywords = ["nature", "city", "food", "dog"];
      const randomKeyword =
        keywords[Math.floor(Math.random() * keywords.length)];
      const randomImage = generateRandomImage(randomKeyword);

      const response = await api.post<ApiPost>("/api/posts", {
        title: title,
        slug: slug,
        description: description,
        image: randomImage,
        author_id: authorId,
        is_published: isPublished,
        date: date,
      });
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const getPost = async (slug: string) => {
    try {
      const response = await api.get<ApiPostResponse>(`/api/posts/${slug}`);
      if (response.status === 200) {
        post.value = transformPost(response.data.post);
      } else {
        console.log(`No post found with slug: ${slug}`);
        post.value = null;
      }
    } catch (error) {
      console.error("Failed to load post:", error);
    }
  };

  const deletePost = async (slug: string) => {
    try {
      const response = await api.delete(`/api/posts/${slug}`);
      if (response.status === 200 || response.status === 204) {
        posts.value = posts.value.filter((post) => post.slug !== slug);
        toastStore.triggerSuccess("Post deleted successfully");
        await router.push({ name: "home" });
      } else {
        console.error(
          `Failed to delete post: Server responded with status code ${response.status}`,
        );
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const editPost = async (
    slug: string, // The slug of the post to edit
    title: string,
    description: string,
    image: string,
    authorId: number,
    isPublished: boolean,
    date: Date,
  ) => {
    try {
      const response = await api.put<ApiPost>(`/api/posts/${slug}`, {
        title,
        description,
        image,
        author: { id: authorId },
        is_published: isPublished,
        date,
      });

      if (response.status === 200) {
      } else {
        console.error(
          `Failed to edit post: Server responded with status code ${response.status}`,
        );
        return undefined;
      }
    } catch (error) {
      console.error("Failed to edit post:", error);
      throw error;
    }
  };

  const generateRandomImage = (keyword: string = "nature"): string => {
    return `https://loremflickr.com/640/360/${keyword}?random=${Math.floor(Math.random() * 1000)}`;
  };

  return {
    posts,
    loadPosts,
    createPost,
    getPost,
    post,
    deletePost,
    editPost,
  };
});
