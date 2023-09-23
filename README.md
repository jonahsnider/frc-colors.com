# FRC Colors

**[frc-colors.com](https://frc-colors.com)**

A web app & API to get the primary & secondary/accent colors for an FRC team's logo.

Automatically extracts colors from team avatars uploaded to FIRST if verified colors aren't stored in our database.

## API Usage

### Base URL

The API is publicly available at `https://frc-colors.com/api`.

### `GET /v1/team/:teamNumber`

Get the colors for a team by number.

#### Example

`GET /v1/team/581`

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

### `GET /v1/team`

Get the colors for several teams by number.

#### Example

`GET /v1/team?team=581&team=254&team=1678`

```json
{
  "teams": {
    "254": {
      "teamNumber": 254,
      "colors": {
        "primaryHex": "#0070ff",
        "secondaryHex": "#232323",
        "verified": true
      }
    },
    "581": {
      "teamNumber": 581,
      "colors": {
        "primaryHex": "#e86d38",
        "secondaryHex": "#7c7c7c",
        "verified": false
      }
    },
    "1678": {
      "teamNumber": 1678,
      "colors": null
    }
  }
}
```

### `GET /v1/event/:eventCode`

Get the colors for all teams at an event.

#### Example

`GET /v1/event/2023cc`

```json
{
  "teams": {
    "254": {
      "teamNumber": 254,
      "colors": {
        "primaryHex": "#0070ff",
        "secondaryHex": "#232323",
        "verified": true
      }
    },
    "581": {
      "teamNumber": 581,
      "colors": {
        "primaryHex": "#e86d38",
        "secondaryHex": "#7c7c7c",
        "verified": false
      }
    },
    "1678": {
      "teamNumber": 1678,
      "colors": null
    }
  }
}
```

## Development

FRC Colors is built with [Next.js](https://nextjs.org/) and uses [Tailwind CSS](https://tailwindcss.com/) for frontend styling.

The backend is built using Next.js's route handler feature.
It runs on [Vercel's Edge Runtime](https://edge-runtime.vercel.app/) for best performance.

It uses a PostgreSQL database via [Drizzle ORM](https://orm.drizzle.team/) with Redis for caching.

### Caching behavior

To minimize latency, FRC Colors heavily caches team data, such as:

- Team avatars
- Colors extracted from team avatars
- Team name (shown on the website)

The cached values will automatically expire 14-30 days after they were stored.
