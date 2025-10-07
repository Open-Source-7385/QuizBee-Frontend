import { Injectable } from '@angular/core';
import { User } from '../../domain/model/user.entity';
import { SpeakingRoom } from '../../domain/model/speaking-room.entity';

@Injectable({
  providedIn: 'root'
})
export class RoomAuthorizationService {

  canCreateRoom(user: User): boolean {
    return user.role === 'teacher'; // Usar string directamente
  }

  canDeleteRoom(user: User, room: SpeakingRoom): boolean {
    return user.role === 'teacher' && room.createdBy === user.id;
  }

  canJoinRoom(user: User, room: SpeakingRoom): boolean {
    // Estudiantes no pueden unirse a salas que ya están en o que son sus propias salas de profesor
    if (user.role === 'student') {
      const isAlreadyInRoom = room.participants.includes(user.id);
      const isOwnRoom = room.createdBy === user.id;
      return !isAlreadyInRoom && !isOwnRoom;
    }
    // Profesores pueden unirse a cualquier sala que no sea suya
    return room.createdBy !== user.id && !room.participants.includes(user.id);
  }

  canLeaveRoom(user: User, room: SpeakingRoom): boolean {
    // Cualquier usuario puede dejar una sala en la que esté, excepto el creador
    return room.participants.includes(user.id) && room.createdBy !== user.id;
  }
}
