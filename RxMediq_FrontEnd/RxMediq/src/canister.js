import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from './declarations/project_backend/project_backend.did.js'; // Adjust path as needed

// Local host where the replica is running
const host = process.env.REACT_APP_HOST || 'http://127.0.0.1:4943';
const canisterId = process.env.REACT_APP_PROJECT_BACKEND_CANISTER_ID || 'be2us-64aaa-aaaaa-qaabq-cai';

// Create an agent to connect to the local replica
const agent = new HttpAgent({ host });

// For local development, fetch the root key
if (process.env.NODE_ENV !== 'production') {
  agent.fetchRootKey().catch((err) => {
    console.warn('Unable to fetch root key. Ensure the local replica is running.', err);
  });
}

// Create an actor to interact with the canister
const projectBackend = Actor.createActor(idlFactory, {
  agent,
  canisterId,
});

projectBackend
  .greet('World') // Replace 'greet' with an actual method from your canister
  .then((response) => {
    console.log('Response from backend:', response);
  })
  .catch((error) => {
    console.error('Error calling backend:', error);
  });

export default projectBackend;