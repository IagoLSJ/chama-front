import api from './axios';

export interface Route {
  id: number;
  origin: string;
  destination: string;
  is_active?: boolean;
}

export interface RouteCreate {
  origin: string;
  destination: string;
}

export interface RouteUpdate {
  origin?: string;
  destination?: string;
  is_active?: boolean;
}

export const routesApi = {
  list: async (): Promise<Route[]> => {
    const response = await api.get<Route[]>('/routes/');
    return response.data;
  },

  create: async (data: RouteCreate): Promise<Route> => {
    const response = await api.post<Route>('/routes/', data);
    return response.data;
  },

  update: async (routeId: number, data: RouteUpdate): Promise<Route> => {
    const response = await api.put<Route>(`/routes/${routeId}`, data);
    return response.data;
  },

  delete: async (routeId: number): Promise<void> => {
    await api.delete(`/routes/${routeId}`);
  },
};
