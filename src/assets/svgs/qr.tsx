import { colors } from "@/constants";
import * as React from "react";
import Svg, { Path } from "react-native-svg";

export const Qr = ({ color = "#7C87FF", size = 25, outline = "#7C87FF" }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
  >
    <Path
      d="M336 448h56a56 56 0 0 0 56-56v-56M448 176v-56a56 56 0 0 0-56-56h-56M176 448h-56a56 56 0 0 1-56-56v-56M64 176v-56a56 56 0 0 1 56-56h56"

		fill={"none"}
		stroke={color}
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={16}

    />
  </Svg>
);
