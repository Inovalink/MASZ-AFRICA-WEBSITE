'use client';

import Navbar from './components/navbar';
import LenisProvider from './providers/LenisProvider';
import CallToAction from './sessions/CallToAction';
import Footer from './components/footer';

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <LenisProvider>{children}</LenisProvider>
      <CallToAction />
      <Footer />
    </>
  );
}
