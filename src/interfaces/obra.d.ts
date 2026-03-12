// Exportar interface ObraResponseListDTO
export interface ObraResponseListDTO {
    content:          Content[];
    pageable:         Pageable;
    totalElements:    number;
    totalPages:       number;
    last:             boolean;
    size:             number;
    number:           number;
    sort:             Sort;
    numberOfElements: number;
    first:            boolean;
    empty:            boolean;
}

export interface Content {
    id:           number;
    name:         string;
    municipality: string;
    description:  string;
    status:       string;
    progress:     number;
    createdAt:    Date;
}

export interface Pageable {
    pageNumber: number;
    pageSize:   number;
    sort:       Sort;
    offset:     number;
    paged:      boolean;
    unpaged:    boolean;
}

export interface Sort {
    sorted:   boolean;
    unsorted: boolean;
    empty:    boolean;
}

// export interface ObraResponseDTO 

export interface ObraResponseDTO {
    id:           number;
    name:         string;
    municipality: string;
    agency:       string;
    investment:   number;
    progress:     number;
    description:  string;
    latitude:     number;
    longitude:    number;
    status:       string;
    images:       Image[];
    createdAt:    Date;
    createdBy:    string;
}

export interface Image {
    id:       number;
    url:      string;
    thumbUrl: string;
    mimeType: string;
    size:     string;
    position: number;
}


// export interface ObraRequestDTO 

export interface ObraRequestDTO {
    name:         string;
    municipality: string;
    agency:       string;
    investment:   number;
    progress:     number;
    description?:  string;
    latitude:     number;
    longitude:    number;
    status:       string;
    keepImageIds?: number[];
    files?:       any[];
}