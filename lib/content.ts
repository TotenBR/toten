// Configuração de conteúdo da biblioteca
// Para adicionar conteúdo: coloque os arquivos em /public/content/
// e adicione as entradas abaixo.

export type ContentItem = {
  id: string
  title: string
  description?: string
  url: string
  thumbnail?: string
  size?: string
  date?: string
}

export const fotos: ContentItem[] = [
  {
    id: 'foto-1',
    title: 'Imagem de exemplo 1',
    description: 'Descrição da imagem',
    url: '/placeholder.jpg',
    thumbnail: '/placeholder.jpg',
    date: '2024-01-01',
  },
  {
    id: 'foto-2',
    title: 'Imagem de exemplo 2',
    description: 'Descrição da imagem',
    url: '/placeholder.jpg',
    thumbnail: '/placeholder.jpg',
    date: '2024-01-02',
  },
  {
    id: 'foto-3',
    title: 'Imagem de exemplo 3',
    description: 'Descrição da imagem',
    url: '/placeholder.jpg',
    thumbnail: '/placeholder.jpg',
    date: '2024-01-03',
  },
  {
    id: 'foto-4',
    title: 'Imagem de exemplo 4',
    url: '/placeholder.jpg',
    thumbnail: '/placeholder.jpg',
    date: '2024-01-04',
  },
  {
    id: 'foto-5',
    title: 'Imagem de exemplo 5',
    url: '/placeholder.jpg',
    thumbnail: '/placeholder.jpg',
    date: '2024-01-05',
  },
  {
    id: 'foto-6',
    title: 'Imagem de exemplo 6',
    url: '/placeholder.jpg',
    thumbnail: '/placeholder.jpg',
    date: '2024-01-06',
  },
]

export const videos: ContentItem[] = [
  {
    id: 'video-1',
    title: 'Vídeo de exemplo 1',
    description: 'Descrição do vídeo',
    url: '/content/videos/exemplo.mp4',
    thumbnail: '/placeholder.jpg',
    size: '12 MB',
    date: '2024-01-01',
  },
]

export const arquivos: ContentItem[] = [
  {
    id: 'arquivo-1',
    title: 'Documento PDF de exemplo',
    description: 'Arquivo para download',
    url: '/content/arquivos/exemplo.pdf',
    size: '2.4 MB',
    date: '2024-01-01',
  },
  {
    id: 'arquivo-2',
    title: 'Planilha Excel de exemplo',
    description: 'Arquivo para download',
    url: '/content/arquivos/exemplo.xlsx',
    size: '1.1 MB',
    date: '2024-01-02',
  },
]

export function getFileIcon(url: string): string {
  const ext = url.split('.').pop()?.toLowerCase()
  const icons: Record<string, string> = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    zip: '🗜️',
    rar: '🗜️',
    mp4: '🎬',
    mov: '🎬',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
  }
  return icons[ext ?? ''] ?? '📎'
}
