import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi, User, UserCreate, UserUpdate } from '../../api/users';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { Plus, Edit, Trash2, Users, Mail, Phone, UserCircle, ArrowLeft, Search, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState<UserCreate>({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'STUDENT',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.list();
      setUsers(data);
    } catch (error: any) {
      toast.error('Erro ao carregar usuários: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações do frontend
    if (!editingUser) {
      if (!formData.password || formData.password.length < 6) {
        toast.error('A senha deve ter no mínimo 6 caracteres');
        return;
      }
      if (!formData.phone || !formData.phone.trim()) {
        toast.error('O telefone é obrigatório');
        return;
      }
    }

    try {
      if (editingUser) {
        const updateData: UserUpdate = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          role: formData.role,
        };
        // Incluir senha apenas se foi fornecida
        if (formData.password && formData.password.trim()) {
          if (formData.password.length < 6) {
            toast.error('A senha deve ter no mínimo 6 caracteres');
            return;
          }
          updateData.password = formData.password;
        }
        await usersApi.update(editingUser.id, updateData);
        toast.success('Usuário atualizado com sucesso!');
      } else {
        const createData: UserCreate = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phone: formData.phone.trim(),
          role: formData.role,
        };
        await usersApi.create(createData);
        toast.success('Usuário criado com sucesso!');
      }
      setIsDialogOpen(false);
      resetForm();
      loadUsers();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Erro ao salvar usuário';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      phone: user.phone || '',
      role: user.role,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await usersApi.delete(userToDelete);
      toast.success('Usuário excluído com sucesso!');
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      loadUsers();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Erro ao excluir usuário';
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'STUDENT',
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'RESPONSIBLE':
        return 'default';
      case 'STUDENT':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Filtrar usuários por nome, email ou telefone
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return users;
    }
    const query = searchQuery.toLowerCase().trim();
    return users.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.phone && user.phone.toLowerCase().includes(query))
    );
  }, [users, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
        {/* Botão Voltar */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 hover:bg-accent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                Gestão de Usuários
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Gerencie todos os usuários do sistema
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => resetForm()} 
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Novo Usuário</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Nome Completo
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Digite o nome completo"
                      required
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="usuario@exemplo.com"
                      required
                      className="h-10"
                    />
                  </div>
                  {!editingUser ? (
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Senha
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Mínimo 6 caracteres"
                        required
                        className="h-10"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Nova Senha <span className="text-xs text-gray-500">(opcional)</span>
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Deixe em branco para manter a senha atual"
                        className="h-10"
                      />
                      <p className="text-xs text-gray-500">
                        Preencha apenas se desejar alterar a senha do usuário
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Telefone
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(00) 00000-0000"
                      required={!editingUser}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">
                      Perfil
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                        <SelectItem value="RESPONSIBLE">Responsável</SelectItem>
                        <SelectItem value="STUDENT">Estudante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="w-full sm:w-auto"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="w-full sm:w-auto">
                      {editingUser ? 'Atualizar' : 'Criar'} Usuário
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Content Card */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-4 sm:p-6">
            {/* Barra de Busca */}
            {!loading && users.length > 0 && (
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Pesquisar por nome, email ou telefone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 h-12 text-base"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {searchQuery && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {filteredUsers.length} usuário{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            )}

            {loading ? (
              <div className="space-y-4">
                {/* Desktop Skeleton */}
                <div className="hidden md:block space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-16" />
                      <Skeleton className="h-12 flex-1" />
                      <Skeleton className="h-12 flex-1" />
                      <Skeleton className="h-12 w-32" />
                      <Skeleton className="h-12 w-24" />
                    </div>
                  ))}
                </div>
                {/* Mobile Skeleton */}
                <div className="md:hidden space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="p-4">
                      <Skeleton className="h-6 w-32 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-6 w-24 mb-3" />
                      <div className="flex gap-2">
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-20" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <UserCircle className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum usuário encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base">
                  Comece criando seu primeiro usuário
                </p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Usuário
                </Button>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <Search className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base">
                  Tente pesquisar com outros termos
                </p>
                <Button 
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                >
                  Limpar busca
                </Button>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block w-full">
                  <div className="rounded-lg border border-border bg-background overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            <th className="h-12 px-4 text-left align-middle font-semibold text-foreground">ID</th>
                            <th className="h-12 px-4 text-left align-middle font-semibold text-foreground">Nome</th>
                            <th className="h-12 px-4 text-left align-middle font-semibold text-foreground">Email</th>
                            <th className="h-12 px-4 text-left align-middle font-semibold text-foreground">Telefone</th>
                            <th className="h-12 px-4 text-left align-middle font-semibold text-foreground">Perfil</th>
                            <th className="h-12 px-4 text-right align-middle font-semibold text-foreground">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user: User) => (
                            <tr 
                              key={user.id}
                              className="border-b border-border transition-colors hover:bg-accent/50"
                            >
                              <td className="h-12 px-4 align-middle font-medium">{user.id}</td>
                              <td className="h-12 px-4 align-middle">
                                <div className="flex items-center gap-2">
                                  <UserCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                                  <span className="font-medium">{user.name}</span>
                                </div>
                              </td>
                              <td className="h-12 px-4 align-middle">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Mail className="w-4 h-4 shrink-0" />
                                  <span className="truncate max-w-xs">{user.email}</span>
                                </div>
                              </td>
                              <td className="h-12 px-4 align-middle">
                                {user.phone ? (
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="w-4 h-4 shrink-0" />
                                    <span>{user.phone}</span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground italic text-sm">Não informado</span>
                                )}
                              </td>
                              <td className="h-12 px-4 align-middle">
                                <Badge variant={getRoleBadgeVariant(user.role)} className="font-medium">
                                  {user.role === 'ADMIN' ? 'Administrador' : user.role === 'RESPONSIBLE' ? 'Responsável' : 'Estudante'}
                                </Badge>
                              </td>
                              <td className="h-12 px-4 align-middle text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={() => handleEdit(user)}
                                    className="h-8 w-8 hover:bg-primary hover:text-primary-foreground transition-colors"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="icon" 
                                    onClick={() => handleDeleteClick(user.id)}
                                    className="h-8 w-8 hover:bg-destructive/90 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {filteredUsers.map((user) => (
                    <Card key={user.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <UserCircle className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                {user.name}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">ID: {user.id}</p>
                            </div>
                          </div>
                          <Badge variant={getRoleBadgeVariant(user.role)} className="shrink-0">
                            {user.role === 'ADMIN' ? 'Admin' : user.role === 'RESPONSIBLE' ? 'Responsável' : 'Estudante'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 pl-13">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4 shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Phone className="w-4 h-4 shrink-0" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2 border-t">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(user)}
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteClick(user.id)}
                            className="flex-1"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Stats Footer */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    {searchQuery ? (
                      <>
                        Mostrando <span className="font-semibold text-primary">{filteredUsers.length}</span> de{' '}
                        <span className="font-semibold text-primary">{users.length}</span> usuário{users.length !== 1 ? 's' : ''}
                      </>
                    ) : (
                      <>
                        Total de <span className="font-semibold text-primary">{users.length}</span> usuário{users.length !== 1 ? 's' : ''} cadastrado{users.length !== 1 ? 's' : ''}
                      </>
                    )}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Modal de Confirmação de Exclusão */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px] text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full text-red-600">
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>
            <DialogTitle className="text-xl">Excluir Usuário</DialogTitle>
            <DialogDescription className="py-4">
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </DialogDescription>
            <DialogFooter className="flex gap-3">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="flex-1">
                Não, cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete} className="flex-1">
                Sim, excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
