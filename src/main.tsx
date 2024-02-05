/** @jsx figma.widget.h */

import { once, showUI } from "@create-figma-plugin/utilities";
import { TokensResult } from "shiki/types.mjs";
import { InsertCodeHandler } from "./types";

const { widget } = figma;
const { AutoLayout, Text, useSyncedState, usePropertyMenu, Frame } = widget;

export default function () {
	widget.register(Notepad);
}

function Notepad() {
	const [tokens, setTokens] = useSyncedState<TokensResult>("text", {
		tokens: [],
	});

	async function onChange({
		propertyName,
	}: WidgetPropertyEvent): Promise<void> {
		await new Promise<void>((resolve: () => void): void => {
			if (propertyName === "edit") {
				showUI({ height: 500, width: 500 }, { text: tokens });
				once<InsertCodeHandler>("UPDATE_CODE", (tokens) => {
					setTokens(tokens);
					resolve();
				});
			}
		});
	}
	usePropertyMenu(
		[
			{
				itemType: "action",
				propertyName: "edit",
				tooltip: "Edit",
			},
		],
		onChange,
	);
	console.log("client", tokens);
	return (
		<Frame width={500} height={500}>
			{tokens.tokens.flatMap((row) =>
				row.map((token, index) => (
					<Text
						key={token.offset}
						fontSize={12}
						fill={token.color}
						x={token.offset}
					>
						{token.content}
					</Text>
				)),
			)}
		</Frame>
	);
}
