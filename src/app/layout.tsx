import './globals.css';
import Navbar from '@/components/Navbar';
export const metadata={title:'Basílica San Vicente Ferrer',description:'Sitio institucional y pastoral'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang='es'><body className='bg-stone-50 text-stone-900'><Navbar/><main className='max-w-6xl mx-auto p-4'>{children}</main></body></html>}
