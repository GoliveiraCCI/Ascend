import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Treinamentos",
  description: "Gerenciamento de treinamentos da empresa",
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
} 