class CreateArticleDtoArticle {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}

export class CreateArticleDto {
  article: CreateArticleDtoArticle;
}

class UpdateArticleDtoArticle {
  title?: string;
  description?: string;
  body?: string;
}

export class UpdateArticleDto {
  article: UpdateArticleDtoArticle;
}
