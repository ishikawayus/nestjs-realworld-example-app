import { Controller, Get } from '@nestjs/common';
import { TagRepository } from '../repository';
import { TagsRes } from '../model/tag-res';

@Controller()
export class TagController {
  constructor(private tagRepository: TagRepository) {}

  @Get('/api/tags')
  async getTags(): Promise<TagsRes> {
    const tags = await this.tagRepository.find();
    return {
      tags: tags.map((tag) => tag.value).sort(),
    };
  }
}
