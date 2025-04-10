'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CarCard from '@/components/utility/CarCard';
import Car, { Brand } from '@/types/car-types';

function CarsPage() {

    const [allCars, setAllCars] = useState<Car[]>([]); // All cars fetched
    const [displayedCars, setDisplayedCars] = useState<Car[]>([]); // Cars for the current page
    const [totalCars, setTotalCars] = useState<number>(0); // Total number of cars
    const [currentPage, setCurrentPage] = useState<number>(1); // Current page
    const [perPage] = useState<number>(10); // Cars per page

    const [sortOrder, setSortOrder] = useState<string>(""); // Sorting order
    const [brands, setBrands] = useState<string[]>([]);
    const [priceRanges, setPriceRanges] = useState<{ name: string; minPrice: number; maxPrice: number }[]>([]);

    const [fuelTypes, setFuelTypes] = useState<{ id: string; name: string }[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);


    const [filters, setFilters] = useState({
        brand: "",
        minPrice: "",
        maxPrice: "",
        fuel_type: "",
        seating_capacity: "",
    });

    const [tempFilters, setTempFilters] = useState(filters); // Temporary state for filter inputs

    const router = useRouter();
    const searchParams = useSearchParams();

    // Fetch all cars based on filters
    const fetchCars = (query: string) => {
        fetch(`http://localhost:8000/cars?${query}`)
            .then((response) => response.json())
            .then((data: Car[]) => {
                setAllCars(data); // Store all cars
                setTotalCars(data.length); // Update total cars count
                setDisplayedCars(data.slice(0, perPage)); // Set cars for the first page
            })
            .catch((error) => {
                console.error("Error fetching cars:", error);
            });
    };
 

    useEffect(() => {
        fetch("http://localhost:8000/price-range")
            .then((response) => response.json())
            .then((data: { name: string; minPrice: number; maxPrice: number }[]) => {
                setPriceRanges(data);
            });

        fetch("http://localhost:8000/brands")
            .then((response) => response.json())
            .then((data: Brand[]) => {
                setBrands(data.map((brand) => brand.name));
            });

        fetch("http://localhost:8000/fuel-type")
            .then((response) => response.json())
            .then((data: { id: string; name: string }[]) => {
                setFuelTypes(data);
            });
    }, []);

    // Read filters from URL query parameters
    useEffect(() => {
        const brand = searchParams.get('brand') || "";
        const minPrice = searchParams.get('price_gte') || "";
        const maxPrice = searchParams.get('price_lte') || "";
        const fuel_type = searchParams.get('fuel_type') || "";
        const seating_capacity = searchParams.get('seating_capacity') || "";

        const urlFilters = { brand, minPrice, maxPrice, fuel_type, seating_capacity };
        setFilters(urlFilters);
        setTempFilters(urlFilters);

        // Fetch all cars based on URL query parameters
        const query = new URLSearchParams(urlFilters).toString();
        fetchCars(query);
    }, []);

    // Apply filters and update URL
    const searchCars = () => {
        setFilters(tempFilters);

        const query = new URLSearchParams();
        if (tempFilters.brand) query.set('brand', tempFilters.brand);
        if (tempFilters.minPrice) query.set('price_gte', tempFilters.minPrice);
        if (tempFilters.maxPrice) query.set('price_lte', tempFilters.maxPrice);
        if (tempFilters.fuel_type) query.set('fuel_type', tempFilters.fuel_type);
        if (tempFilters.seating_capacity) query.set('seating_capacity', tempFilters.seating_capacity);

        const queryString = query.toString();
        router.push(`?${queryString}`);
        setCurrentPage(1); // Reset to the first page
        fetchCars(queryString);
    };

    // Handle sorting post-render
    useEffect(() => {
        let sortedCars = [...allCars];
        if (sortOrder === "lowToHigh") {
            sortedCars.sort((a, b) => a.price - b.price);
        } else if (sortOrder === "highToLow") {
            sortedCars.sort((a, b) => b.price - a.price);
        }
        const startIndex = (currentPage - 1) * perPage;
        const endIndex = startIndex + perPage;

        setDisplayedCars(sortedCars.slice(startIndex, endIndex)); // Update displayed cars

    }, [sortOrder, allCars, currentPage, perPage]);

    // Handle pagination
    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= Math.ceil(totalCars / perPage)) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div>
            <section className="search-filter bg-gray-800 p-4 md:flex flex-row grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center justify-center">

                <div className="search-bar relative flex gap-4">
                    <input
                        type="text"
                        placeholder="Search by brand"
                        value={tempFilters.brand}
                        onChange={(e) => {
                            setTempFilters({ ...tempFilters, brand: e.target.value });
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)} // Show suggestions when the input is focused
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click on suggestions
                        className="border p-2 rounded w-full min-w-[200px]"
                    />
                    {showSuggestions && (
                        <ul className="absolute bg-white text-black border rounded w-full max-h-40 top-10 z-10 overflow-y-auto">
                            {brands
                                .filter((brand) =>
                                    tempFilters.brand
                                        ? brand.toLowerCase().includes(tempFilters.brand.toLowerCase())
                                        : true // Show all brands if the input is empty
                                )
                                .map((brand) => (
                                    <li
                                        key={brand}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => {
                                            setTempFilters({ ...tempFilters, brand });
                                            setShowSuggestions(false);
                                        }}
                                    >
                                        {brand}
                                    </li>
                                ))}
                        </ul>
                    )}
                    <select
                        name="fuel_type"
                        value={tempFilters.fuel_type}
                        onChange={(e) => {
                            setTempFilters({ ...tempFilters, fuel_type: e.target.value })

                        }

                        }
                        className="border p-2 rounded"
                    >
                        <option value="">Select Fuel Type</option>
                        {fuelTypes.map((fuel) => (
                            <option key={fuel.id} value={fuel.name}>
                                {fuel.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-options flex gap-4">

                    <select
                        name="price"
                        value={`${tempFilters.minPrice}-${tempFilters.maxPrice}`}
                        onChange={(e) => {
                            const [minPrice, maxPrice] = e.target.value.split('-');
                            setTempFilters({ ...tempFilters, minPrice, maxPrice });
                            searchCars();
                        }}
                        className="border p-2 rounded"
                    >
                        <option value="">Select Price Range</option>
                        {priceRanges.map((range) => (
                            <option key={range.name} value={`${range.minPrice}-${range.maxPrice}`}>
                                {range.name}
                            </option>
                        ))}
                    </select>
                    <select
                        name="seating_capacity"
                        value={tempFilters.seating_capacity}
                        onChange={(e) => setTempFilters({ ...tempFilters, seating_capacity: e.target.value })}
                        className="border p-2 rounded"
                    >
                        <option value="">Select Seating Capacity</option>
                        <option value="2">2</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                    </select>
                </div>

                <div className="sort-options flex gap-4">
                    <label className="text-white">
                        <input
                            type="radio"
                            name="sortOrder"
                            value="lowToHigh"
                            checked={sortOrder === "lowToHigh"}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="mr-2"
                        />
                        Price: Low to High
                    </label>
                    <label className="text-white">
                        <input
                            type="radio"
                            name="sortOrder"
                            value="highToLow"
                            checked={sortOrder === "highToLow"}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="mr-2"
                        />
                        Price: High to Low
                    </label>
                </div>

                <button
                    onClick={searchCars}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >Search
                </button>
            </section>

            {displayedCars.length > 0 ? (
                <div className="">  <section className="cars-list p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:w-10/12 mx-auto">
                    {displayedCars.map((car) => (
                        <CarCard car={car} />
                    ))}
                </section>

                    <div className="pagination p-4 flex justify-center items-center gap-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {Math.ceil(totalCars / perPage)}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === Math.ceil(totalCars / perPage)}
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div></div>
            ) : (
                <div className="p-4 text-center">
                    <h2 className="text-xl font-bold">No Cars Found</h2>
                    <p className="text-gray-600">Try adjusting your filters.</p>
                </div>
            )}
        </div>
    );
}

export default CarsPage;