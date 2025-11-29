// ============================================================================
// Profile Bounded Context - Public API
// ============================================================================
// This file defines the public API of the Profile bounded context
// following Domain-Driven Design (DDD) principles
// ============================================================================

// ----------------------------------------------------------------------------
// Domain Layer - Core business entities and rules
// ----------------------------------------------------------------------------
export * from './domain/entities/profile.entity';
export * from './domain/repositories/profile.repository';
export * from './domain/services/role-manager.service';

// ----------------------------------------------------------------------------
// Application Layer - Use cases and business logic orchestration
// ----------------------------------------------------------------------------
export * from './application/commands/profile.commands';
export * from './application/queries/profile.queries';
export * from './application/services/profile-command.service';
export * from './application/services/profile-query.service';

// ----------------------------------------------------------------------------
// Infrastructure Layer - External concerns and implementations
// ----------------------------------------------------------------------------
export * from './infrastructure/controllers/profile.controller';
export * from './infrastructure/repositories/profile-repository.impl';
export * from './infrastructure/endpoints/profile-endpoint.interface';
export * from './infrastructure/endpoints/profile-json-server.endpoint';
export * from './infrastructure/endpoints/profile-api.endpoint';
export * from './infrastructure/endpoints/profile-api.service';
export * from './infrastructure/assemblers/profile.assembler';
export * from './infrastructure/models/profile.resource';
export * from './infrastructure/models/user.resource';

// ----------------------------------------------------------------------------
// Presentation Layer - UI Components
// ----------------------------------------------------------------------------
export * from './presentation/components/profile/profile.component';

// ----------------------------------------------------------------------------
// Configuration - Module setup and dependency injection
// ----------------------------------------------------------------------------
export * from './profile.providers';
export * from './profile.routes';
export * from './profile.endpoint.config';