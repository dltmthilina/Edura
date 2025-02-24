interface UserProp {
  firstName: string;
  lastName?: string;
  email: string;
  password?: string;
  roles: string[];
}

export class User implements UserProp {
  firstName!: string;
  lastName?: string | undefined;
  email!: string;
  password?: string | undefined;
  roles!: string[];

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    roles: string[]
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.roles = roles;
  }
}
