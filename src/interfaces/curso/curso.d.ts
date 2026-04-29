export interface CursoImage {
    id: number;
    url: string;
    thumbUrl: string;
    mimeType: string;
    size: string;
    position: number;
}

export interface CursoResponseDTO {
    id: number;
    title: string;
    description: string;
    courseDate: string;
    municipalityName: string;
    municipalityId: number;
    coverImage: CursoImage | null;
    images: CursoImage[];
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
}

// Este es el que usa Refine para la tabla
export interface CursoResponseListDTO {
    data: CursoResponseDTO[];
    total: number;
}

export interface CursoRequestDTO {
    title: string;
    description: string;
    municipalityId: number;
    courseDate: string;
    keepImageIds?: number[];
    currentCoverImageId?: number | null;
    files?: any[]; // Para el manejo de Multipart
}