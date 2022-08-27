// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

import { fetchBlobWithTimeout } from '../utils/http.js';
import { safe } from '../safe-parsing.js';

/**
 * Parses the given audio file with parse-audio-metadata. If the  given `src` is a string, it's interpreted as an URL
 * and the file is fetched from it.
 *
 * @param {string|Blob} src The audio file to parse
 * @returns {Promise<ParseAudioMetadataMetadata>} A promise that resolves to a metadata object
 */
export async function parseMetadataWithParseAudioMetadata(src) {
  const blobPromise = typeof src === 'string' ? fetchBlobWithTimeout(src) : src;
  const [blob, { default: parseAudioMetadata }] = await Promise.all([blobPromise, import('parse-audio-metadata')]);

  if (!blob) {
    return undefined;
  }

  return parseAudioMetadata(blob);
}

export const safeParseMetadataWithParseAudioMetadata = safe(
  parseMetadataWithParseAudioMetadata,
  'parse-audio-metadata',
);

/**
 * @typedef {object} ParseAudioMetadataMetadata
 *
 * @property {string} [title]
 */
