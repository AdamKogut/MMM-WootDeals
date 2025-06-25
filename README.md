# MMM-WootDeals

MMM-WootDeals is a [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror) module that displays the latest featured deals from Woot.com. The module fetches deals using the official Woot API and presents them in a configurable grid layout on your MagicMirror. You can set how many deals to show per page, how often to cycle through pages, and how frequently to refresh the deals. Each deal includes an image and title, and the module automatically cycles through all available offers.

## Screenshot

![Example of MMM-WootDeals](./wootdeals-screenshot.png)

## Installation

### Install

In your terminal, go to your [MagicMirror²][mm] Module folder and clone MMM-WootDeals:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/AdamKogut/MMM-WootDeals
cd MMM-WootDeals
npm i
```

### Update

```bash
cd ~/MagicMirror/modules/MMM-WootDeals
git pull
```

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:

```js
    {
        module: 'MMM-WootDeals',
        position: 'lower_third',
        config: {
            apiKey: '',                // Your Woot API key (required)
        }
    },
```

Or you could use all the options:

```js
    {
        module: 'MMM-WootDeals',
        position: 'lower_third',
        header: 'Woot Deals',
        config: {
            apiKey: '',                // Your Woot API key (required)
            updateInterval: 60 * 60 * 1000, // How often to fetch new deals (in ms)
            numRows: 1,                // Number of rows to display per page
            numColumns: 1,             // Number of columns to display per page
            pageCycleInterval: 20 * 1000 // How often to cycle pages (in ms)
        }
    },
```

## Configuration options

Option             | Possible values | Default           | Description
-------------------|----------------|-------------------|----------------------------------------------------------
`apiKey`           | `string`       | `""`              | Your Woot API key (required). You can request an API key in the Woot! [forums](https://forums.woot.com/t/request-developer-api-key/734283)
`updateInterval`   | `number`       | `60 * 60 * 1000`  | How often to fetch new deals, in milliseconds
`numRows`          | `number`       | `1`               | Number of rows to display per page
`numColumns`       | `number`       | `1`               | Number of columns to display per page
`pageCycleInterval`| `number`       | `20 * 1000`       | How often to cycle pages, in milliseconds

## Sending notifications to the module

Notification         | Payload type | Description
---------------------|-------------|------------------------------------------------------
`GET_WOOT_OFFERS`    | `object`    | Sent to node_helper to request new Woot offers (includes config)
`WOOT_OFFERS`        | `array`     | Sent from node_helper to module with the latest offers

## Developer commands

- `npm install` - Install devDependencies like ESLint.
- `npm run lint` - Run linting and formatter checks.
- `npm run lint:fix` - Fix linting and formatter issues.

[mm]: https://github.com/MagicMirrorOrg/MagicMirror
