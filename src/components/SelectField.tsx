import { memo } from 'react';
import { withStyles, Typography, Button } from '@material-ui/core';
import { Field } from 'formik';
import { formatDateRange, getAge } from '../utils/date';
import CheckIcon from '@material-ui/icons/Check';

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

const SelectField = ({
  label,
  name,
  datas,
  setFieldValue,
  value,
  practitionerId = null,
  setPractitionerId = null,
  classes,
}) => {
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

export default withStyles(styles, { name: 'SelectField' })(memo(SelectField));
