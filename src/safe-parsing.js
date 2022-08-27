// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

import { logger } from './logger.js';

/**
 * Wrap a parsing function with returning undefined and logging a warning instead of rejecting.
 * @template T
 * @param {(src: string | Blob) => Promise<T>} fn The parsing function to wrap
 * @param {string} parserName                   The name of the parser
 * @returns {(src: string | Blob, name: string) => Promise<T | undefined>}
 */
export function safe(fn, parserName) {
  return async (src, name) => {
    try {
      return await fn(src);
    } catch (error) {
      logger.warn(`Cannot parse '${name}' with ${parserName}:`, error);
      return undefined;
    }
  };
}
