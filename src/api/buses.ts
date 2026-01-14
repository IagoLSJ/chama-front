import api from './axios';

export interface Bus {
  id: number;
  plate: string;
  capacity: number;
}

export interface BusCreate {
  plate: string;
  capacity: number;
}

export interface BusUpdate {
  plate?: string;
  capacity?: number;
}

export const busesApi = {
  list: async (): Promise<Bus[]> => {
    const response = await api.get<Bus[]>('/buses/');
    return response.data;
  },

  get: async (busId: number): Promise<Bus> => {
    const response = await api.get<Bus>(`/buses/${busId}`);
    return response.data;
  },

  create: async (data: BusCreate): Promise<Bus> => {
    const response = await api.post<Bus>('/buses/', data);
    return response.data;
  },

  update: async (busId: number, data: BusUpdate): Promise<Bus> => {
    const response = await api.put<Bus>(`/buses/${busId}`, data);
    return response.data;
  },

  delete: async (busId: number): Promise<void> => {
    await api.delete(`/buses/${busId}`);
  },
};
