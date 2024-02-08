import {
	Button,
	Container,
	TextboxAutocomplete,
	TextboxMultiline,
	VerticalSpace,
	render,
	useInitialFocus,
} from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback, useState } from "preact/hooks";
import {
	BundledLanguage,
	BundledTheme,
	bundledLanguages,
	bundledThemes,
	codeToTokens,
} from "shiki";
import { InsertCodeHandler } from "./types";

function Plugin(props: {
	text: string;
	theme: BundledTheme;
	language: BundledLanguage;
}) {
	const [text, setText] = useState(props.text);
	const [language, setLanguage] = useState<BundledLanguage>(props.language);
	const [theme, setTheme] = useState<BundledTheme>(props.theme);

	const languages = Object.keys(bundledLanguages);
	const themes = Object.keys(bundledThemes);

	const handleUpdateButtonClick = useCallback(async () => {
		const tokens = await codeToTokens(text, {
			lang: language,
			theme: theme,
		});
		emit<InsertCodeHandler>("UPDATE_CODE", tokens, text, theme, language);
		console.log(tokens);
	}, [text]);

	return (
		<Container space="medium">
			<VerticalSpace space="large" />
			<TextboxAutocomplete
				options={languages.map((x) => ({ value: x }))}
				onValueInput={(value) => setLanguage(value as BundledLanguage)}
				value={language}
				strict
			/>
			<TextboxAutocomplete
				options={themes.map((x) => ({ value: x }))}
				onValueInput={(value) => setTheme(value as BundledTheme)}
				value={theme}
				strict
			/>
			<TextboxMultiline
				{...useInitialFocus()}
				onValueInput={setText}
				value={text}
				variant="border"
			/>
			<VerticalSpace space="large" />
			<Button fullWidth onClick={handleUpdateButtonClick}>
				Update Text
			</Button>
			<VerticalSpace space="small" />
		</Container>
	);
}

export default render(Plugin);
