import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { surveySchema } from './schema';
import { SurveyData } from './types';
import Button from '../../components/Button';
import Select from '../../components/Select';

const CAR_BRANDS = ['Chevy', 'Ford', 'Honda', 'Buick', 'Toyota', 'Tesla', 'Kia'];
const COLORS = ['Blue', 'Silver', 'Black', 'White', 'Red', 'Green', 'Yellow', 'Pink'];
const TRANSMISSIONS = ['Manual', 'Automatic'];

const Survey: React.FC = () => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isValid },
  } = useForm<SurveyData>({
    resolver: zodResolver(surveySchema),
    mode: 'onChange',
    defaultValues: {
      brands: [],
      colors: [],
      transmission: undefined,
    },
  });

  const [submittedData, setSubmittedData] = useState<SurveyData | null>(null);
  const selectedBrands = watch('brands') || [];
  const selectedColors = watch('colors') || [];

  // Memoized filtered colors to optimize re-renders
  const filteredColors = useMemo(() => {
    return selectedBrands.includes('Toyota') || selectedBrands.includes('Tesla')
      ? COLORS.filter((c) => !['Pink', 'Green', 'Yellow'].includes(c))
      : COLORS;
  }, [selectedBrands]);

  const hideTransmission = useMemo(
    () =>
      !selectedBrands.includes('Tesla') &&
      !selectedColors.includes('Green') &&
      !selectedColors.includes('Yellow'),
    [selectedBrands, selectedColors],
  );

  // Handle dynamic filtering of colors and transmission logic
  useEffect(() => {
    // Remove invalid colors if Toyota or Tesla is selected
    if (selectedBrands.some((brand) => ['Toyota', 'Tesla'].includes(brand))) {
      setValue(
        'colors',
        selectedColors.filter((color) => !['Pink', 'Green', 'Yellow'].includes(color)),
      );
    }

    // Handle transmission logic
    if (selectedBrands.includes('Tesla')) {
      setValue('transmission', undefined);
    } else if (selectedColors.includes('Green') || selectedColors.includes('Yellow')) {
      setValue('transmission', 'Automatic');
    }
  }, [selectedBrands, selectedColors, setValue]);

  const onSubmit = useCallback((data: SurveyData) => {
    setSubmittedData(data);
  }, []);

  const onReset = () => {
    reset();
    setSubmittedData(null);
  };

  const renderHeader = () => (
    <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 md:text-3xl">Car Survey</h2>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <label className="block font-medium text-gray-700">Select Car Brands</label>
        <Select
          name="brands"
          control={control}
          options={CAR_BRANDS.map((brand) => ({
            label: brand,
            value: brand,
          }))}
          multiple
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="block font-medium text-gray-700">Select Colors</label>
        <Select
          name="colors"
          control={control}
          options={filteredColors.map((color) => ({
            label: color,
            value: color,
          }))}
          multiple
        />
      </div>

      {hideTransmission && (
        <div className="md:col-span-2">
          <label className="block font-medium text-gray-700">Transmission Type</label>
          <div className="flex space-x-4">
            {TRANSMISSIONS.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input type="radio" value={option} {...register('transmission')} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="md:col-span-2">
        <Button
          className={`w-full rounded-md py-3 text-lg transition ${
            isValid ? 'bg-blue-600 text-white hover:bg-blue-700' : 'cursor-not-allowed bg-gray-400'
          }`}
          type="submit"
          disabled={!isValid}
        >
          Submit
        </Button>
      </div>
    </form>
  );

  const renderSubmitData = () =>
    submittedData && (
      <div className="mt-6 rounded-lg border border-green-300 bg-green-100 p-4">
        <h3 className="text-lg font-semibold text-green-700">Submission Successful ✅</h3>
        <p className="text-gray-700">
          <strong>Brands:</strong> {submittedData.brands.join(', ')}
        </p>
        <p className="text-gray-700">
          <strong>Colors:</strong> {submittedData.colors.join(', ')}
        </p>
        {submittedData.transmission && (
          <p className="text-gray-700">
            <strong>Transmission:</strong> {submittedData.transmission}
          </p>
        )}
        <Button
          className="rounded-md bg-gray-400 py-3 text-lg text-white transition hover:bg-gray-600"
          type="button"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
    );

  return (
    <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl transition-all duration-300 sm:p-8 md:max-w-4xl md:p-10 lg:p-12">
      {renderHeader()}

      {renderForm()}

      {renderSubmitData()}
    </div>
  );
};

export default React.memo(Survey);
