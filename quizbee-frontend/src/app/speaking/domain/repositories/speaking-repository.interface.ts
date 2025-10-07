import { Observable } from 'rxjs';
import { SpeakingRoom, CreateRoomRequest } from '../model/speaking-room.entity';

export interface ISpeakingRepository {
  // Solo operaciones básicas de gestión de salas
  createRoom(request: CreateRoomRequest, creatorId: string): Observable<SpeakingRoom>;
  getAllRooms(): Observable<SpeakingRoom[]>;
  getRoomById(roomId: string): Observable<SpeakingRoom | null>;
  getRoomsByUser(userId: string): Observable<SpeakingRoom[]>;
  addParticipant(roomId: string, userId: string): Observable<SpeakingRoom>;
  removeParticipant(roomId: string, userId: string): Observable<SpeakingRoom>;
  deleteRoom(roomId: string, userId: string): Observable<void>;
}
