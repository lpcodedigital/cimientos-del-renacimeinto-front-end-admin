import { TagField } from "@refinedev/mui";
import { OBRA_STATUS_CONFIG } from "../../constants/status-config";

interface StatusTagProps {
    status: string;
}

export const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
    const config = OBRA_STATUS_CONFIG[status] || { label: status, color: "default" };

    return (
        <TagField
            value={config.label}
            color={config.chipColor}
            sx={{ fontWeight: "bold", textTransform: "uppercase" }}
        />
    );
};