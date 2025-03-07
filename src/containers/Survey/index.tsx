import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { surveySchema } from './schema';
import { SurveyData } from './types';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Radio from '../../components/Radio';

const CAR_BRANDS = ['Chevy', 'Ford', 'Honda', 'Buick', 'Toyota', 'Tesla', 'Kia'];
const COLORS = ['Blue', 'Silver', 'Black', 'White', 'Red', 'Green', 'Yellow', 'Pink'];
const TRANSMISSIONS = ['Manual', 'Automatic'];

const Survey: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<SurveyData>({
    resolver: zodResolver(surveySchema),
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

  const onSubmit = useCallback(async (data: SurveyData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmittedData(data);
  }, []);

  const onReset = () => {
    reset();
    setSubmittedData(null);
  };

  const renderHeader = () => (
    <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 md:text-3xl">Car Survey</h2>
  );

  const renderLabel = (text: string, htmlFor?: string) => (
    <label htmlFor={htmlFor} className="block font-medium text-gray-700">
      {text}
    </label>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        {renderLabel('Select Car Brands', 'brands')}
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
        {renderLabel('Select Colors', 'colors')}
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

      <div
        className={`transition-all duration-500 ease-in-out md:col-span-2 ${
          hideTransmission ? 'max-h-[200px] opacity-100' : 'max-h-0 overflow-hidden opacity-0'
        }`}
      >
        {renderLabel('Transmission Type', 'transmission')}
        <Radio name="transmission" control={control} options={TRANSMISSIONS} />
      </div>

      <div className="md:col-span-2">
        <Button
          className={`w-full rounded-md py-3 text-lg transition ${
            isValid ? 'bg-blue-600 text-white hover:bg-blue-700' : 'cursor-not-allowed bg-gray-400'
          }`}
          type="submit"
          disabled={!isValid}
          isLoading={isSubmitting}
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
        <Button className="mt-2" type="button" onClick={onReset} variant="destructive">
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
