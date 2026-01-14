import api from './axios';

export interface Attendance {
  id: number;
  travel_id: number;
  student_id: number;
  status: 'CONFIRMADO' | 'PENDENTE' | 'CANCELADO';
  confirmed_at?: string;
  confirmed_by_id?: number;
  is_waitlist: boolean;
  student?: {
    id: number;
    name: string;
    email: string;
  };
}

export const attendancesApi = {
  getTravelAttendances: async (travelId: number): Promise<Attendance[]> => {
    const response = await api.get<Attendance[]>(`/attendances/travel/${travelId}`);
    return response.data;
  },

  joinTravel: async (travelId: number): Promise<Attendance> => {
    const response = await api.post<Attendance>(`/attendances/join/${travelId}`);
    return response.data;
  },

  confirmPresence: async (travelId: number, studentId: number): Promise<Attendance> => {
    const response = await api.post<Attendance>(`/attendances/confirm/${travelId}/${studentId}`);
    return response.data;
  },

  closeAttendance: async (travelId: number): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/attendances/close/${travelId}`);
    return response.data;
  },
};
