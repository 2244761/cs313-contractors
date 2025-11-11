export interface Schedule {
  date: string;
  start_time: string;
  end_time: string;
}

export interface Reservation {
  reservation_id: number;
  user_id: string;
  advisor: string;
  purpose: string;
  remarks: string;
  status: string;
  type: string;
  equipments: string[];
  participants: string[];
  room_ids: number[];
  schedules: Schedule[];
  created_at: string;
  updated_at: string;
}
