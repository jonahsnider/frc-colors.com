import { HexColorCode } from '../dtos/hex-color-code.dto';

export interface TeamColors {
	primary: HexColorCode;
	secondary: HexColorCode;
	verified: boolean;
}
