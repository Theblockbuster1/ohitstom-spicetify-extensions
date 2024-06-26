# quickQueue.js

![Example](example.png)
_This script adds a button next to the heart button on tracklist rows_
_This button lets you add and remove from queue in one click_

### Installation

1. Install [Spicetify](https://spicetify.app) and set it up according to the instructions.
2. Navigate to your Spicetify config directory via the command `spicetify config-dir`.
3. Download quickQueue.js and place it in `/extensions`.
4. Run `spicetify config extensions quickQueue.js` and `Spicetify apply` in terminal.

### Usage

- Hover over tracklist row and click add/remove from queue
- Hold the shift key, or right click to play next in queue

### Compatibility

Relies on a lot of Spicetify wrapper functions and platform apis, could very easily break.
Also relies on css maps, and reactprop trees staying the same.
