import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SpeakingRoom, CreateRoomRequest } from '../../domain/model/speaking-room.entity';
import { User } from '../../domain/model/user.entity';
import { ISpeakingRepository } from '../../domain/repositories/speaking-repository.interface';
import { RoomAuthorizationService } from './room-authorization.service';
import { SpeakingStore } from '../stores/speaking.store';

@Injectable({
  providedIn: 'root'
})
export class SpeakingFacadeService {

  constructor(
    private speakingRepository: ISpeakingRepository,
    private authorizationService: RoomAuthorizationService,
    private speakingStore: SpeakingStore
  ) {}

  createRoom(request: CreateRoomRequest, user: User): Observable<SpeakingRoom> {
    if (!this.authorizationService.canCreateRoom(user)) {
      throw new Error('User is not authorized to create rooms');
    }

    return this.speakingRepository.createRoom(request, user.id).pipe(
      tap(room => {
        this.speakingStore.addUserRoom(room);
        this.loadAvailableRooms(user.id);
      })
    );
  }

  joinRoom(roomId: string, user: User): Observable<SpeakingRoom> {
    return this.speakingRepository.getRoomById(roomId).pipe(
      tap(room => {
        if (!room) throw new Error('Room not found');
        if (!this.authorizationService.canJoinRoom(user, room)) {
          throw new Error('User cannot join this room');
        }
      }),
      tap(() => this.speakingRepository.addParticipant(roomId, user.id)),
      tap(room => {
        this.speakingStore.addUserRoom(room);
        this.loadAvailableRooms(user.id);
      })
    );
  }

  leaveRoom(roomId: string, user: User): Observable<SpeakingRoom> {
    return this.speakingRepository.getRoomById(roomId).pipe(
      tap(room => {
        if (!room) throw new Error('Room not found');
        if (!this.authorizationService.canLeaveRoom(user, room)) {
          throw new Error('User cannot leave this room');
        }
      }),
      tap(() => this.speakingRepository.removeParticipant(roomId, user.id)),
      tap(room => {
        this.speakingStore.removeUserRoom(roomId);
        this.loadAvailableRooms(user.id);
      })
    );
  }

  deleteRoom(roomId: string, user: User): Observable<void> {
    return this.speakingRepository.getRoomById(roomId).pipe(
      tap(room => {
        if (!room) throw new Error('Room not found');
        if (!this.authorizationService.canDeleteRoom(user, room)) {
          throw new Error('User cannot delete this room');
        }
      }),
      tap(() => this.speakingRepository.deleteRoom(roomId, user.id)),
      tap(() => {
        this.speakingStore.removeUserRoom(roomId);
        this.loadAvailableRooms(user.id);
      })
    );
  }

  loadUserRooms(userId: string): void {
    this.speakingRepository.getRoomsByUser(userId).subscribe(rooms => {
      this.speakingStore.setUserRooms(rooms);
    });
  }

  loadAvailableRooms(userId: string): void {
    this.speakingRepository.getAllRooms().subscribe(allRooms => {
      const availableRooms = allRooms.filter(room =>
        room.isActive &&
        !room.participants.includes(userId) &&
        room.createdBy !== userId
      );
      this.speakingStore.setAvailableRooms(availableRooms);
    });
  }

  canUserManageRoom(user: User, room: SpeakingRoom): boolean {
    return this.authorizationService.canDeleteRoom(user, room);
  }
}
