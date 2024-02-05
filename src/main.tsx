/** @jsx figma.widget.h */

import { once, showUI } from "@create-figma-plugin/utilities";
import { TokensResult } from "shiki/types.mjs";
import { InsertCodeHandler } from "./types";

const { widget } = figma;
const { AutoLayout, Text, Span, useSyncedState, usePropertyMenu, Frame } =
	widget;

export default function () {
	widget.register(Notepad);
}

function Notepad() {
	const [tokens, setTokens] = useSyncedState<TokensResult>("tokens", {
		tokens: [],
	});
	const [text, setText] = useSyncedState("text", "");

	async function onChange({
		propertyName,
	}: WidgetPropertyEvent): Promise<void> {
		await new Promise<void>((resolve: () => void): void => {
			if (propertyName === "edit") {
				showUI({ height: 500, width: 500 }, { text: text });
				once<InsertCodeHandler>("UPDATE_CODE", (tokens, text) => {
					setTokens(tokens);
					setText(text);

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
		<AutoLayout direction="vertical">
			{tokens.tokens.map((row) => (
				<Text fontSize={12}>
					{row.map((token) => (
						<Span fill={token.color}>{token.content}</Span>
					))}
				</Text>
			))}
		</AutoLayout>
	);
}
