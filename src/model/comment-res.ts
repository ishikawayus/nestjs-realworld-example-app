export interface Comment {
  id: number;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: {
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean;
  };
}

export interface SingleCommentRes {
  comment: Comment;
}

export interface MultipleCommentRes {
  comments: Comment[];
}
