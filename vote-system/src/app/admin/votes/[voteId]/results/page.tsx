import VoteResultsClient from "./VoteResultsClient";

type Props = {
  params: Promise<{ voteId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function VoteResultsPage({ params }: Props) {
  const { voteId } = await params;
  return <VoteResultsClient voteId={voteId} />;
} 