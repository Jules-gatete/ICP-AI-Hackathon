import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from './declarations/project_backend/project_backend.did.js';

// Use environment variables or fallback to local defaults
const host = import.meta.env.VITE_REACT_APP_HOST || 'http://127.0.0.1:4943';
const canisterId = import.meta.env.VITE_PROJECT_BACKEND_CANISTER_ID || 'bd3sg-teaaa-aaaaa-qaaba-cai';

// Create an agent to connect to the local replica
const agent = new HttpAgent({ host });

// For local development, fetch the root key
if (import.meta.env.MODE !== 'production') {
  agent.fetchRootKey().catch((err) => {
    console.warn('Unable to fetch root key. Ensure the local replica is running.', err);
  });
}

// Create an actor to interact with the canister
export const projectBackend = Actor.createActor(idlFactory, {
  agent,
  canisterId,
});