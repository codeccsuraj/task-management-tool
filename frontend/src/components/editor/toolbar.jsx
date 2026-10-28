import {
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
    StrikethroughOutlined,
    OrderedListOutlined,
    UnorderedListOutlined,
    LinkOutlined,
    UndoOutlined,
    RedoOutlined,
    CodeOutlined,
    AlertOutlined,
} from '@ant-design/icons'

export const toolbarConfig = {
    bold: {
        title: 'Bold',
        icon: <BoldOutlined />,
        isActive: (editor) => editor.isActive('bold'),
        command: (editor) =>
            editor.chain().focus().toggleBold().run(),
    },
    italic: {
        title: 'Italic',
        icon: <ItalicOutlined />,
        isActive: (editor) => editor.isActive('italic'),
        command: (editor) =>
            editor.chain().focus().toggleItalic().run(),
    },

    underline: {
        title: 'Underline',
        icon: <UnderlineOutlined />,
        isActive: (editor) => editor.isActive('underline'),
        command: (editor) =>
            editor.chain().focus().toggleUnderline().run(),
    },

    strike: {
        title: 'Strikethrough',
        icon: <StrikethroughOutlined />,
        isActive: (editor) => editor.isActive('strike'),
        command: (editor) =>
            editor.chain().focus().toggleStrike().run(),
    },

    bulletList: {
        title: 'Bullet list',
        icon: <UnorderedListOutlined />,
        isActive: (editor) => editor.isActive('bulletList'),
        command: (editor) =>
            editor.chain().focus().toggleBulletList().run(),
    },

    orderedList: {
        title: 'Numbered list',
        icon: <OrderedListOutlined />,
        isActive: (editor) => editor.isActive('orderedList'),
        command: (editor) =>
            editor.chain().focus().toggleOrderedList().run(),
    },
    blockquote: {
        title: 'Blockquote',
        icon: <AlertOutlined />,
        isActive: (editor) => editor.isActive('blockquote'),
        command: (editor) =>
            editor.chain().focus().toggleBlockquote().run(),
    },
    code: {
        title: 'Inline code',
        icon: <CodeOutlined />,
        isActive: (editor) => editor.isActive('code'),
        command: (editor) =>
            editor.chain().focus().toggleCode().run(),
    },
    link: {
        title: 'Link',
        icon: <LinkOutlined />,
        isActive: (editor) => editor.isActive('link'),
        command: (editor) => {
            if (editor.isActive('link')) {
                editor.chain().focus().unsetLink().run()
                return
            }

            const url = window.prompt('Enter URL')

            if (url) {
                editor.chain().focus()
                    .extendMarkRange('link')
                    .setLink({ href: url })
                    .run()
            }
        },
    },
    undo: {
        title: 'Undo',
        icon: <UndoOutlined />,
        command: (editor) =>
            editor.chain().focus().undo().run(),
        disabled: (editor) => !editor.can().undo(),
    },
    redo: {
        title: 'Redo',
        icon: <RedoOutlined />,
        command: (editor) =>
            editor.chain().focus().redo().run(),
        disabled: (editor) => !editor.can().redo(),
    },
}