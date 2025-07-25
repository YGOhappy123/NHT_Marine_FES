import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { twMerge } from 'tailwind-merge'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import RichTextMenubar from '@/components/common/RichTextMenubar'

type RichTextEditorProps = {
    content: string
    onChange: (value: string) => void
    disabled?: boolean
    containerClassName?: string
    editorClassName?: string
}

const RichTextEditor = ({
    content,
    onChange,
    disabled = false,
    containerClassName,
    editorClassName
}: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc ml-3'
                    }
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal ml-3'
                    }
                }
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph']
            })
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editable: !disabled,
        editorProps: {
            attributes: {
                class: twMerge(
                    'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent p-3 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium md:text-sm',
                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                    'min-h-[100px]',
                    disabled ? 'select-none' : '',
                    containerClassName
                )
            }
        }
    })

    useEffect(() => {
        if (editor) {
            editor.setEditable(!disabled)
        }
    }, [disabled, editor])

    return (
        <div>
            <RichTextMenubar editor={editor} disabled={disabled} />
            <EditorContent
                editor={editor}
                spellCheck="false"
                className={twMerge(
                    disabled ? 'pointer-events-none cursor-not-allowed opacity-50' : '',
                    editorClassName
                )}
            />
        </div>
    )
}

export default RichTextEditor
