import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpeakingRoomListComponent } from './presentation/views/speaking-room-list/speaking-room-list';
import { CreateRoomComponent } from './presentation/views/create-room/create-room';
import { TeacherRoleGuard } from './presentation/guards/teacher-role';

const routes: Routes = [
  { path: '', component: SpeakingRoomListComponent },
  {
    path: 'create',
    component: CreateRoomComponent,
    canActivate: [TeacherRoleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpeakingRoutingModule { }
