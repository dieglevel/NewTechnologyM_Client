import { colors } from "@/constants";
import * as React from "react";
import Svg, { Path } from "react-native-svg";

export const Qr = ({ color = "#7C87FF", size = 25, outline = "#7C87FF" }) => (
	<Svg
		width={size}
		height={size}
		preserveAspectRatio="xMinYMin"
		viewBox="-2 -2 24 24"
		fill={color}
	>
		<Path d="M13 18h3a2 2 0 0 0 2-2v-3a1 1 0 0 1 2 0v3a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4v-3a1 1 0 0 1 2 0v3a2 2 0 0 0 2 2h3a1 1 0 0 1 0 2h6a1 1 0 0 1 0-2zM2 7a1 1 0 1 1-2 0V4a4 4 0 0 1 4-4h3a1 1 0 1 1 0 2H4a2 2 0 0 0-2 2v3zm16 0V4a2 2 0 0 0-2-2h-3a1 1 0 0 1 0-2h3a4 4 0 0 1 4 4v3a1 1 0 0 1-2 0z" />
	</Svg>
);
