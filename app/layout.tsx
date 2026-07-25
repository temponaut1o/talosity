import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Talosity Robotics',
  url: 'https://www.talosity.com',
  logo: 'https://www.talosity.com/favicon.ico',
  description:
    'Talosity Robotics provides enterprise intelligence and discovery for industrial robotics across warehouse automation, commercial cleaning, construction, and medical robotics.',
  industry: 'Industrial Robotics',
  areaServed: 'Worldwide',
  keywords: [
    'industrial robotics',
    'warehouse automation',
    'commercial cleaning robots',
    'construction robotics',
    'medical robotics',
  ],
};

export const metadata: Metadata = {
  title: {
    default: 'Talosity Robotics | Enterprise Industrial Robotics Intelligence',
    template: '%s | Talosity Robotics',
  },
  description:
    'Talosity Robotics is the enterprise industrial robotics intelligence platform for warehouse automation, commercial cleaning, construction, and medical robotics.',
  metadataBase: new URL('https://www.talosity.com'),
  alternates: {
    canonical: 'https://www.talosity.com',
  },
  keywords: [
    'industrial robotics',
    'warehouse automation',
    'commercial cleaning robots',
    'construction robotics',
    'medical robotics',
    'robotics directory',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Talosity Robotics | Enterprise Industrial Robotics Intelligence',
    description:
      'Discover enterprise robotics companies and platforms for warehouse automation, commercial cleaning, construction, and medical applications.',
    url: 'https://www.talosity.com',
    siteName: 'Talosity Robotics',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talosity Robotics | Enterprise Industrial Robotics Intelligence',
    description:
      'Enterprise industrial robotics intelligence for warehouse automation, commercial cleaning, construction, and medical robotics.',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Script
          id="talosity-organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
