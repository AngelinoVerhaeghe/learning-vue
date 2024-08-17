export interface Post {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  authorId: number;
  author: Author;
  isPublished: boolean;
  date: Date;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiPost {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  author_id: number;
  author: {
    id: number;
    user_name: string;
  };
  is_published: boolean;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse {
  message: string;
  posts: ApiPost[];
}

export interface ApiPostResponse {
  message: string;
  post: ApiPost;
}

export interface Author {
  id: number;
  user_name: string;
}
