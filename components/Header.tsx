import Link from 'next/link';
import React from 'react';

function Header() {
    return (
        <header className="bg-teal-700 text-white">
            <div className="container mx-auto flex items-center justify-between p-4">
                <Link href="/">
                    <div className="text-lg font-bold">CarBuy</div>
                </Link>

                <nav className="flex space-x-4">
                    <a href="/cars" className="hover:underline">Cars</a>
                    <a href="#about" className="hover:underline">About</a>
                    <a href="#contact" className="hover:underline">Contact</a>
                </nav>
            </div>
        </header>
    );
}

export default Header;