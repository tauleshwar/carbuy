'use client';
import CarCard from "@/components/utility/CarCard";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Car from "@/types/car-types";

export default function Home() {
  const [wishlist, setWishlist] = useState<Car[]>([]);


  useEffect(() => {
    // Fetch wishlist from local storage
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(storedWishlist);

  }, []);



  return (
    <div className="home">

            <section className="my-wishlist my-10 mx-auto w-10/12">
        <div className="flex justify-center">
          <Link
            href="/cars"
            className="text-black bg-gray-100 p-4 rounded-md hover:underline"
          >
            View All Cars
          </Link>
        </div>
      
        <h2 className="text-2xl my-4 font-bold">My Wishlist</h2>
        <div className="wishlist-cars grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>




    </div>
  );
}