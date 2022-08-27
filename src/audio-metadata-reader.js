// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

import { registerAPI } from './api.js';
import { registerPlaylistConfig } from './apps/forms/playlist-config.js';
import { registerPlaylistSoundConfig } from './apps/forms/playlist-sound-config.js';
import { registerPlaylistDirectorySoundContextOptions } from './apps/sidebar/playlists-directory.js';
import { registerSettings } from './settings.js';

registerSettings();
registerAPI();
registerPlaylistConfig();
registerPlaylistSoundConfig();
registerPlaylistDirectorySoundContextOptions();
