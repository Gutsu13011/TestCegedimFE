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
  createAppointment,
  setIsSubmit,
  isPractitionersLoading,
  isPatientsLoading,
  isAvailabilitiesLoading,
  updateForm,
  onResetForm,
  isUpload,
  updateAppointment,
  onSubmitAppointmentForm,
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
    <div datacy="appointment-form">
      <Formik
        initialValues={initialValues}
        onSubmit={(props) => {
          const { startDate, endDate } = availabilities.find(
            (av: any) => av.id === Number(props.availabilitiesId),
          );

          if (!isUpload) {
            createAppointment({
              practitionerId: props.practitionerId,
              patientId: props.patientId,
              startDate,
              endDate,
            });
            setIsSubmit(true);
          } else {
            updateAppointment({
              practitionerId: props.practitionerId,
              patientId: props.patientId,
              endDate,
              startDate,
              id: updateForm?.appointmentId,
            });
            onSubmitAppointmentForm({
              practitionerId: null,
              patientId: null,
              appointmentId: null,
            });
          }
        }}
      >
        {({ setFieldValue, values }) => {
          const isValid = isSubmitDisabled(values);

          if (
            updateForm?.practitionerId &&
            values?.practitionerId !== updateForm?.practitionerId
          ) {
            setFieldValue('practitionerId', updateForm.practitionerId);
          }
          if (
            updateForm?.patientId &&
            values?.patientId !== updateForm?.patientId
          ) {
            setFieldValue('patientId', updateForm.patientId);
          }

          if (
            updateForm?.practitionerId &&
            updateForm?.patientId &&
            values?.practitionerId === updateForm?.practitionerId &&
            values?.patientId === updateForm?.patientId
          ) {
            onResetForm();
          }

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
                {!isUpload ? 'Submit' : 'Update'}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AppointmentForm;
