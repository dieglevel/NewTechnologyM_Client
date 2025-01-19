import { colors } from "@/constants";
import * as React from "react";
import Svg, { Path } from "react-native-svg";

export const Search = ({ color = "#7C87FF", size = 25, outline = "#7C87FF" }) => (
	<Svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
	>
		<Path
			d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
			stroke={outline}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<Path
			d="M22 22L20 20"
			stroke={outline}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</Svg>
);
