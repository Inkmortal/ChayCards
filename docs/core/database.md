# Database Layer Documentation

## Overview

The database layer in ChayCards provides the foundation for document storage and retrieval. It uses a flexible schema system that allows plugins to define their own document types while maintaining a consistent base structure.

## Key Files

### `schema.ts`
- Defines the base database schema structure
- Handles document type registration
- Manages schema versioning and migrations

### `service.ts`
- Provides database CRUD operations
- Manages connections and transactions
- Handles plugin-specific data access

## Document Structure

Each document in the database follows a base structure:
1. Common fields (id, created_at, updated_at, etc.)
2. Type-specific fields defined by plugins
3. Metadata for plugin-specific functionality

## Plugin Integration

Plugins can extend the database functionality by:
1. Registering new document types
2. Defining type-specific schemas
3. Implementing custom repositories for data access

## Data Flow

1. Plugin registers document type and schema
2. Core database service validates and stores schema
3. Plugin repository handles type-specific CRUD operations
4. Main process coordinates data access between UI and database

## Schema Extension

The schema system is designed to be extensible:
1. Base schema provides common structure
2. Plugins add their own fields and relationships
3. Runtime schema registration allows dynamic extension
4. Validation ensures data integrity across types
