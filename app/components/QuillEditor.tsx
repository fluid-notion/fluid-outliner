import React from "react";
import ReactQuill from "react-quill";

export interface IQuillEditorProps extends ReactQuill.ComponentProps {
    forwardedRef: React.Ref<ReactQuill>
}

export const QuillEditor = ({forwardedRef, ...props}: IQuillEditorProps) => (
    <ReactQuill {...props} ref={forwardedRef} />
);
