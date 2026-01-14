import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { travelsApi, Travel } from '../../api/travels';
import { attendancesApi, Attendance } from '../../api/attendances';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { CheckCircle2, Clock, AlertCircle, ArrowLeft, Calendar as CalendarIcon, MapPin, Bus as BusIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function TravelsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [travels, setTravels] = useState<Travel[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [travelsData, allAttendances] = await Promise.all([
        travelsApi.list(),
        // Buscar todas as presenças do estudante
        Promise.all(
          (await travelsApi.list()).map(async (travel) => {
            try {
              const atts = await attendancesApi.getTravelAttendances(travel.id);
              return atts.find(a => a.student_id === user?.id);
            } catch {
              return null;
            }
          })
        ),
      ]);
      
      // Filtrar apenas viagens do dia (hoje)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayTravels = travelsData.filter(t => {
        const travelDate = new Date(t.date_time);
        return travelDate >= today && travelDate < tomorrow && t.status === 'ABERTA';
      });
      
      setTravels(todayTravels);
      setAttendances(allAttendances.filter(a => a !== null) as Attendance[]);
    } catch (error: any) {
      toast.error('Erro ao carregar viagens: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTravel = async (travelId: number) => {
    try {
      await attendancesApi.joinTravel(travelId);
      toast.success('Você foi adicionado à viagem!');
      loadData();
    } catch (error: any) {
      toast.error('Erro ao entrar na viagem: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleConfirmPresence = async (travelId: number) => {
    if (!user) return;
    try {
      await attendancesApi.confirmPresence(travelId, user.id);
      toast.success('Presença confirmada!');
      loadData();
    } catch (error: any) {
      toast.error('Erro ao confirmar presença: ' + (error.response?.data?.detail || error.message));
    }
  };

  const getAttendanceForTravel = (travelId: number): Attendance | undefined => {
    return attendances.find(a => a?.travel_id === travelId);
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('pt-BR');
  };

  const isTravelClosed = (travel: Travel) => {
    return travel.status === 'ENCERRADA' || travel.status === 'CANCELADA';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Viagens do Dia</h1>
              <p className="text-slate-500 text-sm italic">Visualize e participe das viagens disponíveis hoje</p>
            </div>
          </div>
        </div>

        {/* Lista de Viagens */}
        <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-10 space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : travels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <CalendarIcon className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhuma viagem disponível</h3>
                <p className="text-slate-500">Não há viagens abertas para hoje</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {travels.map((travel) => {
                  const attendance = getAttendanceForTravel(travel.id);
                  const closed = isTravelClosed(travel);

                  return (
                    <div key={travel.id} className="p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <MapPin className="text-blue-600 w-5 h-5" />
                            <h3 className="text-lg font-semibold text-slate-900">
                              {travel.route ? `${travel.route.origin} → ${travel.route.destination}` : 'N/A'}
                            </h3>
                            {attendance?.is_waitlist && (
                              <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700">
                                Lista de Espera
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="text-blue-600 w-4 h-4" />
                              <span>{formatDateTime(travel.date_time)}</span>
                            </div>
                            {travel.bus && (
                              <div className="flex items-center gap-2">
                                <BusIcon className="text-blue-600 w-4 h-4" />
                                <span className="font-mono font-semibold">{travel.bus.plate}</span>
                                <span className="text-slate-500">({travel.bus.capacity} lugares)</span>
                              </div>
                            )}
                          </div>
                          {attendance && (
                            <div className="flex items-center gap-2">
                              {attendance.status === 'CONFIRMADO' ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : attendance.status === 'PENDENTE' ? (
                                <Clock className="w-5 h-5 text-yellow-600" />
                              ) : null}
                              <span className="text-sm font-medium text-slate-700">
                                Status: <span className="font-semibold">{attendance.status}</span>
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 md:min-w-[180px]">
                          {!attendance && !closed && (
                            <Button 
                              onClick={() => handleJoinTravel(travel.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full md:w-auto"
                            >
                              Entrar na Viagem
                            </Button>
                          )}
                          {attendance && attendance.status === 'PENDENTE' && !closed && (
                            <Button 
                              onClick={() => handleConfirmPresence(travel.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full md:w-auto"
                            >
                              Confirmar Presença
                            </Button>
                          )}
                          {closed && (
                            <div className="flex items-center gap-2 text-slate-500 bg-slate-100 px-4 py-2 rounded-lg">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Viagem encerrada</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
