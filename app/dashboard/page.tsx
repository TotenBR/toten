import { fotos, videos, arquivos } from '@/lib/content'
import { ImageIcon, VideoIcon, FileIcon, ArrowRightIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Biblioteca de Conteúdo</h1>
        <p className="text-muted-foreground mt-1">
          Acesse fotos, vídeos e arquivos disponíveis para download.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <ImageIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{fotos.length}</p>
            <p className="text-sm text-muted-foreground">Fotos</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
            <VideoIcon className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{videos.length}</p>
            <p className="text-sm text-muted-foreground">Vídeos</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
            <FileIcon className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{arquivos.length}</p>
            <p className="text-sm text-muted-foreground">Arquivos</p>
          </div>
        </Card>
      </div>

      {/* Quick access */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/fotos">
          <Card className="p-6 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-blue-500" />
              </div>
              <ArrowRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-semibold">Fotos</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {fotos.length} imagens disponíveis
            </p>
            {/* Preview grid */}
            <div className="grid grid-cols-3 gap-1 mt-4">
              {fotos.slice(0, 3).map((foto) => (
                <div
                  key={foto.id}
                  className="aspect-square rounded-md bg-muted overflow-hidden"
                >
                  <img
                    src={foto.thumbnail ?? foto.url}
                    alt={foto.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/videos">
          <Card className="p-6 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <VideoIcon className="h-5 w-5 text-purple-500" />
              </div>
              <ArrowRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-semibold">Vídeos</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {videos.length} vídeos disponíveis
            </p>
            <div className="mt-4 space-y-2">
              {videos.slice(0, 2).map((video) => (
                <div
                  key={video.id}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <VideoIcon className="h-3 w-3 shrink-0" />
                  <span className="truncate">{video.title}</span>
                </div>
              ))}
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/arquivos">
          <Card className="p-6 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <FileIcon className="h-5 w-5 text-emerald-500" />
              </div>
              <ArrowRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-semibold">Arquivos</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {arquivos.length} arquivos para download
            </p>
            <div className="mt-4 space-y-2">
              {arquivos.slice(0, 2).map((arquivo) => (
                <div
                  key={arquivo.id}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <FileIcon className="h-3 w-3 shrink-0" />
                  <span className="truncate">{arquivo.title}</span>
                </div>
              ))}
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}
