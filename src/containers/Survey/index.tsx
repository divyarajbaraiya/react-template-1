import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { surveySchema } from "./schema";
import { SurveyData } from "./types";

const CAR_BRANDS = ["Chevy", "Ford", "Honda", "Buick", "Toyota", "Tesla", "Kia"];
const COLORS = ["Blue", "Silver", "Black", "White", "Red", "Green", "Yellow", "Pink"];
const TRANSMISSION_OPTIONS = ["Manual", "Automatic"];

const Survey: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<SurveyData>({
    resolver: zodResolver(surveySchema),
    mode: "onChange",
  });

  const [submittedData, setSubmittedData] = useState<SurveyData | null>(null);
  const selectedBrands = watch("brands") || [];
  const selectedColors = watch("colors") || [];

  // Memoized filtered colors to optimize re-renders
  const filteredColors = useMemo(() => {
    return selectedBrands.includes("Toyota") || selectedBrands.includes("Tesla")
      ? COLORS.filter((c) => !["Pink", "Green", "Yellow"].includes(c))
      : COLORS;
  }, [selectedBrands]);

  // Handle dynamic transmission logic
  useEffect(() => {
    if (selectedBrands.includes("Tesla")) {
      setValue("transmission", undefined);
    } else if (selectedColors.includes("Green") || selectedColors.includes("Yellow")) {
      setValue("transmission", "Automatic");
    }
  }, [selectedBrands, selectedColors, setValue]);

  const onSubmit = useCallback((data: SurveyData) => {
    setSubmittedData(data);
  }, []);

  return (
    <div className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg shadow-xl w-full max-w-2xl md:max-w-4xl transition-all duration-300">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">🚗 Car Survey</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium">Select Car Brands</label>
          <select
            multiple
            {...register("brands")}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            aria-label="Select Car Brands"
          >
            {CAR_BRANDS.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
          {errors.brands && <p className="text-red-500 text-sm">{errors.brands.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Select Colors</label>
          <select
            multiple
            {...register("colors")}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            aria-label="Select Colors"
          >
            {filteredColors.map((color) => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
          {errors.colors && <p className="text-red-500 text-sm">{errors.colors.message}</p>}
        </div>

        {!selectedBrands.includes("Tesla") && !selectedColors.includes("Green") && !selectedColors.includes("Yellow") && (
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium">Transmission Type</label>
            <div className="flex space-x-4">
              {TRANSMISSION_OPTIONS.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input type="radio" value={option} {...register("transmission")} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-3 text-lg rounded-md transition ${
              isValid ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </div>
      </form>

      {/* Display Submitted Data */}
      {submittedData && (
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
          <h3 className="text-lg font-semibold text-green-700">Submission Successful ✅</h3>
          <p className="text-gray-700"><strong>Brands:</strong> {submittedData.brands.join(", ")}</p>
          <p className="text-gray-700"><strong>Colors:</strong> {submittedData.colors.join(", ")}</p>
          {submittedData.transmission && <p className="text-gray-700"><strong>Transmission:</strong> {submittedData.transmission}</p>}
        </div>
      )}
    </div>
  );
};

export default React.memo(Survey);