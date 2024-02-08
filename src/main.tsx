/** @jsx figma.widget.h */

import { once, showUI } from "@create-figma-plugin/utilities";
import { BundledLanguage, BundledTheme, TokensResult } from "shiki/types.mjs";
import { InsertCodeHandler } from "./types";

const { widget } = figma;
const { AutoLayout, Text, Span, useSyncedState, usePropertyMenu, Frame } =
	widget;

export default function () {
	widget.register(SyntaxHighlighter);
}

function SyntaxHighlighter() {
	const [tokens, setTokens] = useSyncedState<TokensResult>("tokens", {
		tokens: [],
	});
	const [text, setText] = useSyncedState("text", "");
	const [language, setLanguage] = useSyncedState<BundledLanguage>(
		"language",
		"typescript",
	);
	const [theme, setTheme] = useSyncedState<BundledTheme>(
		"theme",
		"vitesse-dark",
	);

	async function onChange({
		propertyName,
	}: WidgetPropertyEvent): Promise<void> {
		await new Promise<void>((resolve) => {
			if (propertyName === "edit") {
				showUI({ height: 500, width: 500 }, { text, theme, language });
				once<InsertCodeHandler>(
					"UPDATE_CODE",
					(tokens, text, theme, language) => {
						setTokens(tokens);
						setText(text);
						setTheme(theme);
						setLanguage(language);

						resolve();
					},
				);
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
