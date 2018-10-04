import marked from "marked"

marked.setOptions({
    gfm: true,
    tables: true,
    breaks: false,
    sanitize: true,
})

export const renderMarkdown = async (input: string) => marked(input)
