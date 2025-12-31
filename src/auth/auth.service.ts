import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

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

    this.logger.log(`New User has Been Created: ${newUser.id}`);

    // JWT token creation
    const payload = { sub: newUser.name, email: newUser.email };
    // console.log(jwtConstants.secret);

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login(loginDto: LoginDto) {
    /**
     * 1. Get the user from DB
     * 2. Match the password with hashed password
     * 3. Create JWT token
     * 4. Return JWT token
     */
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Email or password Incorrect');
    }

    const res = await bcrypt.compare(loginDto.password, user.password);
    if (!res) {
      throw new UnauthorizedException('Email or password Incorrect');
    }
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
