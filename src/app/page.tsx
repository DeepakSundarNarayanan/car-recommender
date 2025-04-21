"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import CarCard from "@/components/CarCard";
import Spinner from "@/components/Spinner";

type FormInputs = {
  make: string;
  model: string;
  carType: string;
  mileage: string;
  description: string;
};

export default function Home() {
  const { register, handleSubmit, reset } = useForm<FormInputs>();
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormInputs) => {
    setLoading(true);
    setResults([]);

    const prompt = `Suggest cars based on the following preferences:
    Make: ${data.make}
    Model: ${data.model}
    Car Type: ${data.carType}
    Mileage: ${data.mileage} mpg
    Description: ${data.description}`;

    const res = await fetch("/api/getCars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const dataRes = await res.json();
    setResults(dataRes.cars || []);
    setLoading(false);
    reset();
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-white p-6 rounded shadow text-black"
      >
        <div className="space-y-2">
          <label
            htmlFor="make"
            className="block text-sm font-medium text-gray-700"
          >
            Car Make
          </label>
          <input
            id="make"
            {...register("make")}
            placeholder="Make"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="model"
            className="block text-sm font-medium text-gray-700"
          >
            Car Model
          </label>
          <input
            id="model"
            {...register("model")}
            placeholder="Model"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="carType"
            className="block text-sm font-medium text-gray-700"
          >
            Vehicle Type
          </label>
          <select
            id="carType"
            {...register("carType")}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Car Type</option>
            <option>SUV</option>
            <option>Sedan</option>
            <option>Hatchback</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="mileage"
            className="block text-sm font-medium text-gray-700"
          >
            Desired Mileage (MPG)
          </label>
          <input
            id="mileage"
            {...register("mileage")}
            placeholder="Mileage (mpg)"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Additional Requirements
          </label>
          <textarea
            id="description"
            {...register("description")}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Get Suggestions
        </button>
      </form>

      {loading && <Spinner />}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!loading && results.map((car, idx) => <CarCard key={idx} car={car} />)}
      </div>
    </div>
  );
}
