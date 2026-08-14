# Antimatter Dimensions Save Editor

A powerful web-based tool for editing and managing save files from the Antimatter Dimensions game, including support for the latest Reality Update.

![Version](https://img.shields.io/badge/version-2.1-blue)
[![GitHub Issues](https://img.shields.io/github/issues/Sato-Isolated/Antimatter-Dimensions-Save-Editor)](https://github.com/Sato-Isolated/Antimatter-Dimensions-Save-Editor/issues)

## Features

- **Structured Editor**: User-friendly interface for editing game values
  - General Settings
  - Antimatter Dimensions
  - Replicanti System
  - Infinity Dimensions
  - Eternity & Time Dimensions
  - Dilation & Black Holes
  - Reality
  - Glyphs & Sacrifice Values
  - Achievements
  - Celestials (Teresa, Effarig, Nameless Ones, V, Ra, Lai'tela, Pelle)
  - All values explorer with path search, type filters, domain filters, and direct editing for fields without a dedicated control

- **JSON Editor**: Direct JSON editing for advanced users

- **Save Management**
  - Import/Export encrypted save data
  - Decrypt/Encrypt save files
  - Validation of save file structure

- **User Experience**
  - Dark/Light theme support
  - Responsive design
  - Customizable settings
  - Keyboard shortcuts
  - Validation and error checking

## Getting Started

1. Visit [Antimatter Dimensions Save Editor](https://sato-isolated.github.io/Antimatter-Dimensions-Save-Editor/)
2. Export your save from Antimatter Dimensions
3. Paste your save data into the Import section
4. Click "Decrypt" to load your save
5. Make your desired changes
6. Click "Encrypt" to generate the modified save
7. Copy the encrypted save and import it back into the game

## Usage

### Structured Editor

The structured editor provides an intuitive interface for editing game values:

- **General**: Modify basic values like antimatter, infinities, eternities, records, and more
- **Dimensions**: Edit antimatter, infinity, and time dimensions with their amounts and multipliers
- **Replicanti**: Control replication chance, interval, galaxies, and toggle unlock status
- **Infinity**: Manage infinity points, infinity power, and related values
- **Eternity**: Control eternity points, time shards, theorems, and studies
- **Dilation**: Adjust tachyon particles, dilated time, and black hole settings
- **Reality**: Edit reality machines, imaginary machines, and perk points
- **Automator**: Edit the scripts and constants saved by the game, inspect execution state, and browse the pinned in-game command reference. Script text is preserved but not compiled by the editor.
- **Glyphs**: Modify glyph level cap, sacrifice values, and cosmetic settings
- **Achievements**: Unlock all achievements or secret achievements with a single click
  - **Celestials**: Fine-tune all celestial-related properties for each of the seven celestials
  - **Challenges**: Inspect upstream completion bits individually or complete all known Normal/Infinity Challenges with the exact game masks
  - **Bits & collections**: Edit upstream progression, celestial, glyph, interface/news bitfields and Set-backed collections while preserving unknown values

- **All values**: Search every object, array, and leaf found in the loaded save. Fields marked `Discovered` are inferred from the current document and remain available even when the structured registry has no dedicated definition yet.

To complete every known bitfield challenge, open **Challenges**, choose
**Normal Challenges** or **Infinity Challenges**, then click **Complete all
known**. Challenge ids are one-based bit indexes: Normal Challenges 1-12 use
mask `8190`, and Infinity Challenges 1-8 use mask `510`; bit 0 is unused.
Unknown or future bits are preserved. Eternity Challenge completion is not a
bitfield: set `eternityChalls.eterc1` through `eternityChalls.eterc12` to `5`
in the Eternity section to mark all five completions for each challenge.

The detailed index and compatibility notes for the new bitfield/collection
controls are in [`docs/bitfields-and-collections.md`](docs/bitfields-and-collections.md)
and [`docs/upstream-compatibility.md`](docs/upstream-compatibility.md).

### JSON Editor

For advanced users who need direct access to the save file structure:

- View and edit the complete save file in JSON format
- Full control over all game variables
- JSON validation and formatting

### Settings

Customize your editing experience:

- Choose default editor view
- Enable/disable confirmations
- Switch between display modes
- Configure advanced options

## Compatibility and backup boundaries

The editor supports the documented PC, Android, and iOS save transport
envelopes at the codec and fixture level. The iOS fixture is derived from a
real iOS export, re-encoded by this editor after scrubbing the one
identifying string; it is not shipped as the raw payload. Mobile transport
support is not a claim of PC-to-mobile conversion or compatibility with every
live Android or iOS game build. An internal round-trip does not prove that a
real save will load in the game; use an untouched backup and perform a manual
import/export check before relying on an edited save. The editor does not
apply upstream save migrations automatically.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Disclaimer

This project is not affiliated with Antimatter Dimensions. Use at your own risk and always backup your save files before making changes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have suggestions:

- [Report an issue](https://github.com/Sato-Isolated/Antimatter-Dimensions-Save-Editor/issues)
- Check existing issues for solutions
- Join the community discussions
