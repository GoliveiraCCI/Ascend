import { TrainingDetailsClient } from "./client"

export default async function TrainingDetailsPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params
  return <TrainingDetailsClient id={resolvedParams.id} />
}

