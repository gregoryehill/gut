// Generate a URL-safe unique ID with high entropy
// Uses base62 encoding (alphanumeric) for clean URLs
// 12 characters provides ~71 bits of entropy (much stronger than 8 chars)

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const ID_LENGTH = 12;

export function generateShortId(): string {
  let id = '';
  const randomValues = new Uint8Array(ID_LENGTH);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < ID_LENGTH; i++) {
    id += ALPHABET[randomValues[i] % ALPHABET.length];
  }

  return id;
}
