export interface DashboardStats {
    totalObras:          number;
    totalInvestment:     number;
    averageProgress:     number;
    countByStatus:       Record<string, number>;
    countByMunicipality: Record<string, number>;
}
