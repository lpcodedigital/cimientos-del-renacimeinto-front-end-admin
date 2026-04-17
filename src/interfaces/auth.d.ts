export interface LoginResponse {
    token:     string;
    expiresAt: Date;
    user:      User;
    mfaRequired: boolean;
}

export interface User {
    idUser: number;
    name:   string;
    email:  string;
    active: boolean;
    role:   string;
    isFirstLogin: boolean;
}

export interface Verify2FAResponseDTO {
    email: string;
    code:  string;
}

export interface Resend2FADTO {
    email: string;
}
