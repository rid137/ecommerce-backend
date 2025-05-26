export interface CreateUserDto {
    _id: string;
    username: string;
    email: string;
    password: string;
    isAdmin?: boolean; // Optional since it has a default value
}