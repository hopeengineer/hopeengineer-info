import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work With Me',
  description: 'Partner with HopeEngineer to build custom AI automations, engineering systems, and premium digital experiences.',
  alternates: {
    canonical: '/work-with-me',
  },
};

export default function WorkWithMeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
