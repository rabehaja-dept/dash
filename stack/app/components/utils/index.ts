// Taken from: https://github.com/bryc/code/blob/master/jshash/hashes/murmurhash3.js
// This is used to generate unique aria IDs. Do not use it for anything security related (use official APIs instead)
export function MurmurHash3(key: any, seed: number = 0): number {
  var k,
    p1 = 3432918353,
    p2 = 461845907,
    h = seed | 0;

  for (var i = 0, b = key.length & -4; i < b; i += 4) {
    k = (key[i + 3] << 24) | (key[i + 2] << 16) | (key[i + 1] << 8) | key[i];
    k = Math.imul(k, p1);
    k = (k << 15) | (k >>> 17);
    h ^= Math.imul(k, p2);
    h = (h << 13) | (h >>> 19);
    h = (Math.imul(h, 5) + 3864292196) | 0; // |0 = prevent float
  }

  k = 0;
  switch (key.length & 3) {
    case 3:
      k ^= key[i + 2] << 16;
    case 2:
      k ^= key[i + 1] << 8;
    case 1:
      k ^= key[i];
      k = Math.imul(k, p1);
      k = (k << 15) | (k >>> 17);
      h ^= Math.imul(k, p2);
  }

  h ^= key.length;

  h ^= h >>> 16;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  h ^= h >>> 16;

  return h >>> 0;
}
