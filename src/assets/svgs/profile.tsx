import { colors } from "@/constants";
import * as React from "react";
import Svg, { Path } from "react-native-svg";

export const Profile = ({ color = "#7C87FF", size = 23, outline = "#7C87FF" }) => (
	<Svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
	>
		<Path
			d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
			stroke={outline}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			fill={color}
		/>
		<Path
			d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26003 15 3.41003 18.13 3.41003 22"
			stroke={outline}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			fill={color}
		/>
	</Svg>
);
