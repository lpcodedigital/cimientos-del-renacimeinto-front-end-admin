import { Box, IconButton, ImageList, ImageListItem } from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

interface FilePreviewGridProps {
    files: File[];
    onDelete: (index: number) => void;
}


export const ImagePreviewGrid: React.FC<FilePreviewGridProps> = ({ files, onDelete }: FilePreviewGridProps) => {

    if (!files || files.length === 0) return null;

    return (
        <Box
            sx={{
                mt: 2,
                p: 2,
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 2,
            }}
        >
            <ImageList
                cols={4}
                gap={12}
                rowHeight={120}
            >

                {files.map((file: any, index) => {

                    const imgURL = URL.createObjectURL(file.originFileObj || file);

                    return (
                        <ImageListItem
                            key={index}
                            sx={{
                                position: "relative",
                                overflow: "hidden",
                                borderRadius: 2
                            }}
                        >
                            <img
                                src={imgURL}
                                alt={`Preview ${index}`}
                                loading="lazy"
                                style={{
                                    height: "100",
                                    objectFit: "cover"
                                }}
                            />

                            {/* Boton para eliminar la imagen  antes de subirla */}

                            <IconButton
                                size="small"
                                onClick={ () => onDelete(index)}
                                sx={{
                                    position: "absolute",
                                    top: 5, 
                                    right: 5,
                                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                                    '&:hover': { bgcolor: 'error.main', color: 'white' }
                                }}
                            >
                                <DeleteIcon fontSize="small"/>
                            </IconButton>

                        </ImageListItem>
                    )

                })}

            </ImageList>
        </Box>
    );
};