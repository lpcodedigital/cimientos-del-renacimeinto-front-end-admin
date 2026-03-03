export interface LoginResponse {
    token:     string;
    expiresAt: Date;
    user:      User;
}

export interface User {
    idUser: number;
    name:   string;
    email:  string;
    active: boolean;
    role:   string;
}
