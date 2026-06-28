import { User } from '../../database/schema';

export class AuthMapper {
  /**
   * Map User entity to safe DTO (exclude sensitive fields)
   */
  static toUserDto(user: User) {
    const { password, refreshToken, deletedAt, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Map User with tokens to AuthResponse
   */
  static toAuthResponse(user: User, accessToken: string, refreshToken: string) {
    return {
      user: this.toUserDto(user),
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Map multiple users to DTOs
   */
  static toUserDtoList(users: User[]) {
    return users.map((user) => this.toUserDto(user));
  }
}
