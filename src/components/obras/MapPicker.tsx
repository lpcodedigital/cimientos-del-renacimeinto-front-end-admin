import React, { useEffect } from "react";

import { MapContainer, Marker, TileLayer, useMap, useMapEvent, useMapEvents } from "react-leaflet";

import L from "leaflet";

// Arreglo para que los icono de Leaflet se vean bien
import icon from "leaflet/dist/images/marker-icon.png"
import iconShadow from "leaflet/dist/images/marker-shadow.png"
import { Box, Typography } from "@mui/material";


let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Interfaz de los props de MapPicker
interface MapPickerProos {
    lat?: number;
    lng?: number;
    onChange?: (lat: number, lng:number) => void;
}

// Sub-Componente para manejar los eventos del mapa
export const MapEvents = ({ onChange, position }: { onChange: any, position: [number, number]}) =>{

    // useMap es el hook para centrar la vista
    const map = useMap();

    // useMapEvents es el hook para manejar los eventos o detectar los clicks
    useMapEvents({
        click(e) {
            onChange(e.latlng.lat, e.latlng.lng);
        }
    });

    // useEffect es el hook para manejar los cambios
    // Efecto para centrar el mapa si las coordenadas cambian externamente
    useEffect( () => {

        // Validamos que no sea la posicion por defecto si queremos que salte a la obra
        if (position){
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return null;

}

export const MapPicker: React.FC<MapPickerProos> = ({ lat, lng, onChange }: MapPickerProos) => {
    // Coordenadas iniciales de Merida (Plaza Grande) si no hay valores externos

    const defaultPosition: [number, number] = [20.9676, -89.6237];

    // Usamos Number() para asegurar que si llega un null de la BD se maneje bien.
    const hasCoords = typeof lat === "number" && typeof lng === "number";

    //const currentPosition: [number, number] = ( lat !== undefined && lng !== undefined && lat !== null && lng !== null) 
    const currentPosition: [number, number] = hasCoords
    ? [lat, lng] 
    : defaultPosition;

    return (
        <Box
            sx={{
                height: "400px",
                width: "100%",
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #ccc"
            }}
        >
            <MapContainer
                center={currentPosition}
                zoom={13}
                style={{
                    height: "100%",
                    width: "100%",
                }}
            >
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Si hay coordenadas externas, se muestran en el mapa */}
                {/* 
                    {lat && lng && ( <Marker position={currentPosition}/>)}
                */}
                { hasCoords && ( <Marker position={currentPosition}/>) }

                {/*
                    <MapEvents onChange={onChange} position={currentPosition} />
                */}
                {/* Solo activamos los eventos si existe la funcion onChange */}
                {/*
                    { onChange && <MapEvents onChange={onChange} position={currentPosition} /> }
                 */}
                 <MapEvents 
                    onChange={onChange} 
                    position={currentPosition} 
                />

            </MapContainer>

            <Typography
                variant="caption"
                sx={{
                    p: 1,
                    display: "block",
                    bgcolor: "#f5f5f5",
                }}
            >
                Haz clic en el mapa para seleccionar la ubicación
            </Typography>
        </Box>
    );
}