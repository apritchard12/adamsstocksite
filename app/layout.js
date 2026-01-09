import './globals.css';

export const metadata = {
  title: "Adam's Stock Site",
  description: 'Real-time market intelligence',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
