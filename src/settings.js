// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

import { packageId } from './constants.js';

export function registerSettings() {
  Hooks.once('init', () => {
    game.settings.register(packageId, 'setDefaultPlaylistSheet', {
      name: 'AUDIOMETADATAREADER.SettingSetDefaultPlaylistSheetName',
      hint: 'AUDIOMETADATAREADER.SettingSetDefaultPlaylistSheetHint',
      scope: 'client',
      config: true,
      type: Boolean,
      default: true,
      requiresReload: true,
    });

    game.settings.register(packageId, 'setDefaultPlaylistSoundSheet', {
      name: 'AUDIOMETADATAREADER.SettingSetDefaultPlaylistSoundSheetName',
      hint: 'AUDIOMETADATAREADER.SettingSetDefaultPlaylistSoundSheetHint',
      scope: 'client',
      config: true,
      type: Boolean,
      default: true,
      requiresReload: true,
    });
  });
}
