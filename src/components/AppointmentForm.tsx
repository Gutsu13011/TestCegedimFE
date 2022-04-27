import { withStyles, Typography, Button } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { formatDateRange, getAge } from '../utils/date';
import CheckIcon from '@material-ui/icons/Check';
interface Form {
  practitionerId: string;
  patientId: string;
  availabilitiesId: string;
}

const styles = () => ({
  select: {
    maxWidth: 350,
    marginBottom: 15,
  },
  button: {
    maxWidth: 200,
    marginLeft: 15,
    marginBottom: 15,
    height: 20,
  },
  icon: {
    marginRight: 10,
    marginBottom: 15,
  },
  iconWarning: {
    color: 'red',
  },
  iconSuccess: {
    color: 'green',
  },
});

const AppointmentForm = ({
  classes,
  practitioners,
  patients,
  availabilities,
  setPractitionerId,
  practitionerId,
  onSubmitAppointmentForm,
  createAppointment,
  setIsSubmit,
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

  const SelectField = ({ label, name, datas, setFieldValue, value }) => {
    return (
      <>
        <Typography>{label}</Typography>
        <div>
          {name === 'practitionerId' && (
            <CheckIcon
              className={`${
                practitionerId && practitionerId === value
                  ? classes.iconSuccess
                  : classes.iconWarning
              } ${classes.icon}`}
            />
          )}
          <Field
            as="select"
            name={name}
            className={classes.select}
            placeholder="select an industry"
            onChange={(evt) => {
              setFieldValue(name, evt.target.value);
              if (name === 'practitionerId') {
                setFieldValue('availabilitiesId', '');
              }
            }}
          >
            <option key={name}></option>
            {datas.map((data) => (
              <option key={data.id} value={data.id}>
                {name !== 'availabilitiesId'
                  ? `${data.firstName} ${data.lastName} - ${
                      data.speciality || getAge(data.birthDate)
                    }`
                  : `${formatDateRange({
                      from: data.startDate,
                      to: data.endDate,
                    })}`}
              </option>
            ))}
          </Field>
          {name === 'practitionerId' && value && (
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => {
                setPractitionerId(value);
              }}
            >
              See Availabilities
            </Button>
          )}
        </div>
      </>
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
              <SelectField
                name="practitionerId"
                label="Practitioners"
                datas={practitioners}
                setFieldValue={setFieldValue}
                value={values.practitionerId}
              />
              <SelectField
                name="patientId"
                label="Patients"
                datas={patients}
                setFieldValue={setFieldValue}
                value={values.patientId}
              />
              {!!practitionerId && practitionerId === values.practitionerId && (
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

export default withStyles(styles, { name: 'AppointmentForm' })(AppointmentForm);
