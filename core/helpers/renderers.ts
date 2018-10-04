import { renderMarkdown } from "./render-markdown";

export const getRendererForFormat = (format: string) => {
    if (format === 'markdown') {
        return renderMarkdown;
    }
    return null
}
