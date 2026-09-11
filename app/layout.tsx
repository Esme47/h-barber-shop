export const metadata = {
  title: "H Barber Shop",
  description: "Agenda de barbería",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
