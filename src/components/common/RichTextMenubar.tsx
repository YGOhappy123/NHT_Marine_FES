import { Editor } from '@tiptap/react'
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Heading1,
    Heading2,
    Heading3,
    Italic,
    List,
    ListOrdered,
    Strikethrough
} from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'

type RichTextMenubarProps = {
    editor: Editor | null
    disabled?: boolean
}

const RichTextMenubar = ({ editor, disabled = false }: RichTextMenubarProps) => {
    if (!editor) return null

    const Options = [
        {
            icon: <Heading1 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            pressed: editor.isActive('heading', { level: 1 })
        },
        {
            icon: <Heading2 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            pressed: editor.isActive('heading', { level: 2 })
        },
        {
            icon: <Heading3 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            pressed: editor.isActive('heading', { level: 3 })
        },
        {
            icon: <Bold className="size-4" />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            pressed: editor.isActive('bold')
        },
        {
            icon: <Italic className="size-4" />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            pressed: editor.isActive('italic')
        },
        {
            icon: <Strikethrough className="size-4" />,
            onClick: () => editor.chain().focus().toggleStrike().run(),
            pressed: editor.isActive('strike')
        },
        {
            icon: <AlignLeft className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign('left').run(),
            pressed: editor.isActive({ textAlign: 'left' })
        },
        {
            icon: <AlignCenter className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign('center').run(),
            pressed: editor.isActive({ textAlign: 'center' })
        },
        {
            icon: <AlignRight className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign('right').run(),
            pressed: editor.isActive({ textAlign: 'right' })
        },
        {
            icon: <List className="size-4" />,
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            pressed: editor.isActive('bulletList')
        },
        {
            icon: <ListOrdered className="size-4" />,
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            pressed: editor.isActive('orderedList')
        }
    ]

    return (
        <div className="z-50 mb-2 space-x-2 rounded border p-1">
            {Options.map((option, index) => (
                <Toggle
                    key={index}
                    pressed={option.pressed}
                    onPressedChange={() => {
                        if (!disabled) option.onClick()
                    }}
                    disabled={disabled}
                >
                    {option.icon}
                </Toggle>
            ))}
        </div>
    )
}

export default RichTextMenubar
