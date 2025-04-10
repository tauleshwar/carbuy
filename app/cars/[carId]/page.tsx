'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CarCard from '@/components/utility/CarCard';
import Car from '@/types/car-types';

function CarPage({ params }: { params: { carId: string } }) {
  const { carId } = params;
  const [car, setCar] = useState<Car | null>(null);
  const [moreCars, setMoreCars] = useState<Car[]>([]); 
  const router = useRouter();

  useEffect(() => {
    fetch(`http://localhost:8000/cars/${carId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch car details');
        }
        return response.json();
      })
      .then((data: Car) => setCar(data))
      .catch((error) => {
        console.error(error);
        router.push('/cars'); 
      });
  }, [carId, router]);

  // Fetch more cars
  useEffect(() => {
    fetch(`http://localhost:8000/cars`)
      .then((response) => response.json())
      .then((data: Car[]) => {
        const filteredCars = data.filter((c) => c.id !== carId);
        setMoreCars(filteredCars.slice(0, 4)); 
      })
      .catch((error) => console.error('Failed to fetch more cars:', error));
  }, [carId]);

  const addToWishlist = () => {
    if (car) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const updatedWishlist = [...wishlist, car];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      alert(`${car.title} has been added to your wishlist!`);
    }
  };

  if (!car) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      {/* Car Details Section */}
      <div className="max-w-4xl mx-auto bg-white shadow rounded p-6 mb-8">
        <img
          src={car.image}
          alt={car.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <h1 className="text-2xl text-gray-700 font-bold mb-2">{car.title}</h1>
        <p className="text-gray-600 mb-2">Brand: {car.brand}</p>
        <p className="text-gray-600 mb-2">Fuel Type: {car.fuel_type}</p>
        <p className="text-gray-600 mb-2">Price : {car.price}</p>
        <p className="text-gray-600 mb-4">
          Seating Capacity: {car.seating_capacity}
        </p>
        <button
          onClick={addToWishlist}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add to Wishlist
        </button>
      </div>

      
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">More Cars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {moreCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CarPage;