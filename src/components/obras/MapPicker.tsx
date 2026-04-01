import React, { useEffect } from "react";

import { MapContainer, Marker, TileLayer, useMap, useMapEvent, useMapEvents } from "react-leaflet";

import L from "leaflet";

// Arreglo para que los icono de Leaflet se vean bien
import icon from "leaflet/dist/images/marker-icon.png"
import iconShadow from "leaflet/dist/images/marker-shadow.png"
import { Box, Typography } from "@mui/material";

import geoData from "../../assets/data/yucatan_municipios_2023.json";
import { point, booleanPointInPolygon } from "@turf/turf";

import { GeoJSON } from "react-leaflet";


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
    onMunicipioDetectado?: (name: string) => void;
    targetMunicipio?: string | null; 
}

// 🚀 NUEVO: Sub-componente para el buscador
const FlyToMunicipio = ({ targetMunicipio }: { targetMunicipio: string | null }) => {
    const map = useMap();
    useEffect(() => {
        if (targetMunicipio) {
            const feature = geoData.features.find(
                (f: any) => f.properties.NOMGEO === targetMunicipio
            );
            if (feature) {
                const geoJsonLayer = L.geoJson(feature as any);
                map.flyToBounds(geoJsonLayer.getBounds(), { padding: [20, 20], duration: 1.5 });
            }
        }
    }, [targetMunicipio, map]);
    return null;
};
// Sub-Componente para manejar los eventos del mapa
export const MapEvents = ({ onChange, position, onMunicipioDetectado, isSearching }: { onChange: any, position: [number, number], onMunicipioDetectado?: (name: string) => void, isSearching?: boolean }) =>{

    // useMap es el hook para centrar la vista
    const map = useMap();

    // useMapEvents es el hook para manejar los eventos o detectar los clicks
    useMapEvents({
        click(e) {
            onChange(e.latlng.lat, e.latlng.lng);

            // 🎯 Lógica de Geofencing con Turf
            // ✅ USO CORRECTO SIN EL PREFIJO "turf."
            const pt = point([e.latlng.lng, e.latlng.lat]); // Turf usa [longitud, latitud]
            
            const foundMunicipio = geoData.features.find((feature: any) => {
                // ✅ Llamada directa a la función
                return booleanPointInPolygon(pt, feature);
            });

            if (foundMunicipio && onMunicipioDetectado) {
                const nombre = foundMunicipio.properties.NOMGEO;
                onMunicipioDetectado(nombre);
            }
        }
    });

    // useEffect es el hook para manejar los cambios
    // Efecto para centrar el mapa si las coordenadas cambian externamente
    useEffect( () => {

        // Solo centramos en el marcador si NO estamos buscando un municipio
        if (position && !isSearching) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map, isSearching]);

    return null;

}

// Componente para resaltar el municipio seleccionado (como en tu público)
const MunicipioResaltado = ({ targetMunicipio }: { targetMunicipio: string | null }) => {
    if (!targetMunicipio) return null;

    const feature = geoData.features.find(
        (f: any) => f.properties.NOMGEO === targetMunicipio
    );

    if (!feature) return null;

    return (
        <GeoJSON 
            key={targetMunicipio}
            data={feature as any} 
            style={{
                fillColor: "#e1f508", // Tu color guinda institucional
                fillOpacity: 0.3,
                color: "#901b45",
                weight: 2
            }}
        />
    );
};
export const MapPicker: React.FC<MapPickerProos> = ({ lat, lng, onChange, onMunicipioDetectado, targetMunicipio }: MapPickerProos) => {
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

                {/* Componente buscador dentro del contenedor */}
                <FlyToMunicipio targetMunicipio={targetMunicipio ?? null} />

                {/* Capa de resaltado (La idea de tu público) */}
                <MunicipioResaltado targetMunicipio={targetMunicipio ?? null} />

                { hasCoords && ( <Marker position={currentPosition}/>) }

                 <MapEvents 
                    onChange={onChange} 
                    position={currentPosition} 
                    onMunicipioDetectado={onMunicipioDetectado}
                    isSearching={!!targetMunicipio} // Si hay algo en el buscador, isSearching es true
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