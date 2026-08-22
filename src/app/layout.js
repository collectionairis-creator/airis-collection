// src/app/layout.js
import { Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';
import { CarritoProvider } from './context/CarritoContext';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata = {
  title: "Airi's Collection",
  description: 'Belleza, estilo y detalles para consentirte',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="font-montserrat antialiased">
        <CarritoProvider>
          {children}
        </CarritoProvider>
      </body>
    </html>
  );
}