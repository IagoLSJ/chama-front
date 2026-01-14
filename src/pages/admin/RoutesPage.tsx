import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { routesApi, Route, RouteCreate } from '../../api/routes';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { Plus, Edit, Trash2, ArrowLeft, MapPin as MapPinIcon, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function RoutesPage() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [routeToDelete, setRouteToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<RouteCreate>({
    origin: '',
    destination: '',
  });

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const data = await routesApi.list();
      setRoutes(data);
    } catch (error: any) {
      toast.error('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoute) {
        await routesApi.update(editingRoute.id, formData);
        toast.success('Rota atualizada!');
      } else {
        await routesApi.create(formData);
        toast.success('Rota cadastrada!');
      }
      setIsFormOpen(false);
      resetForm();
      loadRoutes();
    } catch (error: any) {
      toast.error('Erro ao salvar.');
    }
  };

  const confirmDelete = async () => {
    if (!routeToDelete) return;
    try {
      await routesApi.delete(routeToDelete);
      toast.success('Excluído com sucesso!');
      setIsDeleteOpen(false);
      loadRoutes();
    } catch (error: any) {
      toast.error('Erro ao excluir.');
    }
  };

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setFormData({ origin: route.origin, destination: route.destination });
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setEditingRoute(null);
    setFormData({ origin: '', destination: '' });
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
              <h1 className="text-2xl font-bold text-slate-900">Gestão de Rotas</h1>
              <p className="text-slate-500 text-sm italic">Gerencie as rotas disponíveis no sistema</p>
            </div>
          </div>

          <Button 
            onClick={() => { resetForm(); setIsFormOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nova Rota
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
            ) : routes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <MapPinIcon className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhuma rota cadastrada</h3>
                <p className="text-slate-500 mb-6">Comece adicionando a primeira rota ao sistema</p>
                <Button 
                  onClick={() => { resetForm(); setIsFormOpen(true); }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeira Rota
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="py-4 px-6 font-bold">Rota</TableHead>
                    <TableHead className="py-4 px-6 font-bold text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routes.map((route) => (
                    <TableRow key={route.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <MapPinIcon className="text-blue-600 w-5 h-5" />
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">{route.origin}</span>
                            <span className="text-slate-400">→</span>
                            <span className="font-semibold text-slate-900">{route.destination}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEdit(route)}
                            className="h-11 w-11 rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="w-5 h-5" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            onClick={() => { setRouteToDelete(route.id); setIsDeleteOpen(true); }}
                            className="h-11 w-11 rounded-lg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* MODAL DE FORMULÁRIO */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingRoute ? 'Editar Rota' : 'Nova Rota'}</DialogTitle>
              <DialogDescription>Preencha os dados da rota.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="origin">Origem</Label>
                <Input 
                  id="origin" 
                  value={formData.origin} 
                  onChange={(e) => setFormData({...formData, origin: e.target.value})} 
                  placeholder="Cidade de origem"
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="destination">Destino</Label>
                <Input 
                  id="destination" 
                  value={formData.destination} 
                  onChange={(e) => setFormData({...formData, destination: e.target.value})} 
                  placeholder="Cidade de destino"
                  required 
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Salvar Dados</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* MODAL DE EXCLUSÃO */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-[400px] text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full text-red-600">
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>
            <DialogTitle className="text-xl">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="py-4">
              Tem certeza que deseja remover esta rota? Esta ação não pode ser desfeita.
            </DialogDescription>
            <DialogFooter className="flex gap-3">
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="flex-1">Não, cancelar</Button>
              <Button variant="destructive" onClick={confirmDelete} className="flex-1">Sim, confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
