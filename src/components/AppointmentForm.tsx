import { Button } from '@material-ui/core';
import { Form, Formik } from 'formik';
import SelectField from './SelectField';
interface Form {
  practitionerId: string;
  patientId: string;
  availabilitiesId: string;
}

const AppointmentForm = ({
  practitioners,
  patients,
  availabilities,
  setPractitionerId,
  practitionerId,
  onSubmitAppointmentForm,
  createAppointment,
  setIsSubmit,
  isPractitionersLoading,
  isPatientsLoading,
  isAvailabilitiesLoading,
}) => {
  const initialValues = {
    practitionerId: '',
    patientId: '',
    availabilitiesId: '',
  };
  const isSubmitDisabled = (props) => {
    const isNotEmpty =
      props?.practitionerId && props?.patientId && props?.availabilitiesId;

    return (
      !!isNotEmpty &&
      !!practitionerId &&
      props?.practitionerId === practitionerId
    );
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(props) => {
          const { startDate, endDate } = availabilities.find(
            (av: any) => av.id === Number(props.availabilitiesId),
          );

          createAppointment({
            practitionerId: props.practitionerId,
            patientId: props.patientId,
            startDate,
            endDate,
          });
          onSubmitAppointmentForm(props);
          setIsSubmit(true);
        }}
      >
        {({ setFieldValue, values }) => {
          const isValid = isSubmitDisabled(values);

          return (
            <Form>
              {!isPractitionersLoading && (
                <SelectField
                  name="practitionerId"
                  label="Practitioners"
                  datas={practitioners}
                  setFieldValue={setFieldValue}
                  value={values.practitionerId}
                  practitionerId={practitionerId}
                  setPractitionerId={setPractitionerId}
                />
              )}
              {!isPatientsLoading && (
                <SelectField
                  name="patientId"
                  label="Patients"
                  datas={patients}
                  setFieldValue={setFieldValue}
                  value={values.patientId}
                />
              )}
              {!isAvailabilitiesLoading &&
                !!practitionerId &&
                practitionerId === values.practitionerId && (
                  <SelectField
                    name="availabilitiesId"
                    label="Availabilities"
                    datas={availabilities}
                    setFieldValue={setFieldValue}
                    value={values.availabilitiesId}
                  />
                )}
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!isValid}
              >
                Submit
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AppointmentForm;
