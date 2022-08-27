// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

import { packageId } from '../../constants.js';
import { updatePlaylistSoundsWithTitles } from '../../update-playlist-sounds-with-titles.js';

export function registerPlaylistConfig() {
  Hooks.once('init', () => {
    DocumentSheetConfig.registerSheet(Playlist, packageId, PlaylistConfigWithAutoloadSoundTitles, {
      label: 'AUDIOMETADATAREADER.PlalistConfigLabel',
      makeDefault: game.settings.get(packageId, 'setDefaultPlaylistSheet'),
    });
  });
}

class PlaylistConfigWithAutoloadSoundTitles extends PlaylistConfig {
  /** @override */
  async _onSelectFile(selection, filePicker) {
    if (filePicker.button.dataset.target !== 'importPath') return;
    const contents = await FilePicker.browse(filePicker.activeSource, filePicker.result.target, {
      extensions: Object.keys(CONST.AUDIO_FILE_EXTENSIONS).map((ext) => `.${ext.toLowerCase()}`),
    });
    const playlist = this.object;
    const currentSources = new Set(playlist.sounds.map((s) => s.path));
    const toCreate = contents.files.reduce((arr, src) => {
      if (!AudioHelper.hasAudioExtension(src) || currentSources.has(src)) return arr;
      const soundData = { name: AudioHelper.getDefaultSoundName(src), path: src };
      arr.push(soundData);
      return arr;
    }, []);
    if (toCreate.length) {
      ui.playlists._expanded.add(playlist.id);
      const sounds = await playlist.createEmbeddedDocuments('PlaylistSound', toCreate);
      return updatePlaylistSoundsWithTitles(playlist, sounds);
    } else {
      const warning = game.i18n.format('PLAYLIST.BulkImportWarning', { path: filePicker.target });
      return ui.notifications.warn(warning);
    }
  }
}
