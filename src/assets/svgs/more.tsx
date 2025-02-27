import { colors } from "@/constants";
import * as React from "react";
import Svg, { Path } from "react-native-svg";

export const More = ({ color = "#7C87FF", size = 25, outline = "#7C87FF" }) => (
	<Svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
	>
		<Path
			d="M12 13C11.44 13 11 12.55 11 12C11 11.45 11.45 11 12 11C12.55 11 13 11.45 13 12C13 12.55 12.56 13 12 13Z"
			fill={color}
		/>
		<Path
			d="M16 13C15.44 13 15 12.55 15 12C15 11.45 15.45 11 16 11C16.55 11 17 11.45 17 12C17 12.55 16.56 13 16 13Z"
			fill={color}
		/>
		<Path
			d="M8 13C7.44 13 7 12.55 7 12C7 11.45 7.45 11 8 11C8.55 11 9 11.45 9 12C9 12.55 8.56 13 8 13Z"
			fill={color}
		/>
	</Svg>
);
