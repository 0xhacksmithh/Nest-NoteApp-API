import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerDto: RegisterDto) {
    /**
     * 1. Check user already exists
     * 2. Hash password
     * 3. Create user
     * 4. Generate JWT token
     * 5. Return the token
     */
    // calling userService form userModule
    const user = await this.userService.getUserByEmail(registerDto.email);
    if (user) {
      throw new ConflictException('Email already taken..');
    }
    // Hashing Password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);
    // Create User in UserServie
    const newUser = await this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
    });

    // JWT token creation
    const payload = { sub: newUser.name, email: newUser.email };
    // console.log(jwtConstants.secret);

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
