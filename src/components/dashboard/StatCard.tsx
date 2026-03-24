import { Card, Stack, Box, Typography } from "@mui/material"

interface StatCardProps {
    title: string,
    value: string,
    icon: React.ReactNode,
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon } : StatCardProps) => {

    return (
        <Card sx={{ p: 3, borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
                <Typography variant="overline" display="block" color="text.secondary">
                    {title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    {value}
                </Typography>
            </Box>
            {icon}
        </Stack>
    </Card>
    )
}