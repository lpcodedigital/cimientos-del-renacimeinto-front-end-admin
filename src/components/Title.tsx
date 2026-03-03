import Typography from "@mui/material/Typography";

export const Title = ({ collapsed }: {collapsed: boolean}) => {
    return (
        <Typography variant="h6" sx={{ fontWeight: 700, padding: "0 16px"}}>
          { collapsed ? "SIB" : "SIB ADMIN" }
        </Typography>
    );
};