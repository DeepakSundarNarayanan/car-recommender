"use client";
import { useEffect, useState } from "react";

interface CarData {
  fullDescription: string;
  summary: string;
  searchQuery: string;
}

type Props = {
  car: CarData;
};

export default function CarCard({ car }: Props) {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      const res = await fetch(
        `/api/getCarImage?query=${encodeURIComponent(car.searchQuery)}`
      );
      const data = await res.json();
      setImageUrl(data.imageUrl);
    };
    fetchImage();
  }, [car]);

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={car.fullDescription}
          className="w-full h-48 object-cover rounded mb-3"
        />
      ) : (
        <div className="w-full h-48 bg-gray-300 rounded mb-3 animate-pulse" />
      )}
      <h3 className="text-gray-800 font-medium text-lg mb-2">
        {car.fullDescription}
      </h3>
      <p className="text-gray-600 text-sm">{car.summary}</p>
    </div>
  );
}
