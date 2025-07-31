import { redirect } from 'next/navigation';

export const metadata = {
  title: "The Hybrid Protocol - Blog",
  description: "Insights and inspiration at your fingertips.",
};

export default function Home() {
  redirect('/podcasts');
}
