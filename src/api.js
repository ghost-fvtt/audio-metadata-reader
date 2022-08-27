// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

import { packageId } from './constants.js';
import { parseMetadataWithJsmediatags } from './library-wrappers/jsmediatags.js';
import { parseMetadataWithParseAudioMetadata } from './library-wrappers/parse-audio-metadata.js';
import { loadMetadata, loadTitle } from './load-metadata.js';

export function registerAPI() {
  Hooks.once('init', () => {
    game.modules.get(packageId).API = {
      loadMetadata,
      loadTitle,
      parseMetadataWithJsmediatags,
      parseMetadataWithParseAudioMetadata,
    };
  });
}
