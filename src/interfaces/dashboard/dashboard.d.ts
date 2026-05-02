export interface DashboardStats {
    totalObras:          number;
    totalInvestment:     number;
    averageProgress:     number;
    countByStatus:       Record<string, number>;
    countByMunicipality: Record<string, number>;
    totalUsers: number;
    activeUsers: number;
    totalCursos: number;
    municipalitiesWithObras: number;
    countByAgency: Record<string, number>;
    totalAgency: number;
}
