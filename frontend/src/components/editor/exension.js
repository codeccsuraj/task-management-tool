import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import FileHandler from '@tiptap/extension-file-handler'

const TicketImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            pendingId: {
                default: null,

                parseHTML: (element) =>
                    element.getAttribute('data-pending-id'),

                renderHTML: (attributes) => {
                    if (!attributes.pendingId) {
                        return {};
                    }

                    return {
                        'data-pending-id': attributes.pendingId,
                    };
                },
            }
        }
    }
})

/**
 * Creates reusable Tiptap extensions.
 *
 * onImagePaste and onImageDrop are callbacks supplied by TextEditor.
 * They allow TextEditor to manage pending image files in React state.
 */

export const createTextExtension = ({
    heading = true,
    lists = true,
    blockquote = true,
    code = true,
    link = true,
    underline = true,
    images = true,
    onImagePaste,
    onImageDrop,
} = {}) => {
    return [
        StarterKit.configure({
            heading: heading ? { levels: [2, 3, 4] } : false,
            bulletList: lists ? {} : false,
            orderedList: lists ? {} : false,
            blockquote: blockquote ? {} : false,
            code: code ? {} : false,
            codeBlock: code ? {} : false,
            link: false,
            underline: false,
        }),

        ...(underline ? [Underline] : []),

        ...(link ? [
            Link.configure({
                openOnClick: false,
                autolink: true,
                HTMLAttributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
            }),
        ] : []),

        ...(images
            ? [
                TicketImage.configure({
                    inline: false,
                    allowBase64: true,
                    HTMLAttributes: {
                        style: 'max-width: 100%; height: auto; max-height : 20vh; object-fit: contain;',
                    },
                }),

                FileHandler.configure({
                    allowedMimeTypes: [
                        'image/jpeg',
                        'image/png',
                        'image/gif',
                        'image/webp',
                    ],

                    onPaste: (editor, files) => {
                        onImagePaste?.(editor, files);
                    },

                    onDrop: (editor, files, position) => {
                        onImageDrop?.(editor, files, position);
                    },
                }),
            ]
            : []),
    ]
}