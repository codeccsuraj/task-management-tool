import React, { useEffect, useMemo } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { createTextExtension } from './exension';
import EditorToolbar from './EditorToolbar';

const defaultToolbar = [
    'bold',
    'italic',
    'underline',
    'strike',
    'divider',
    'bulletList',
    'orderedList',
    'divider',
    'blockquote',
    'code',
    'link',
    'divider',
    'undo',
    'redo',
];

const TextEditor = ({
    value = '',
    onChange,
    onPendingImagesChange,

    onFocus,
    onBlur,

    placeholder = 'Start writing...',
    toolbar = defaultToolbar,

    editable = true,

    minHeight = 180,
    maxHeight = 450,

    extensions: extensionOptions = {},
    className = '',
}) => {

    const handleImagePaste = (editor, files) => {
        if (!editable) return;

        const imageFiles = Array.from(files).filter((file) =>
            file.type.startsWith('image/')
        );

        if (!imageFiles.length) return;

        const pendingImages = imageFiles.map((file) => ({
            id: crypto.randomUUID(),
            file,
            previewUrl: URL.createObjectURL(file),
        }));

        onPendingImagesChange?.(pendingImages);

        const imageContent = pendingImages.map((image) => ({
            type: 'image',
            attrs: {
                src: image.previewUrl,
                alt: image.file.name,
                pendingId: image.id,
            },
        }));

        editor.chain().focus().insertContent(imageContent).run();
    };

    const handleImageDrop = (editor, files, position) => {
        if (!editable) return;

        const imageFiles = Array.from(files).filter((file) =>
            file.type.startsWith('image/')
        );

        if (!imageFiles.length) return;

        const pendingImages = imageFiles.map((file) => ({
            id: crypto.randomUUID(),
            file,
            previewUrl: URL.createObjectURL(file),
        }));

        onPendingImagesChange?.(pendingImages);

        const imageContent = pendingImages.map((image) => ({
            type: 'image',
            attrs: {
                src: image.previewUrl,
                alt: image.file.name,
                pendingId: image.id,
            },
        }));

        editor.commands.insertContentAt(position, imageContent);
    };

    const extensions = useMemo(
        () =>
            createTextExtension({
                ...extensionOptions,
                onImagePaste: handleImagePaste,
                onImageDrop: handleImageDrop,
            }),
        [extensionOptions, editable, onPendingImagesChange]
    );

    const editor = useEditor({
        extensions,
        content: value || '',
        editable,

        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },

        editorProps: {
            attributes: {
                class: 'rich-text-content',
                'data-placeholder': placeholder,
            },

            handleDOMEvents: {
                focus: (view, event) => {
                    onFocus?.(event);
                    return false;
                },

                blur: (view, event) => {
                    onBlur?.(event);
                    return false;
                },
            },
        },
    });

    useEffect(() => {
        if (!editor) return;

        const currentContent = editor.getHTML();
        const newContent = value || '';

        if (currentContent !== newContent) {
            editor.commands.setContent(newContent, {
                emitUpdate: false,
            });
        }
    }, [editor, value]);

    useEffect(() => {
        editor?.setEditable(editable);
    }, [editor, editable]);

    if (!editor) return null;

    return (
        <div
            className={`rich-text-editor ${
                !editable ? 'rich-text-readonly' : ''
            } ${className}`}
            style={{
                '--editor-min-height': `${minHeight}px`,
                '--editor-max-height': `${maxHeight}px`,
            }}
        >
            {toolbar.length > 0 && (
                <EditorToolbar
                    editor={editor}
                    items={toolbar}
                    disabled={!editable}
                />
            )}

            <EditorContent editor={editor} />
        </div>
    );
};

export default TextEditor;