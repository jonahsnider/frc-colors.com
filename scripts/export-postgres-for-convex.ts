import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const outputDirectory = resolve(process.argv[2] ?? '/private/tmp/frc-colors-convex-import');
await mkdir(outputDirectory, { recursive: true });

const sql = postgres(connectionString, { max: 1, ssl: 'require' });

try {
	const [teamColors, verificationRequests, colorSubmissions] = await Promise.all([
		sql<
			{
				team: number;
				primary_hex: string;
				secondary_hex: string;
				verified: boolean;
				created_at: Date;
				updated_at: Date | null;
			}[]
		>`
			select team_number as team, primary_hex, secondary_hex, verified, created_at, updated_at from team_colors`,
		sql<
			{
				id: string;
				team: number;
				status: 'PENDING' | 'FINISHED' | 'REJECTED';
				created_at: Date;
				updated_at: Date | null;
			}[]
		>`
			select id, team_number as team, status, created_at, updated_at from verification_requests`,
		sql<
			{
				id: string;
				team: number;
				primary_hex: string;
				secondary_hex: string;
				status: 'PENDING' | 'FINISHED' | 'REJECTED';
				created_at: Date;
				updated_at: Date | null;
			}[]
		>`
			select id, team_number as team, primary_hex, secondary_hex, status, created_at, updated_at from color_submissions`,
	]);

	const writeTable = async (table: string, rows: object[]) => {
		await writeFile(
			resolve(outputDirectory, `${table}.jsonl`),
			`${rows.map((row) => JSON.stringify(row)).join('\n')}\n`,
			{
				mode: 0o600,
			},
		);
		console.log(`${table}: ${rows.length} rows`);
	};

	await Promise.all([
		writeTable(
			'teamColors',
			teamColors.map((row) => ({
				team: row.team,
				primaryHex: row.primary_hex.toLowerCase(),
				secondaryHex: row.secondary_hex.toLowerCase(),
				verified: row.verified,
				createdAt: row.created_at.getTime(),
				...(row.updated_at ? { updatedAt: row.updated_at.getTime() } : {}),
			})),
		),
		writeTable(
			'verificationRequests',
			verificationRequests.map((row) => ({
				id: row.id,
				team: row.team,
				status: row.status,
				createdAt: row.created_at.getTime(),
				...(row.updated_at ? { updatedAt: row.updated_at.getTime() } : {}),
			})),
		),
		writeTable(
			'colorSubmissions',
			colorSubmissions.map((row) => ({
				id: row.id,
				team: row.team,
				primaryHex: row.primary_hex.toLowerCase(),
				secondaryHex: row.secondary_hex.toLowerCase(),
				status: row.status,
				createdAt: row.created_at.getTime(),
				...(row.updated_at ? { updatedAt: row.updated_at.getTime() } : {}),
			})),
		),
	]);
	console.log(`Exported to ${outputDirectory}`);
} finally {
	await sql.end();
}
