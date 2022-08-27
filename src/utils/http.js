// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

/**
 * A small wrapper that automatically asks for a {@link Blob} with a Timeout.
 * @param {string} url        The URL to make the Request to
 * @param {object} [data]     The data of the Request
 * @param {Options} [options] Additional options to configure the Request
 * @returns {Promise<Blob>}
 */
export async function fetchBlobWithTimeout(url, data = {}, { timeoutMs = 30000, onTimeout = () => {} } = {}) {
  const response = await foundry.utils.fetchWithTimeout(url, data, { timeoutMs, onTimeout });
  return response.blob();
}

/**
 * @typedef {object} Options
 *
 * @property {number|null} [timeoutMs=30000]  How long to wait for a Response before cleanly aborting.
 *                                            If null, no timeout is applied
 * @property {() => void} [onTimeout]         A method to invoke if and when the timeout is reached
 */

/**
 * @param {string} src The source of an audio file
 */
export function getURL(src) {
  const regexp = /^http(s?):\/\//;
  if (regexp.test(src)) {
    return src;
  } else {
    return new URL(src, window.location.origin).toString();
  }
}
