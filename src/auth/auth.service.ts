import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  register(registerDto: RegisterDto) {
    /**
     * 1. Check user already exists
     * 2. Hash password
     * 3. Create user
     * 4. Generate JWT token
     * 5. Return the token
     */
    // calling userService form userModule
    const user = this.userService.getUserByEmail(registerDto.email);
    return user;
  }
}
