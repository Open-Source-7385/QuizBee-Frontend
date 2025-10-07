import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SpeakingRoutingModule } from './speaking-routing.module';
import { SpeakingRoomListComponent } from './presentation/views/speaking-room-list/speaking-room-list';
import { CreateRoomComponent } from './presentation/views/create-room/create-room';

@NgModule({
  declarations: [
    SpeakingRoomListComponent,
    CreateRoomComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SpeakingRoutingModule
  ]
})
export class SpeakingModule { }
