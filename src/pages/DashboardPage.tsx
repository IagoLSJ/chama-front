import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, MapPin, Calendar, UserCheck, LogOut, Bus as BusIcon, TrendingUp, Clock, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { usersApi } from '../api/users';
import { busesApi } from '../api/buses';
import { routesApi } from '../api/routes';
import { travelsApi, Travel } from '../api/travels';
import { attendancesApi, Attendance } from '../api/attendances';

interface DashboardStats {
  totalUsers: number;
  totalBuses: number;
  totalRoutes: number;
  totalTravels: number;
  openTravels: number;
  closedTravels: number;
  upcomingTravels: Travel[];
  recentTravels: Travel[];
  pendingAttendances?: number;
  confirmedAttendances?: number;
  studentTravels?: number;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout, user, isAdmin, isResponsible, isStudent } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [users, buses, routes, travels] = await Promise.all([
        isAdmin || isResponsible ? usersApi.list().catch(() => []) : Promise.resolve([]),
        isAdmin ? busesApi.list().catch(() => []) : Promise.resolve([]),
        isAdmin ? routesApi.list().catch(() => []) : Promise.resolve([]),
        travelsApi.list().catch(() => []),
      ]);

      const now = new Date();
      const openTravels = travels.filter((t: Travel) => t.status === 'ABERTA');
      const closedTravels = travels.filter((t: Travel) => t.status === 'ENCERRADA');
      
      // Próximas viagens (ordenadas por data)
      const upcomingTravels = travels
        .filter((t: Travel) => new Date(t.date_time) >= now && t.status === 'ABERTA')
        .sort((a: Travel, b: Travel) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())
        .slice(0, 5);

      // Viagens recentes
      const recentTravels = travels
        .filter((t: Travel) => new Date(t.date_time) < now || t.status === 'ENCERRADA')
        .sort((a: Travel, b: Travel) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())
        .slice(0, 5);

      let pendingAttendances = 0;
      let confirmedAttendances = 0;
      let studentTravels = 0;

      if (isResponsible) {
        // Para responsáveis, contar presenças pendentes nas viagens abertas
        for (const travel of openTravels) {
          try {
            const attendances = await attendancesApi.getTravelAttendances(travel.id);
            pendingAttendances += attendances.filter((a: Attendance) => a.status === 'PENDENTE').length;
            confirmedAttendances += attendances.filter((a: Attendance) => a.status === 'CONFIRMADO').length;
          } catch (error) {
            // Ignorar erros ao buscar presenças
          }
        }
      }

      if (isStudent && user) {
        // Para estudantes, contar viagens em que estão inscritos
        for (const travel of travels) {
          try {
            const attendances = await attendancesApi.getTravelAttendances(travel.id);
            const studentAttendance = attendances.find((a: Attendance) => a.student_id === user.id);
            if (studentAttendance) {
              studentTravels++;
            }
          } catch (error) {
            // Ignorar erros
          }
        }
      }

      setStats({
        totalUsers: users.length,
        totalBuses: buses.length,
        totalRoutes: routes.length,
        totalTravels: travels.length,
        openTravels: openTravels.length,
        closedTravels: closedTravels.length,
        upcomingTravels,
        recentTravels,
        pendingAttendances,
        confirmedAttendances,
        studentTravels,
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const adminCards = [
    { title: 'Usuários', description: 'Gerenciar usuários do sistema', icon: Users, path: '/admin/usuarios', color: 'bg-blue-500' },
    { title: 'Ônibus', description: 'Gerenciar frota de ônibus', icon: BusIcon, path: '/admin/onibus', color: 'bg-green-500' },
    { title: 'Rotas', description: 'Gerenciar rotas de viagem', icon: MapPin, path: '/admin/rotas', color: 'bg-purple-500' },
    { title: 'Viagens', description: 'Criar e gerenciar viagens', icon: Calendar, path: '/admin/viagens', color: 'bg-orange-500' },
  ];

  const responsibleCards = [
    { title: 'Chamada', description: 'Realizar chamada de viagens', icon: UserCheck, path: '/responsavel/chamada', color: 'bg-indigo-500' },
  ];

  const studentCards = [
    { title: 'Minhas Viagens', description: 'Ver e confirmar presença nas viagens', icon: Calendar, path: '/estudante/viagens', color: 'bg-blue-500' },
  ];

  const getCards = () => {
    if (isAdmin) return [...adminCards, ...responsibleCards];
    if (isResponsible) return responsibleCards;
    if (isStudent) return studentCards;
    return [];
  };

  const getRoleName = () => {
    if (isAdmin) return 'Administrador';
    if (isResponsible) return 'Responsável';
    if (isStudent) return 'Estudante';
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Bem-vindo, {user?.name} ({getRoleName()})
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Carregando dados...</div>
          </div>
        ) : stats ? (
          <>
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {isAdmin && (
                <>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalUsers}</div>
                      <p className="text-xs text-muted-foreground">Usuários cadastrados</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total de Ônibus</CardTitle>
                      <BusIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalBuses}</div>
                      <p className="text-xs text-muted-foreground">Veículos na frota</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total de Rotas</CardTitle>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalRoutes}</div>
                      <p className="text-xs text-muted-foreground">Rotas cadastradas</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total de Viagens</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalTravels}</div>
                      <p className="text-xs text-muted-foreground">
                        {stats.openTravels} abertas, {stats.closedTravels} encerradas
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}

              {isResponsible && (
                <>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Viagens Abertas</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.openTravels}</div>
                      <p className="text-xs text-muted-foreground">Aguardando chamada</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Presenças Pendentes</CardTitle>
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.pendingAttendances || 0}</div>
                      <p className="text-xs text-muted-foreground">Aguardando confirmação</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Presenças Confirmadas</CardTitle>
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.confirmedAttendances || 0}</div>
                      <p className="text-xs text-muted-foreground">Confirmadas hoje</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total de Viagens</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalTravels}</div>
                      <p className="text-xs text-muted-foreground">Viagens cadastradas</p>
                    </CardContent>
                  </Card>
                </>
              )}

              {isStudent && (
                <>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Minhas Viagens</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.studentTravels || 0}</div>
                      <p className="text-xs text-muted-foreground">Viagens inscritas</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Próximas Viagens</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.upcomingTravels.length}</div>
                      <p className="text-xs text-muted-foreground">Viagens agendadas</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Viagens Abertas</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.openTravels}</div>
                      <p className="text-xs text-muted-foreground">Disponíveis para inscrição</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total de Viagens</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalTravels}</div>
                      <p className="text-xs text-muted-foreground">No sistema</p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Próximas Viagens */}
            {stats.upcomingTravels.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Próximas Viagens</CardTitle>
                  <CardDescription>Viagens agendadas que estão abertas para inscrição</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.upcomingTravels.map((travel) => (
                      <div
                        key={travel.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">
                              {travel.route?.origin} → {travel.route?.destination}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDateTime(travel.date_time)}
                            </span>
                            {travel.bus && (
                              <span className="flex items-center gap-1">
                                <BusIcon className="h-3 w-3" />
                                {travel.bus.plate} ({travel.bus.capacity} lugares)
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded text-xs ${
                              travel.status === 'ABERTA' ? 'bg-green-100 text-green-800' :
                              travel.status === 'ENCERRADA' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {travel.status}
                            </span>
                          </div>
                        </div>
                        {isAdmin && (
                          <Link to="/admin/viagens">
                            <Button variant="outline" size="sm">
                              Ver detalhes
                            </Button>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cards de Navegação */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCards().map((card) => {
                  const Icon = card.icon;
                  return (
                    <Link key={card.path} to={card.path}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <CardHeader>
                          <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <CardTitle>{card.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{card.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-gray-600">Não foi possível carregar os dados do dashboard.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}