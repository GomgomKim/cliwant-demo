import { WelcomeFeature } from '@/features/welcome';

export const HomeWidget = () => {
  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold text-center">Next.js with Feature-Sliced Design</h1>
      <WelcomeFeature />
    </div>
  );
};
