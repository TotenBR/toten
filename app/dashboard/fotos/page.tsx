'use client'

import { fotos } from '@/lib/content'
import { useState } from 'react'
import { XIcon, DownloadIcon, ZoomInIcon } from 'lucide-react'

export default function FotosPage() {
  const [selected, setSelected] = useState<(typeof fotos)[0] | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fotos</h1>
        <p className="text-muted-foreground mt-1">
          {fotos.length} imagens disponíveis
        </p>
      </div>

      {/* Grid de fotos */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {fotos.map((foto) => (
          <div
            key={foto.id}
            className="group relative aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer border border-border hover:border-primary/50 transition-all hover:shadow-lg"
            onClick={() => setSelected(foto)}
          >
            <img
              src={foto.thumbnail ?? foto.url}
              alt={foto.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
              <ZoomInIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm font-medium truncate">{foto.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selected.url}
              alt={selected.title}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <a
                href={selected.url}
                download
                className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <DownloadIcon className="h-4 w-4 text-white" />
              </a>
              <button
                onClick={() => setSelected(null)}
                className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
              >
                <XIcon className="h-4 w-4 text-white" />
              </button>
            </div>
            <div className="mt-3">
              <p className="text-white font-semibold">{selected.title}</p>
              {selected.description && (
                <p className="text-white/60 text-sm mt-1">{selected.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
