export interface RoleDTO {
    idRole: number;
    name: string;

}

export interface UserDTO {
    idUser: number;
    name: string;
    middleName?: string;
    firstLastName: string;
    secondLastName: string;
    phone: string;
    email: string;
    active: boolean;
    isFirstLogin: boolean;
    twoFactorEnabled: boolean;
    role: RoleDTO;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserRequestDTO {
    name: string;
    middleName?: string;
    firstLastName: string;
    secondLastName: string;
    phone: string;
    email: string;
    password: string;
    active: boolean;
    roleId: number;
}