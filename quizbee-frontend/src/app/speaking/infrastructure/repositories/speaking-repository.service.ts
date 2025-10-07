import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { ISpeakingRepository } from '../../domain/repositories/speaking-repository.interface';
import { SpeakingRoom, CreateRoomRequest } from '../../domain/model/speaking-room.entity';

@Injectable({
  providedIn: 'root'
})
export class SpeakingRepositoryService implements ISpeakingRepository {

  private rooms: SpeakingRoom[] = [
    {
      id: '1',
      name: 'English Conversation Club',
      description: 'Practice your English speaking skills',
      createdBy: 'teacher1',
      createdAt: new Date('2024-01-15'),
      maxParticipants: 10,
      isActive: true,
      participants: ['student1', 'student2']
    },
    {
      id: '2',
      name: 'Advanced Debate Room',
      description: 'For advanced English debaters',
      createdBy: 'teacher1',
      createdAt: new Date('2024-01-20'),
      maxParticipants: 8,
      isActive: true,
      participants: ['student3']
    },
    {
      id: '3',
      name: 'Beginner Speaking Practice',
      description: 'Basic English conversation for beginners',
      createdBy: 'teacher2',
      createdAt: new Date('2024-01-25'),
      maxParticipants: 15,
      isActive: true,
      participants: []
    }
  ];

  createRoom(request: CreateRoomRequest, creatorId: string): Observable<SpeakingRoom> {
    const newRoom: SpeakingRoom = {
      ...request,
      id: this.generateId(),
      createdBy: creatorId,
      createdAt: new Date(),
      isActive: true,
      participants: []
    };
    this.rooms.push(newRoom);
    return of(newRoom);
  }

  getAllRooms(): Observable<SpeakingRoom[]> {
    return of(this.rooms.filter(room => room.isActive));
  }

  getRoomById(roomId: string): Observable<SpeakingRoom | null> {
    const room = this.rooms.find(r => r.id === roomId && r.isActive);
    return of(room || null);
  }

  getRoomsByUser(userId: string): Observable<SpeakingRoom[]> {
    const userRooms = this.rooms.filter(room =>
      room.isActive &&
      (room.createdBy === userId || room.participants.includes(userId))
    );
    return of(userRooms);
  }

  addParticipant(roomId: string, userId: string): Observable<SpeakingRoom> {
    const room = this.rooms.find(r => r.id === roomId && r.isActive);
    if (!room) {
      return throwError(() => new Error('Room not found'));
    }
    if (!room.participants.includes(userId)) {
      room.participants.push(userId);
    }
    return of({...room});
  }

  removeParticipant(roomId: string, userId: string): Observable<SpeakingRoom> {
    const room = this.rooms.find(r => r.id === roomId && r.isActive);
    if (!room) {
      return throwError(() => new Error('Room not found'));
    }
    room.participants = room.participants.filter(id => id !== userId);
    return of({...room});
  }

  deleteRoom(roomId: string, userId: string): Observable<void> {
    const room = this.rooms.find(r => r.id === roomId);
    if (!room) {
      return throwError(() => new Error('Room not found'));
    }
    if (room.createdBy !== userId) {
      return throwError(() => new Error('Not authorized to delete this room'));
    }
    room.isActive = false;
    return of(void 0);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
