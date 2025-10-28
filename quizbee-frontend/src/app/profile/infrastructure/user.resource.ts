export interface UserResource {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  password?: string;
  rol?: 'creador' | 'aprendiz';
}
