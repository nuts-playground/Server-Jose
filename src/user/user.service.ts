import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async signUp(dto: SignUpDto) {
    console.log(dto.getEmail);
    console.log(dto.getName);
    console.log(dto.getPassword);
  }

  async signIn(dto: SignInDto) {
    console.log(dto.getEmail);
    console.log(dto.getPassword);
  }

  async findOne(email: string) {
    console.log(email);
  }
}
