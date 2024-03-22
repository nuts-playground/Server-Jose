import { Module } from '@nestjs/common';
import { PostService } from './providers/post.service';
import { PostRepositoryService } from './providers/post-repository.service';
import { PostController } from './controllers/post.controller';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepositoryService],
})
export class PostModule {}
