
import { GithubButton } from '@/components/ui/github-button';

export default function GithubButtonContainer({ repoUrl }: { repoUrl: string }) {
  return (
    <div className="space-y-4">
      <GithubButton targetStars={0} label="Star on GitHub" repoUrl={repoUrl} />
    </div>
  );
}
