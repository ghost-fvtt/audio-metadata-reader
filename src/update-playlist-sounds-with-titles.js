// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

import { loadTitle } from './load-metadata.js';

/**
 * Update the names of the given playlist sounds with titles from loaded metadata.
 * @param {Playlist} playlist       The playlist the sounds are contained in
 * @param {PlaylistSound[]} sounds  The playlist sounds to update
 */
export async function updatePlaylistSoundsWithTitles(playlist, sounds) {
  const total = sounds.length;
  let loaded = 0;
  const loadingMessage = game.i18n.localize('AUDIOMETADATAREADER.ProgressLoadingAudioMetadata');
  const showProgress = (n = 1) => {
    loaded += n;
    SceneNavigation.displayProgressBar({
      label: loadingMessage,
      pct: Math.floor((loaded * 100) / total),
    });
  };

  const toUpdate = [];
  const consumers = sounds.splice(0, 10);
  showProgress(0);
  const promises = consumers.map(async (sound) => {
    for (;;) {
      const soundData = { name: await loadTitle(sound.path), _id: sound.id };
      showProgress();
      toUpdate.push(soundData);
      sound = sounds.shift();
      if (!sound) break;
    }
  });

  await Promise.all(promises);
  return playlist.updateEmbeddedDocuments('PlaylistSound', toUpdate);
}
