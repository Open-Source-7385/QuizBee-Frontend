import { User, UserRole } from '../model/user.entity';
import { SpeakingRoom } from '../model/speaking-room.entity';

export interface IRoomAuthorizationService {
  canCreateRoom(user: User): boolean;
  canDeleteRoom(user: User, room: SpeakingRoom): boolean;
  canJoinRoom(user: User, room: SpeakingRoom): boolean;
  canLeaveRoom(user: User, room: SpeakingRoom): boolean;
}
