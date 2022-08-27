// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

import { packageId } from '../../constants.js';
import { loadTitle } from '../../load-metadata.js';

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
    const files = contents.files.filter((src) => AudioHelper.hasAudioExtension(src) && !currentSources.has(src));
    const total = files.length;
    let loaded = 0;
    const loadingMessage = game.i18n.localize('AUDIOMETADATAREADER.ProgressLoadingAudioMetadata');
    const showProgress = () => {
      SceneNavigation.displayProgressBar({
        label: loadingMessage,
        pct: Math.floor((loaded * 100) / total),
      });
    };
    showProgress();

    const toCreate = [];
    for (const src of files) {
      const soundData = { name: (await loadTitle(src)) ?? AudioHelper.getDefaultSoundName(src), path: src };
      loaded += 1;
      showProgress();
      toCreate.push(soundData);
    }

    // const toCreate = await Promise.all(
    //   files.map(async (src) => {
    //     const soundData = { name: (await loadTitle(src)) ?? AudioHelper.getDefaultSoundName(src), path: src };
    //     loaded += 1;
    //     showProgress();
    //     return soundData;
    //   }),
    // );

    // const toCreate = [];
    // for (const srcs of chunks(files, 10)) {
    //   const soundDatas = await Promise.all(
    //     srcs.map(async (src) => {
    //       const soundData = { name: (await loadTitle(src)) ?? AudioHelper.getDefaultSoundName(src), path: src };
    //       loaded += 1;
    //       showProgress();
    //       return soundData;
    //     }),
    //   );
    //   toCreate.push(...soundDatas);
    // }

    if (toCreate.length) {
      ui.playlists._expanded.add(playlist.id);
      return playlist.createEmbeddedDocuments('PlaylistSound', toCreate);
    } else {
      const warning = game.i18n.format('PLAYLIST.BulkImportWarning', { path: filePicker.target });
      return ui.notifications.warn(warning);
    }
  }
}
