import React from "react";
import { Image } from "../../interfaces/obra";
import { Box, ImageList, ImageListItem, Typography } from "@mui/material";

export const ObraImageGallery: React.FC<{ images: Image[] }> = ({ images }) => {
    // Manej de datos vacíos
    if(!images || images.length === 0) {
        return (
            <Box sx={{ p: 2, bgcolor: "grey.100", borderRadius:2}}>
                <Typography variant="body2" color="text.secondary">
                    No hay imágenes disponibles para esta obra.
                </Typography>
            </Box>
        );
    }

    // Renderizar galería de imágenes
    return (
        <ImageList sx={{ width: "100%", height: 450, }} cols={2} rowHeight={200}>
            { images.map((item) => (
                <ImageListItem key={item.id}>
                    <img
                        src={item.url}
                        alt="Evidencia de obra"
                        loading="lazy"
                        style={{ borderRadius: "8px", objectFit: "cover", height: "100%"}}
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
};