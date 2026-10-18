export const metadata = {
  title: "Demo Web App",
  description: "Aplikasi uji deploy Kubernetes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>{children}</body>
    </html>
  );
}
