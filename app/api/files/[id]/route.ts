import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { join } from "path"
import { readFileSync, existsSync, readdirSync } from "fs"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  try {
    console.log("Buscando arquivo com ID:", id)
    
    const file = await prisma.file.findUnique({
      where: { id }
    })

    if (!file) {
      console.log("Arquivo não encontrado no banco de dados")
      return NextResponse.json(
        { error: "Arquivo não encontrado" },
        { status: 404 }
      )
    }

    console.log("Arquivo encontrado no banco:", file)

    // Remover a barra inicial da URL se existir
    const fileUrl = file.url.startsWith('/') ? file.url.slice(1) : file.url
    const baseDir = join(process.cwd(), "public")
    const uploadsDir = join(baseDir, "uploads", "medical-leaves")
    
    console.log("Diretório base:", baseDir)
    console.log("Diretório de uploads:", uploadsDir)

    // Verificar se o diretório existe
    if (!existsSync(uploadsDir)) {
      console.error("Diretório de uploads não encontrado:", uploadsDir)
      return NextResponse.json(
        { 
          error: "Diretório de uploads não encontrado",
          path: uploadsDir
        },
        { status: 404 }
      )
    }

    // Listar arquivos no diretório
    const files = readdirSync(uploadsDir)
    console.log("Arquivos no diretório:", files)

    // Extrair o nome do arquivo da URL
    const fileName = fileUrl.split('/').pop()
    console.log("Nome do arquivo procurado:", fileName)

    // Procurar o arquivo ignorando case sensitivity
    let foundFile = files.find(f => f.toLowerCase() === fileName?.toLowerCase())
    console.log("Arquivo encontrado no diretório:", foundFile)

    if (!foundFile) {
      // Tentar encontrar um arquivo com o mesmo nome base (sem o timestamp)
      const baseFileName = fileName?.split('-').slice(1).join('-')
      const matchingFileWithoutTimestamp = files.find(f => f.split('-').slice(1).join('-').toLowerCase() === baseFileName?.toLowerCase())
      
      if (matchingFileWithoutTimestamp) {
        console.log("Arquivo encontrado sem timestamp:", matchingFileWithoutTimestamp)
        
        // Atualizar a URL do arquivo no banco de dados
        const newUrl = `/uploads/medical-leaves/${matchingFileWithoutTimestamp}`
        await prisma.file.update({
          where: { id: file.id },
          data: { url: newUrl }
        })
        
        console.log("URL do arquivo atualizada no banco:", newUrl)
        foundFile = matchingFileWithoutTimestamp
      } else {
        console.error("Arquivo não encontrado no sistema de arquivos")
        return NextResponse.json(
          { 
            error: "Arquivo não encontrado no sistema de arquivos",
            searchedFile: fileName,
            availableFiles: files
          },
          { status: 404 }
        )
      }
    }

    const filePath = join(uploadsDir, foundFile)
    console.log("Caminho completo do arquivo:", filePath)

    try {
      const fileBuffer = readFileSync(filePath)
      console.log("Arquivo lido com sucesso, tamanho:", fileBuffer.length)
      
      // Configurar headers apropriados
      const headers = new Headers()
      headers.set("Content-Type", file.type)
      headers.set("Content-Disposition", `inline; filename="${file.name}"`)
      headers.set("Cache-Control", "public, max-age=31536000") // Cache por 1 ano
      
      return new NextResponse(fileBuffer, {
        headers,
        status: 200
      })
    } catch (fileError) {
      console.error("Erro ao ler arquivo do sistema de arquivos:", fileError)
      console.error("Detalhes do erro:", {
        message: fileError instanceof Error ? fileError.message : "Erro desconhecido",
        stack: fileError instanceof Error ? fileError.stack : undefined,
        error: fileError,
        filePath
      })
      return NextResponse.json(
        { 
          error: "Erro ao ler arquivo do sistema de arquivos", 
          details: fileError instanceof Error ? fileError.message : "Erro desconhecido",
          path: filePath
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Erro ao buscar arquivo:", error)
    return NextResponse.json(
      { 
        error: "Erro ao buscar arquivo", 
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    )
  }
} 