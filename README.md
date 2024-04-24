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
		"primaryHex": "#591616",
		"secondaryHex": "#e86d38",
		"verified": true
	}
}
```

### `GET /v1/team`

Get the colors for several teams by number.

#### Example

`GET /v1/team?team=581&team=751&team=9408`

```json
{
	"teams": {
		"581": {
			"teamNumber": 581,
			"colors": {
				"primaryHex": "#591616",
				"secondaryHex": "#e86d38",
				"verified": true
			}
		},
		"751": {
			"teamNumber": 751,
			"colors": null
		},
		"9408": {
			"teamNumber": 9408,
			"colors": {
				"primaryHex": "#1d2e3b",
				"secondaryHex": "#ffffff",
				"verified": false
			}
		}
	}
}
```

### `GET /v1/event/:eventCode`

Get the colors for all teams at an event.

#### Example

`GET /v1/event/2023cc`

Same response format as `GET /v1/team`.

### `GET /v1/team?all`

Get the colors for all teams.

#### Example

`GET /v1/team?all`

Same response format as `GET /v1/team`.

## Development

FRC Colors is built with [Next.js](https://nextjs.org/) and uses [Tailwind CSS](https://tailwindcss.com/) for frontend styling.

The backend is built in TypeScript and uses [tRPC](https://trpc.io/) for internal functionality, and [a minimal HTTP server](https://hono.dev/) for the public API.

It uses a PostgreSQL database via [Drizzle ORM](https://orm.drizzle.team/) for persisting data.
