import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostService } from '../providers/post.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtGuard)
  @Post('/create')
  async createPost(@Body() dto) {
    return await this.postService.createPost(dto);
  }

  @Get('/getPosts')
  async getPosts() {
    return await this.postService.getPosts();
  }

  @Get('/getPost')
  async getPost() {
    return await this.postService.getPost();
  }

  @UseGuards(JwtGuard)
  @Patch('/updatePost')
  async updatePost() {
    return await this.postService.updatePost();
  }

  @UseGuards(JwtGuard)
  @Delete('/deletePost')
  async deletePost() {
    return await this.postService.deletePost();
  }
}
