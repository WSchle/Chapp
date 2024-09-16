import localFont from 'next/font/local';
import './ui/globals.css';

export const metadata = {
    title: 'Simple Chat App',
    description: 'Next.js Chat App',
};

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body>
                <div className='wave'></div>
                <div className='wave'></div>
                <div className='wave'></div>
                {children}
            </body>
        </html>
    );
}
