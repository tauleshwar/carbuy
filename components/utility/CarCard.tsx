import Car from '@/types/car-types';
import Link from 'next/link';
import React from 'react'

function CarCard({ car }: { car: Car; }) {
    return (
        <div
            key={car.id}
            className="car-card border p-4 rounded shadow hover:shadow-lg"
            style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
        >
            <Link href={`/cars/${car.id}`}>
                <img
                    src={car.image}
                    alt={car.title}
                    className="w-full h-40 object-cover rounded"
                />
            </Link>
            <h3 className="text-lg font-bold mt-2">{car.title}</h3>
            <p className="text-sm">Brand: {car.brand}</p>
            <p className="text-sm">Price: ${car.price}</p>
            <p className="text-sm">Fuel: {car.fuel_type}</p>
            
        </div>
    )
}

export default CarCard