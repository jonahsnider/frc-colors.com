# FRC Colors

**[frc-colors.com](https://frc-colors.com)**

A web app & API to get the primary & secondary/accent colors for an FRC team's logo.

Automatically extracts colors from team avatars uploaded to FIRST if verified colors aren't stored in our database.

## API Usage

### Base URL

The API is publicly available at `https://api.frc-colors.com`.

An OpenAPI 3.1 document is available at `https://api.frc-colors.com/openapi.json`.

### `GET /v1/team/:teamNumber`

Get the colors for a team by number.

#### Example

`GET /v1/team/581`

```json
{
	"primaryHex": "#591616",
	"secondaryHex": "#e86d38",
	"verified": true
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

FRC Colors is built with [TanStack Start](https://tanstack.com/start) and [Vite+](https://viteplus.dev/) for Cloudflare Workers. It uses [Radix Themes](https://www.radix-ui.com/) with [Tailwind CSS](https://tailwindcss.com/) for frontend styling.

The backend is built on Convex and uses Hono for the public HTTP API.

Run `vp install` and `pnpm dev` for local development. The web app uses portless at `frc-colors.com.localhost`.

For production, set the Convex deploy key in the build environment, run `pnpm run build:production`, then run `pnpm run deploy:cloudflare`. The build gets both the Convex deployment and HTTP site URLs from Convex; the deploy command uploads the already built Worker.
