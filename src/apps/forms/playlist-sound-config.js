// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

import '../../../styles/playlist/sound-config.css';

import { packageId } from '../../constants.js';
import { loadTitle } from '../../load-metadata.js';

export function registerPlaylistSoundConfig() {
  Hooks.once('init', () => {
    DocumentSheetConfig.registerSheet(PlaylistSound, packageId, PlaylistSoundConfigWithAutoloadSoundTitles, {
      label: 'AUDIOMETADATAREADER.PlalistSoundConfigLabel',
      makeDefault: game.settings.get(packageId, 'setDefaultPlaylistSoundSheet'),
    });
  });
}

class PlaylistSoundConfigWithAutoloadSoundTitles extends PlaylistSoundConfig {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: `modules/${packageId}/templates/playlist/sound-config.hbs`,
    });
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html[0]
      ?.querySelector('.audio-metadata-reader-infer-track-name')
      ?.addEventListener('click', this._onClickInferTrackName.bind(this));
    return html;
  }

  /**
   * @param {MouseEvent} event The originating click event
   */
  async _onClickInferTrackName(event) {
    event.preventDefault();
    const button = event.currentTarget;
    button.blur();
    const form = button.form;
    const path = form.path;
    await this.#loadTitleIntoNameInput(path.value, form.name);
  }

  /** @override */
  async _onSourceChange(event) {
    event.preventDefault();
    const field = event.target;
    const form = field.form;
    if (!form.name.value) {
      await this.#loadTitleIntoNameInput(field.value, form.name);
    }
  }

  /**
   * Load the title from the given path and put it into the name input.
   * @param {string} path The path to load
   * @param {HTMLInputElement} name The name input to load the Title into
   */
  async #loadTitleIntoNameInput(path, name) {
    name.disabled = true;

    const title = await loadTitle(path);

    if (title !== undefined) {
      name.value = title;
    } else {
      ui.notifications.warn(game.i18n.format('AUDIOMETADATAREADER.WarningCouldNotLoadTitle', { path }));
      name.value = AudioHelper.getDefaultSoundName(path);
    }

    name.disabled = false;
  }
}
