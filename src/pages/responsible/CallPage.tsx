import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { travelsApi, Travel } from '../../api/travels';
import { attendancesApi, Attendance } from '../../api/attendances';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { CheckCircle2, XCircle, Clock, ArrowLeft, Calendar as CalendarIcon, Users, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function CallPage() {
  const navigate = useNavigate();
  const [travels, setTravels] = useState<Travel[]>([]);
  const [selectedTravel, setSelectedTravel] = useState<Travel | null>(null);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTravels();
  }, []);

  useEffect(() => {
    if (selectedTravel) {
      loadAttendances(selectedTravel.id);
    }
  }, [selectedTravel]);

  const loadTravels = async () => {
    try {
      setLoading(true);
      const data = await travelsApi.list();
      // Filtrar apenas viagens abertas
      const openTravels = data.filter(t => t.status === 'ABERTA');
      setTravels(openTravels);
      if (openTravels.length > 0 && !selectedTravel) {
        setSelectedTravel(openTravels[0]);
      }
    } catch (error: any) {
      toast.error('Erro ao carregar viagens: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const loadAttendances = async (travelId: number) => {
    try {
      // O backend agora retorna os relacionamentos com JOIN, então não precisamos buscar users separadamente
      const attendancesData = await attendancesApi.getTravelAttendances(travelId);
      setAttendances(attendancesData);
    } catch (error: any) {
      toast.error('Erro ao carregar chamada: ' + (error.response?.data?.detail || error.message));
    }
  };

  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);

  const handleCloseTravel = async () => {
    if (!selectedTravel) return;
    
    try {
      await attendancesApi.closeAttendance(selectedTravel.id);
      toast.success('Viagem encerrada com sucesso!');
      setIsCloseDialogOpen(false);
      loadTravels();
      setSelectedTravel(null);
    } catch (error: any) {
      toast.error('Erro ao encerrar viagem: ' + (error.response?.data?.detail || error.message));
    }
  };

  const getStudentName = (attendance: Attendance) => {
    // Usa o objeto student retornado pelo backend (com JOIN)
    return attendance.student?.name || 'N/A';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMADO':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'PENDENTE':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'CANCELADO':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('pt-BR');
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
              <h1 className="text-2xl font-bold text-slate-900">Chamada de Viagens</h1>
              <p className="text-slate-500 text-sm italic">Gerencie a chamada dos estudantes nas viagens</p>
            </div>
          </div>

          {selectedTravel && selectedTravel.status === 'ABERTA' && (
            <Button 
              onClick={() => setIsCloseDialogOpen(true)}
              variant="destructive"
              className="px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              Encerrar Viagem
            </Button>
          )}
        </div>

        {/* Lista de Viagens Abertas */}
        <Card className="border-none shadow-xl rounded-2xl overflow-hidden mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Viagens Abertas</h3>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : travels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <CalendarIcon className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhuma viagem aberta</h3>
                <p className="text-slate-500">Não há viagens abertas no momento</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {travels.map((travel) => (
                  <Card
                    key={travel.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTravel?.id === travel.id 
                        ? 'border-2 border-blue-600 bg-blue-50' 
                        : 'border border-slate-200'
                    }`}
                    onClick={() => setSelectedTravel(travel)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CalendarIcon className="text-blue-600 w-5 h-5" />
                            <p className="font-semibold text-slate-900">
                              {travel.route ? `${travel.route.origin} → ${travel.route.destination}` : 'N/A'}
                            </p>
                          </div>
                          <p className="text-sm text-slate-600 mb-1">
                            {formatDateTime(travel.date_time)}
                          </p>
                          <p className="text-sm text-slate-500">
                            Ônibus: {travel.bus ? travel.bus.plate : 'N/A'}
                          </p>
                        </div>
                        <Badge variant={travel.status === 'ABERTA' ? 'default' : 'secondary'} className="ml-4">
                          {travel.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lista de Estudantes da Viagem Selecionada */}
        {selectedTravel && (
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 border-b border-slate-200 bg-slate-50">
                <h3 className="text-lg font-semibold text-slate-900">
                  Lista de Chamada - {selectedTravel.route ? `${selectedTravel.route.origin} → ${selectedTravel.route.destination}` : 'N/A'}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {formatDateTime(selectedTravel.date_time)}
                </p>
              </div>
              {attendances.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <Users className="w-16 h-16 text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhum estudante registrado</h3>
                  <p className="text-slate-500">Nenhum estudante foi registrado nesta viagem ainda</p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="py-4 px-6 font-bold">Nome</TableHead>
                      <TableHead className="py-4 px-6 font-bold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendances.map((attendance) => (
                      <TableRow key={attendance.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Users className="text-blue-600 w-4 h-4" />
                            <span className="font-medium text-slate-900">{getStudentName(attendance)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(attendance.status)}
                            <span className="text-slate-700">{attendance.status}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Modal de Confirmação de Encerramento */}
        {selectedTravel && (
          <Dialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
            <DialogContent className="sm:max-w-[400px] text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 rounded-full text-red-600">
                  <AlertTriangle className="w-8 h-8" />
                </div>
              </div>
              <DialogTitle className="text-xl">Encerrar Viagem</DialogTitle>
              <DialogDescription className="py-4">
                Tem certeza que deseja encerrar esta viagem? Esta ação não pode ser desfeita.
              </DialogDescription>
              <DialogFooter className="flex gap-3">
                <Button variant="outline" onClick={() => setIsCloseDialogOpen(false)} className="flex-1">
                  Não, cancelar
                </Button>
                <Button variant="destructive" onClick={handleCloseTravel} className="flex-1">
                  Sim, encerrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

      </div>
    </div>
  );
}
