// Generate a short, URL-safe unique ID
// Uses lowercase alphanumeric characters for clean URLs

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const ID_LENGTH = 8;

export function generateShortId(): string {
  let id = '';
  const randomValues = new Uint8Array(ID_LENGTH);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < ID_LENGTH; i++) {
    id += ALPHABET[randomValues[i] % ALPHABET.length];
  }

  return id;
}
