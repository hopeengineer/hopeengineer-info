'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { 
  Bold, Italic, Link as LinkIcon, 
  ImageIcon, Youtube as YoutubeIcon, Heading1, Heading2, 
  Quote, List
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [youtubeOpen, setYoutubeOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        // Disable Link from StarterKit — we use the separate @tiptap/extension-link to avoid duplicates
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary hover:text-primary/80 underline decoration-primary/50 underline-offset-4',
        },
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: 'rounded-xl mx-auto max-w-full my-8 shadow-lg border border-white/10',
        },
      }),
      Youtube.configure({
        inline: false,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-xl my-8 border border-white/10 shadow-lg',
        },
      }),
      Placeholder.configure({
        placeholder: 'Write your story...',
        emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-white/30 before:float-left before:pointer-events-none',
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-lg max-w-none font-body prose-headings:font-headline prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-8 prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-6 prose-blockquote:border-l-primary prose-blockquote:bg-white/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1 focus:outline-none min-h-[300px]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor || !isMounted) {
    return (
      <div className="p-8 text-center text-white/30 font-code">Loading editor...</div>
    );
  }

  return (
    <div className="relative border border-white/10 rounded-xl overflow-hidden bg-background/50 backdrop-blur-sm">
      
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-background/80 backdrop-blur-md">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn('h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground', editor.isActive('heading', { level: 1 }) && 'bg-white/10 text-primary')}
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn('h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground', editor.isActive('heading', { level: 2 }) && 'bg-white/10 text-primary')}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        
        <div className="w-px h-4 bg-white/10 mx-1" />
        
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn('h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground', editor.isActive('bold') && 'bg-white/10 text-primary')}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn('h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground', editor.isActive('italic') && 'bg-white/10 text-primary')}
        >
          <Italic className="w-4 h-4" />
        </button>

        {/* Link Popover */}
        <Popover open={linkOpen} onOpenChange={setLinkOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn('h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground', editor.isActive('link') && 'bg-white/10 text-primary')}
            >
              <LinkIcon className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 border-white/10 bg-black/90 p-3" align="start" sideOffset={8}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const url = new FormData(e.currentTarget).get('url') as string;
                if (!url) {
                  editor.chain().focus().extendMarkRange('link').unsetLink().run();
                } else {
                  editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                }
                setLinkOpen(false);
              }}
              className="flex gap-2"
            >
              <Input
                name="url"
                defaultValue={editor.getAttributes('link').href || ''}
                placeholder="https://example.com"
                className="h-8 bg-black/50 border-white/20"
                autoFocus
              />
              <button type="submit" className="h-8 px-3 rounded-md bg-white text-black text-sm font-medium hover:bg-white/90">
                Save
              </button>
            </form>
          </PopoverContent>
        </Popover>
        
        <div className="w-px h-4 bg-white/10 mx-1" />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn('h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground', editor.isActive('bulletList') && 'bg-white/10 text-primary')}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn('h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground', editor.isActive('blockquote') && 'bg-white/10 text-primary')}
        >
          <Quote className="w-4 h-4" />
        </button>
        
        <div className="flex-1" />
        
        {/* Image Popover */}
        <Popover open={imageOpen} onOpenChange={setImageOpen}>
          <PopoverTrigger asChild>
            <button type="button" className="h-8 px-3 gap-2 inline-flex items-center rounded-md text-sm text-white/70 hover:text-white hover:bg-accent transition-colors">
              <ImageIcon className="w-4 h-4" /> <span className="hidden sm:inline">Image</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 border-white/10 bg-black/90 p-4" align="end" sideOffset={8}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                const url = data.get('url') as string;
                const alt = data.get('alt') as string;
                if (url && alt) {
                  editor.chain().focus().setImage({ src: url, alt }).run();
                  setImageOpen(false);
                }
              }}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label className="text-xs text-white/70">Image URL</label>
                <Input name="url" placeholder="https://" className="h-8 bg-black/50 border-white/20" autoFocus required />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/70">Alt Text (Required for SEO)</label>
                <Input name="alt" placeholder="Description of image..." className="h-8 bg-black/50 border-white/20" required />
              </div>
              <button type="submit" className="w-full h-8 rounded-md bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors">
                Insert Image
              </button>
            </form>
          </PopoverContent>
        </Popover>

        {/* YouTube Popover */}
        <Popover open={youtubeOpen} onOpenChange={setYoutubeOpen}>
          <PopoverTrigger asChild>
            <button type="button" className="h-8 px-3 gap-2 inline-flex items-center rounded-md text-sm text-white/70 hover:text-white hover:bg-accent transition-colors">
              <YoutubeIcon className="w-4 h-4" /> <span className="hidden sm:inline">Video</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 border-white/10 bg-black/90 p-3" align="end" sideOffset={8}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const url = new FormData(e.currentTarget).get('url') as string;
                if (url) {
                  editor.chain().focus().setYoutubeVideo({ src: url }).run();
                  setYoutubeOpen(false);
                }
              }}
              className="flex gap-2 w-full"
            >
              <Input
                name="url"
                placeholder="https://youtube.com/watch?v=..."
                className="h-8 flex-1 bg-black/50 border-white/20"
                autoFocus
                required
              />
              <button type="submit" className="h-8 px-4 rounded-md bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors">
                Insert
              </button>
            </form>
          </PopoverContent>
        </Popover>
      </div>

      <div className="p-4 sm:p-8 min-h-[500px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
