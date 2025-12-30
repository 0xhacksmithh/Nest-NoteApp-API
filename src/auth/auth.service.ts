import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  register(registerDto: RegisterDto) {
    /**
     * 1. Check user already exists
     * 2. Hash password
     * 3. Create user
     * 4. Generate JWT token
     * 5. Return the token
     */
    return { message: 'registered' };
  }
}
