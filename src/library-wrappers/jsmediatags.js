// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

import { getURL } from '../utils/http.js';
import { safe } from '../safe-parsing.js';

/**
 * Parses the given audio file with jsmediatags. If the  given `src` is a string, it's interpreted
 * as an URL and the data is fetched from it until the metadata has been parsed.
 *
 * @param {string|Blob} src The audio file to load
 * @returns {Promise<JSMediaTagsMetadata|undefined>} A promise that resolves to a metadata object or undefined
 */
export async function parseMetadataWithJsmediatags(src) {
  const jsmediatags = (await import('jsmediatags/dist/jsmediatags.min.js')).default;
  src = typeof src === 'string' ? getURL(src) : src;

  return new Promise((resolve, reject) => {
    new jsmediatags.Reader(src).read({
      onSuccess: function ({ tags }) {
        resolve(tags ?? undefined);
      },
      onError: function (error) {
        reject(error);
      },
    });
  });
}

export const safeParseMetadataWithJsmediatags = safe(parseMetadataWithJsmediatags, 'jsmediatags');

/**
 * @typedef {Object} JSMediaTagsTag
 *
 * @property {string} id          The name of the tag
 * @property {string} description The description of the tag
 * @property {number} size        The size of the tag
 * @property {unknown} data       The actual tag data
 */

/**
 * @typedef {Object} JSMediaTagsShortcuts
 *
 * @property {string} [title]
 * @property {string} [artist]
 * @property {string} [album]
 * @property {string} [year]
 * @property {string} [comment]
 * @property {string} [track]
 * @property {string} [genre]
 * @property {ArrayBuffer} [picture]
 * @property {string} [lyrics]
 */

/** @typedef {Record<string, JSMediaTagsTag>&JSMediaTagsShortcuts} JSMediaTagsMetadata */
