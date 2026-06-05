import { arquivos, getFileIcon } from '@/lib/content'
import { DownloadIcon, FileIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function ArquivosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Arquivos</h1>
        <p className="text-muted-foreground mt-1">
          {arquivos.length} arquivos disponíveis para download
        </p>
      </div>

      {arquivos.length === 0 ? (
        <Card className="p-12 text-center">
          <FileIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum arquivo disponível no momento.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {arquivos.map((arquivo) => {
            const icon = getFileIcon(arquivo.url)
            return (
              <Card
                key={arquivo.id}
                className="p-4 flex items-center gap-4 hover:border-primary/50 transition-colors group"
              >
                {/* Ícone */}
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0">
                  {icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{arquivo.title}</p>
                  {arquivo.description && (
                    <p className="text-sm text-muted-foreground truncate">
                      {arquivo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1">
                    {arquivo.size && (
                      <span className="text-xs text-muted-foreground">
                        {arquivo.size}
                      </span>
                    )}
                    {arquivo.date && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(arquivo.date).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Botão de download */}
                <a
                  href={arquivo.url}
                  download
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-sm font-medium transition-colors shrink-0"
                >
                  <DownloadIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Baixar</span>
                </a>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
