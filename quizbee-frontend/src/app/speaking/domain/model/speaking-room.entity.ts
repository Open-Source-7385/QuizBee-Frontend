export interface SpeakingRoom {
  id: string;
  name: string;
  description: string;
  createdBy: string; // User ID
  createdAt: Date;
  maxParticipants?: number;
  isActive: boolean;
  participants: string[]; // User IDs
}

export interface CreateRoomRequest {
  name: string;
  description: string;
  maxParticipants?: number;
}
