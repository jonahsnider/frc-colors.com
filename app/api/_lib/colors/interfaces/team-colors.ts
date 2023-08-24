import { HexColorCodeSchema } from '../dtos/hex-color-code.dto';

export interface TeamColors {
	primary: HexColorCodeSchema;
	secondary: HexColorCodeSchema;
	verified: boolean;
}
