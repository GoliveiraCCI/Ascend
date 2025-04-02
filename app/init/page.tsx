"use client"

export default function InitPage() {
  async function handleInit() {
    try {
      const response = await fetch('/api/init', {
        method: 'POST',
      })
      const data = await response.json()
      alert(data.message)
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao inicializar o sistema')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inicialização do Sistema</h1>
      <button
        onClick={handleInit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Inicializar Sistema
      </button>
    </div>
  )
} 