import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SpeakingRoom } from '../../domain/model/speaking-room.entity';

@Injectable({
  providedIn: 'root'
})
export class SpeakingStore {
  private userRoomsSubject = new BehaviorSubject<SpeakingRoom[]>([]);
  private availableRoomsSubject = new BehaviorSubject<SpeakingRoom[]>([]);

  public readonly userRooms$: Observable<SpeakingRoom[]> = this.userRoomsSubject.asObservable();
  public readonly availableRooms$: Observable<SpeakingRoom[]> = this.availableRoomsSubject.asObservable();

  setUserRooms(rooms: SpeakingRoom[]): void {
    this.userRoomsSubject.next(rooms);
  }

  setAvailableRooms(rooms: SpeakingRoom[]): void {
    this.availableRoomsSubject.next(rooms);
  }

  addUserRoom(room: SpeakingRoom): void {
    const currentRooms = this.userRoomsSubject.value;
    if (!currentRooms.find(r => r.id === room.id)) {
      this.userRoomsSubject.next([...currentRooms, room]);
    }
  }

  removeUserRoom(roomId: string): void {
    const currentRooms = this.userRoomsSubject.value;
    this.userRoomsSubject.next(currentRooms.filter(room => room.id !== roomId));
  }
}
