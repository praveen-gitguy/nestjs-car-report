import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(email: string, password: string) {
    const user = this.userRepository.create({ email, password });

    return this.userRepository.save(user);
  }

  findOne(email: string) {
    return this.userRepository.find({ email });
  }

  find() {
    return this.userRepository.find();
  }

  findById(id: string) {
    if (!id) throw new UnauthorizedException('No user logged in');
    return this.userRepository.findOne(id);
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, attrs);

    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    return this.userRepository.remove(user);
  }
}
