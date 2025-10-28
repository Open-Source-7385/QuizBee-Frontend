export class User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  password?: string;
  rol?: 'creador' | 'aprendiz';

  constructor(data: Partial<User> = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.email = data.email || '';
    this.avatar = data.avatar || '👤';
    this.password = data.password || '';
    this.rol = data.rol as 'creador' | 'aprendiz' || undefined;
  }

  isValidForRegistration(): boolean {
    return (
      this.name.length > 0 &&
      this.email.length > 0 &&
      typeof this.password === 'string' &&
      this.password.length > 5 &&
      (this.rol === 'creador' || this.rol === 'aprendiz')
    );
  }
}
