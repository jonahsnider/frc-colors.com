# FRC Colors

**[frc-colors.com](https://frc-colors.com)**

A web app & API to get the primary & secondary/accent colors for an FRC team's logo.

Automatically extracts colors from team avatars uploaded to FIRST if verified colors aren't stored in our database.

## API Usage

### Base URL

The API is publicly available at `https://api.frc-colors.com`.

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

The backend is built in TypeScript and uses [tRPC](https://trpc.io/) for internal functionality, and [a minimal HTTP server](https://tinyhttp.v1rtl.site/) for the public API.

It uses a PostgreSQL database via [Drizzle ORM](https://orm.drizzle.team/) for persisting data.
