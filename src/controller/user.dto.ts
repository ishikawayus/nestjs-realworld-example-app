class LoginReqUser {
  email: string;
  password: string;
}

export class LoginDto {
  user: LoginReqUser;
}

class CreateUserReqUser {
  username: string;
  email: string;
  password: string;
}

export class CreateUserDto {
  user: CreateUserReqUser;
}

class UpdateUserReqUser {
  email?: string;
  username?: string;
  password?: string;
  image?: string;
  bio?: string;
}

export class UpdateUserDto {
  user: UpdateUserReqUser;
}
