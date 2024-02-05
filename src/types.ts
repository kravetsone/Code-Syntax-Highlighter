import { EventHandler } from "@create-figma-plugin/utilities";
import { BundledLanguage, BundledTheme, TokensResult } from "shiki/types.mjs";

export interface InsertCodeHandler extends EventHandler {
	name: "UPDATE_CODE";
	handler: (
		code: TokensResult,
		text: string,
		theme: BundledTheme,
		language: BundledLanguage,
	) => void;
}
