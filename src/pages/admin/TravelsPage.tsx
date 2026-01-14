import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { travelsApi, Travel, TravelCreate } from '../../api/travels';
import { busesApi, Bus } from '../../api/buses';
import { routesApi, Route } from '../../api/routes';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { Plus, ArrowLeft, Calendar as CalendarIcon, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function TravelsPage() {
  const navigate = useNavigate();
  const [travels, setTravels] = useState<Travel[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<TravelCreate>({
    date_time: '',
    bus_id: 0,
    route_id: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [travelsData, busesData, routesData] = await Promise.all([
        travelsApi.list(),
        busesApi.list(),
        routesApi.list(),
      ]);
      setTravels(travelsData);
      setBuses(busesData);
      setRoutes(routesData);
    } catch (error: any) {
      toast.error('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await travelsApi.create(formData);
      toast.success('Viagem criada!');
      setIsFormOpen(false);
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error('Erro ao salvar.');
    }
  };

  const resetForm = () => {
    setFormData({
      date_time: '',
      bus_id: 0,
      route_id: 0,
    });
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('pt-BR');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ABERTA':
        return 'default';
      case 'ENCERRADA':
        return 'secondary';
      case 'CANCELADA':
        return 'destructive';
      default:
        return 'outline';
    }
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
              <h1 className="text-2xl font-bold text-slate-900">Gestão de Viagens</h1>
              <p className="text-slate-500 text-sm italic">Gerencie as viagens do sistema</p>
            </div>
          </div>

          <Button 
            onClick={() => { resetForm(); setIsFormOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nova Viagem
          </Button>
        </div>

        {/* Tabela */}
        <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-10 space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : travels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <CalendarIcon className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhuma viagem cadastrada</h3>
                <p className="text-slate-500 mb-6">Comece criando a primeira viagem do sistema</p>
                <Button 
                  onClick={() => { resetForm(); setIsFormOpen(true); }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Viagem
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="py-4 px-6 font-bold">Data/Hora</TableHead>
                      <TableHead className="py-4 px-6 font-bold">Ônibus</TableHead>
                      <TableHead className="py-4 px-6 font-bold">Rota</TableHead>
                      <TableHead className="py-4 px-6 font-bold text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {travels.map((travel) => (
                      <TableRow key={travel.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="text-blue-600 w-5 h-5" />
                            <span className="font-medium">{formatDateTime(travel.date_time)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {travel.bus ? (
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold text-slate-900">{travel.bus.plate}</span>
                              <span className="text-slate-500 text-sm">({travel.bus.capacity} lugares)</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {travel.route ? (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900">{travel.route.origin}</span>
                              <span className="text-slate-400">→</span>
                              <span className="font-medium text-slate-900">{travel.route.destination}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          <Badge variant={getStatusBadgeVariant(travel.status)} className="px-3 py-1">
                            {travel.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* MODAL DE FORMULÁRIO */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nova Viagem</DialogTitle>
              <DialogDescription>Preencha os dados da viagem.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="date_time">Data e Hora</Label>
                <Input
                  id="date_time"
                  type="datetime-local"
                  value={formData.date_time}
                  onChange={(e) => setFormData({ ...formData, date_time: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bus_id">Ônibus</Label>
                <Select
                  value={formData.bus_id.toString()}
                  onValueChange={(value) => setFormData({ ...formData, bus_id: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um ônibus" />
                  </SelectTrigger>
                  <SelectContent>
                    {buses.map((bus) => (
                      <SelectItem key={bus.id} value={bus.id.toString()}>
                        {bus.plate} - {bus.capacity} lugares
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="route_id">Rota</Label>
                <Select
                  value={formData.route_id.toString()}
                  onValueChange={(value) => setFormData({ ...formData, route_id: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma rota" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route.id} value={route.id.toString()}>
                        {route.origin} → {route.destination}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Salvar Dados</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
