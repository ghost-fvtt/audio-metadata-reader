// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

/**
 * Split an array into chunks.
 *
 * @template T
 * @param {T[]} input The array to split
 * @param {number} chunkSize The size of the chunks
 * @returns {T[][]} An array of the chunks
 */
export function chunks(input, chunkSize) {
  return input.reduce((result, element, index) => {
    const chunkIndex = Math.floor(index / chunkSize);

    if (!result[chunkIndex]) {
      result[chunkIndex] = [];
    }

    result[chunkIndex].push(element);

    return result;
  }, []);
}
