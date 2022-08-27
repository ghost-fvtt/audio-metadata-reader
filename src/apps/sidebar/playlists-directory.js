// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

import { loadTitle } from '../../load-metadata.js';
import { updatePlaylistSoundsWithTitles } from '../../update-playlist-sounds-with-titles.js';

export function registerPlaylistDirectorySoundContextOptions() {
  Hooks.on('getPlaylistDirectorySoundContext', getPlaylistDirectorySoundContext);
  Hooks.on('getPlaylistDirectoryEntryContext', getPlaylistDirectoryEntryContext);
}

function getPlaylistDirectorySoundContext(html, entryOptions) {
  entryOptions.push({
    name: 'AUDIOMETADATAREADER.ContextUpdateTitleFromMetadata',
    icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>',
    callback: async (li) => {
      const playlistId = li.parents('.playlist').data('document-id');
      const playlist = game.playlists.get(playlistId);
      const sound = playlist.sounds.get(li.data('sound-id'));

      const title = await loadTitle(sound.path);
      if (title) {
        await sound.update({ name: title });
      } else {
        ui.notifications.warn(game.i18n.format('AUDIOMETADATAREADER.WarningCouldNotLoadTitle', { path: sound.path }));
      }
    },
  });
}

function getPlaylistDirectoryEntryContext(html, entryOptions) {
  entryOptions.push({
    name: 'AUDIOMETADATAREADER.ContextUpdateTitlesFromMetadata',
    icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>',
    callback: async (li) => {
      const playlistId = li.parents('.playlist').data('document-id');
      const playlist = game.playlists.get(playlistId);
      const sounds = playlist.sounds.contents;
      return updatePlaylistSoundsWithTitles(playlist, sounds);
    },
  });
}
