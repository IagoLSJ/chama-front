import api from './axios';

export interface Travel {
  id: number;
  date_time: string;
  bus_id: number;
  route_id: number;
  status: 'ABERTA' | 'ENCERRADA' | 'CANCELADA';
  bus?: {
    id: number;
    plate: string;
    capacity: number;
  };
  route?: {
    id: number;
    origin: string;
    destination: string;
  };
}

export interface TravelCreate {
  date_time: string; // ISO datetime string
  bus_id: number;
  route_id: number;
}

export type TravelStatus = 'ABERTA' | 'ENCERRADA' | 'CANCELADA';

export const travelsApi = {
  list: async (): Promise<Travel[]> => {
    const response = await api.get<Travel[]>('/travels/');
    return response.data;
  },

  create: async (data: TravelCreate): Promise<Travel> => {
    const response = await api.post<Travel>('/travels/', data);
    return response.data;
  },

  updateStatus: async (travelId: number, status: TravelStatus): Promise<Travel> => {
    const response = await api.patch<Travel>(`/travels/${travelId}/status`, status);
    return response.data;
  },
};
