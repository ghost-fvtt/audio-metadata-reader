// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

import { fetchBlobWithTimeout } from './utils/http.js';
import { safeParseMetadataWithJsmediatags } from './library-wrappers/jsmediatags.js';
import { safeParseMetadataWithParseAudioMetadata } from './library-wrappers/parse-audio-metadata.js';

/**
 * Load the metadata of an audio file.
 * @param {string} src The src path to the audio file
 * @returns {Promise<MaybeMetadata>} A promise that resolves to a metadata object or undefined
 */
export async function loadMetadata(src, { ignoreUnsupported = true } = {}) {
  if (ignoreUnsupported && hasUnsupportedFileExtension(src)) {
    return undefined;
  }

  if (hasOGGFileExtension(src)) {
    const blob = await fetchBlobWithTimeout(src);
    return (
      (await safeParseMetadataWithParseAudioMetadata(blob, src)) ?? (await safeParseMetadataWithJsmediatags(blob, src))
    );
  } else {
    return (
      (await safeParseMetadataWithJsmediatags(src, src)) ?? (await safeParseMetadataWithParseAudioMetadata(src, src))
    );
  }
}

/**
 * Load the title of an audio file.
 * @param {string} src The src path to the audio file
 * @returns {Promise<string|undefined>} A promise that resolves to the title or undefined
 */
export async function loadTitle(src) {
  try {
    return (await loadMetadata(src))?.title;
  } catch (error) {
    logger.warn(`Error while fetching metadata for '${src}'`, error);
    return undefined;
  }
}

/**
 * Does the given source path have an OGG file extension?
 * @param {string} src The source patht o check
 */
function hasOGGFileExtension(src) {
  return ['ogg', 'ogv', 'oga', 'ogx', 'opus'].includes(getFileExtension(src));
}

/**
 * Does the given source path have an unsupported file extension
 * @param {string} src The source path to check
 */
function hasUnsupportedFileExtension(src) {
  return ['wav', 'mid', 'midi', 'webm'].includes(getFileExtension(src));
}

/**
 * Get the file extension of an URL or file path in lower case.
 * @param {string} src The URL or file path to get the extension from
 * @returns {string} The file extension
 */
function getFileExtension(src) {
  return src.split('.').pop()?.toLowerCase();
}

/** @typedef {import('./library-wrappers/jsmediatags.js').JSMediaTagsMetadata | import('./library-wrappers/parse-audio-metadata.js').ParseAudioMetadataMetadata | undefined} MaybeMetadata */
