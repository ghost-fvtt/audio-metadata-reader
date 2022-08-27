// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

import { loadTitle } from '../../load-metadata.js';

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
      const sounds = playlist.sounds;
      const total = sounds.size;
      let loaded = 0;
      const loadingMessage = game.i18n.localize('AUDIOMETADATAREADER.ProgressLoadingAudioMetadata');
      const showProgress = () => {
        SceneNavigation.displayProgressBar({
          label: loadingMessage,
          pct: Math.floor((loaded * 100) / total),
        });
      };
      showProgress();

      const toUpdate = [];
      for (const sound of sounds) {
        const soundData = { name: await loadTitle(sound.path), _id: sound.id };
        loaded += 1;
        showProgress();
        toUpdate.push(soundData);
      }

      await playlist.updateEmbeddedDocuments('PlaylistSound', toUpdate);
    },
  });
}
