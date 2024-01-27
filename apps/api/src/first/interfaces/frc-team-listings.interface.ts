type FrcTeamListing = {
	schoolName: string;
	website: string;
	// biome-ignore lint/style/useNamingConvention: This is an API response
	homeCMP: string;
	teamNumber: number;
	nameFull: string;
	nameShort: string;
	city: string;
	stateProv: string;
	country: string;
	rookieYear: number;
	robotName: string;
	districtCode: null;
};

export type FrcTeamListings = {
	teams: FrcTeamListing[];
	teamCountTotal: number;
	teamCountPage: number;
	pageCurrent: number;
	pageTotal: number;
};
