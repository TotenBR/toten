import { videos } from '@/lib/content'
import { DownloadIcon, PlayIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function VideosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vídeos</h1>
        <p className="text-muted-foreground mt-1">
          {videos.length} vídeos disponíveis
        </p>
      </div>

      {videos.length === 0 ? (
        <Card className="p-12 text-center">
          <PlayIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum vídeo disponível no momento.</p>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden group">
              {/* Thumbnail / Player */}
              <div className="relative aspect-video bg-muted">
                {video.url.endsWith('.mp4') || video.url.endsWith('.webm') || video.url.endsWith('.mov') ? (
                  <video
                    src={video.url}
                    controls
                    poster={video.thumbnail}
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PlayIcon className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold truncate">{video.title}</h3>
                {video.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {video.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3">
                  {video.size && (
                    <span className="text-xs text-muted-foreground">{video.size}</span>
                  )}
                  <a
                    href={video.url}
                    download
                    className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline ml-auto"
                  >
                    <DownloadIcon className="h-3.5 w-3.5" />
                    Baixar
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
