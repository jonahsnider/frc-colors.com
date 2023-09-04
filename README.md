# FRC Colors

**[frc-colors.com](https://frc-colors.com)**

A web app & API to get the primary & secondary/accent colors for an FRC team's logo.

Automatically extracts colors from team avatars uploaded to FIRST if verified colors aren't stored in our database.

## API Usage

### Base URL

The API is publicly available at `https://frc-colors.com/api`.

### `GET /team/:teamNumber`

Get the colors for a team by number.

#### Example

`GET /team/581`

```json
{
  "teamNumber": 581,
  "colors": {
    "primaryHex": "#e86d38",
    "secondaryHex": "#7c7c7c",
    "verified": false
  }
}
```

### `GET /team`

Get the colors for several teams by number.

#### Example

`GET /team?team=581&team=254&team=1678`

```json
{
  "teams": [
    {
      "teamNumber": 581,
      "colors": {
        "primaryHex": "#e86d38",
        "secondaryHex": "#7c7c7c",
        "verified": false
      }
    },
    {
      "teamNumber": 254,
      "colors": {
        "primaryHex": "#0070ff",
        "secondaryHex": "#232323",
        "verified": true
      }
    },
    null
  ]
}
```

#### Query Parameters

- `team`: The team number to get the colors for. Can be repeated.
