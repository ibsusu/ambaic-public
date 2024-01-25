
import { HeadProvider, Title, Link, Meta } from 'react-head';
import { FunctionalComponent } from 'preact';

import Navbar from './ui/Navbar';
// import Footer from 'components/ui/Footer';

import { PageMeta } from '../../core/types';

interface Props {
  children?: JSX.Element;
}

export default function Layout({children}: Props) {
  // const router = useRouter();
  const meta = {
    title: 'Next.js Subscription Starter',
    description: 'Brought to you by Vercel, Stripe, and Supabase.',
    cardImage: '/og.png',
  };
  return (
    <HeadProvider>
        <Title>{meta.title}</Title>
        <Meta name="robots" content="follow, index" />
        <Link href="/favicon.ico" rel="shortcut icon" />
        <Meta content={meta.description} name="description" />
        <Meta property="og:url" content={`https://ambaicrealms.com/{router}`} />
        <Meta property="og:type" content="website" />
        <Meta property="og:site_name" content={meta.title} />
        <Meta property="og:description" content={meta.description} />
        <Meta property="og:title" content={meta.title} />
        {/* <Meta property="og:image" content={meta.cardImage} /> */}
        <Meta name="twitter:card" content="summary_large_image" />
        <Meta name="twitter:site" content="@vercel" />
        <Meta name="twitter:title" content={meta.title} />
        <Meta name="twitter:description" content={meta.description} />
        <Meta name="twitter:image" content={meta.cardImage} />
        <main className="ahoythere" id="skip">{children}</main>
    </HeadProvider>
  );
}
