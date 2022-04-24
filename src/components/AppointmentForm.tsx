import { withStyles, Typography, Button } from '@material-ui/core';
import { Field, Form, Formik, FormikProps } from 'formik';
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
  setIds,
  practictionerId,
}) => {
  const initialValues = {
    practitionerId: practitioners?.[0]?.id,
    patientId: patients?.[0]?.id,
    availabilitiesId: availabilities?.[0]?.id,
  };

  const SelectField = ({ label, name, datas, value }) => {
    return (
      <>
        <Typography>{label}</Typography>
        <div>
          {name === 'practitionerId' && (
            <CheckIcon
              className={`${
                practictionerId ? classes.iconSuccess : classes.iconWarning
              } ${classes.icon}`}
            />
          )}
          <Field as="select" name={name} className={classes.select}>
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
          {name === 'practitionerId' && (
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => setIds('practitionerId', value)}
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
        onSubmit={() => console.log('SUBMIT')}
        enableReinitialize={true}
      >
        {(props: FormikProps<Form>) => (
          <Form>
            {console.log('PROPS', props.values)}
            <SelectField
              name="practitionerId"
              label="Practitioners"
              datas={practitioners}
              value={Number(props.values.practitionerId)}
            />
            <SelectField
              name="patientId"
              label="Patients"
              datas={patients}
              value={Number(props.values.patientId)}
            />
            {!!practictionerId && (
              <SelectField
                name="availabilitiesId"
                label="Availabilities"
                datas={availabilities}
                value={Number(props.values.availabilitiesId)}
              />
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default withStyles(styles, { name: 'AppointmentForm' })(AppointmentForm);
