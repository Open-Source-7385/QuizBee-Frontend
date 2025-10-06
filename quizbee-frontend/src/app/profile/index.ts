// Domain exports
export * from './domain/entities/profile.entity';
export * from './domain/repositories/profile.repository';
export * from './domain/services/role-manager.service';

// Application exports
export * from './application/commands/profile.commands';
export * from './application/queries/profile.queries';
export * from './application/services/profile-command.service';
export * from './application/services/profile-query.service';

// Infrastructure exports
export * from './infrastructure/controllers/profile.controller';
export * from './infrastructure/repositories/profile-repository.impl';
export * from './infrastructure/endpoints/profile-api.endpoint';
export * from './infrastructure/assemblers/profile.assembler';
export * from './infrastructure/models/profile.resource';

// Presentation exports
export * from './presentation/components/profile/profile.component';

// Configuration exports
export * from './profile.providers';
export * from './profile.routes';