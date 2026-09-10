-- Purpose: Enable cryptographic extensions for secure hashing and UUID generation
-- Dependencies: none
-- Tables/functions affected: database extensions

create extension if not exists "pgcrypto";
