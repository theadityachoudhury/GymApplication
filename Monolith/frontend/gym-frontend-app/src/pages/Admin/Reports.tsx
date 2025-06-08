import { Controller, useForm } from 'react-hook-form';
import Select, { SelectOption } from '@/components/common/form/Select';
import Button from '@/components/common/ui/CustomButton';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
// import { ApiReportService } from '@/services/Reports/apiReportService';
import LoadingSpinner from '@/components/common/ui/LoadingSpinner';
import { reportSchema, reportSchemaData } from '@/schemas/report';

const Reports = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportTypeOptions,] = useState<SelectOption[]>([]);
  const [periodOptions,] = useState<SelectOption[]>([]);
  const [gymOptions,] = useState<SelectOption[]>([]);

  const {
    control,
    handleSubmit,

    formState,
  } = useForm<reportSchemaData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reportType: 'ALL',
      period: 'July',
      gym: 'ALL',
    },
  });

  // Fetch options for the filters
  async function fetchFilterOptions() {
    // const apiReport = new ApiReportService();
    // const { data } = await apiReport.getFilterOptions();

    // setReportTypeOptions([{ label: 'All', value: 'ALL' }, ...data.reportTypes]);
    // setPeriodOptions(data.periods);
    // setGymOptions([{ label: 'All', value: 'ALL' }, ...data.gyms]);

    // Reset the form with the first options
    // reset({
    //   reportType: 'ALL',
    //   period: data.periods[0]?.value || 'July',
    //   gym: 'ALL',
    // });
  }

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Form submission handler
  const onSubmit = async (data: reportSchemaData) => {
    setIsLoading(true);
    console.log(data);

    // try {
    //   console.log('Report data:', data);

    //   // const apiReport = new ApiReportService();
    //   const result = await apiReport.generateReport(data);

    //   console.log('Generated report:', result);
    //   // Handle the generated report (e.g., download or display it)
    // } catch (error) {
    //   console.error('Report generation failed:', error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-4 sm:mx-8 md:mx-12">
      <section className="mt-8 mb-8">
        <p className="text-lg text-gray-600 mt-2">
          Filters
        </p>
      </section>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row gap-4 items-start">
          {/* Report Type Filter */}
          <div className="w-full md:w-1/4">
            <Controller
              name="reportType"
              control={control}
              render={({ field }) => (
                <Select
                  size="medium"
                  variant="primary"
                  fullWidth
                  options={reportTypeOptions}
                  onChange={field.onChange}
                  value={field.value}
                  name={field.name}
                  label="Report Type"
                />
              )}
            />
          </div>

          {/* Period Filter */}
          <div className="w-full md:w-1/4">
            <Controller
              name="period"
              control={control}
              render={({ field }) => (
                <Select
                  size="medium"
                  variant="primary"
                  fullWidth
                  options={periodOptions}
                  onChange={field.onChange}
                  value={field.value}
                  name={field.name}
                  label="Period"
                />
              )}
            />
          </div>

          {/* Gym Filter */}
          <div className="w-full md:w-1/4">
            <Controller
              name="gym"
              control={control}
              render={({ field }) => (
                <Select
                  size="medium"
                  variant="primary"
                  fullWidth
                  options={gymOptions}
                  onChange={field.onChange}
                  value={field.value}
                  name={field.name}
                  label="Gym"
                />
              )}
            />
          </div>

          {/* Generate Report Button */}
          <div className="w-full md:w-1/4 flex items-center">
            <Button
              type="submit"
              variant="primary"
              size="medium"
              fullWidth
              isLoading={formState.isSubmitting}
              className="bg-lime-400 hover:bg-lime-500 text-black font-medium"
              disabled={formState.isSubmitting}
            >
              Generate Report
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Reports;