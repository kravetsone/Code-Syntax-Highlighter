import {
	Button,
	Container,
	TextboxMultiline,
	VerticalSpace,
	render,
	useInitialFocus,
} from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback, useState } from "preact/hooks";
import { codeToTokens } from "shiki";
import { InsertCodeHandler } from "./types";

function Plugin(props: { text: string }) {
	console.log(props.text);
	const [text, setText] = useState("");
	const handleUpdateButtonClick = useCallback(async () => {
		const tokens = await codeToTokens(text, {
			lang: "javascript",
			theme: "vitesse-dark",
		});
		emit<InsertCodeHandler>("UPDATE_CODE", tokens);
		console.log(tokens);
	}, [text]);

	return (
		<Container space="medium">
			<VerticalSpace space="large" />
			<TextboxMultiline
				{...useInitialFocus()}
				onValueInput={setText}
				value={text}
				variant="border"
			/>
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
			<div dangerouslySetInnerHTML={{ __html: text }} />
			<VerticalSpace space="large" />
			<Button fullWidth onClick={handleUpdateButtonClick}>
				Update Text
			</Button>
			<VerticalSpace space="small" />
		</Container>
	);
}

export default render(Plugin);
