import { colors } from "@/constants";
import * as React from "react";
import Svg, { Path } from "react-native-svg";

export const Message = ({ color = "#7C87FF", size = 23, outline = "#7C87FF" }) => (
	<Svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
	>
		<Path
			d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z"
			stroke={outline}
			stroke-width="1.5"
			stroke-miterlimit="10"
			stroke-linecap="round"
			stroke-linejoin="round"
            fill={color}
		/>
		<Path
			d="M7 8H17"
			stroke={outline}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
            fill={color}
		/>
		<Path
			d="M7 13H13"
			stroke={outline}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</Svg>
);
