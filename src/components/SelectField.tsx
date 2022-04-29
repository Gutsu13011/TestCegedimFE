import React, { memo } from 'react';
import { withStyles, Typography, Button } from '@material-ui/core';
import { Field } from 'formik';
import { formatDateRange, getAge } from '../utils/date';
import CheckIcon from '@material-ui/icons/Check';

const styles = () => ({
  select: {
    width: 350,
    marginBottom: 15,
    borderRadius: 10,
  },
  selectSuccess: {
    borderColor: 'green',
  },
  selectError: {
    borderColor: 'red',
  },
  button: {
    maxWidth: 200,
    marginLeft: 15,
    marginBottom: 15,
    height: 20,
  },
  icon: {
    margin: '0 0 15px 10px',
  },
  iconWarning: {
    color: 'red',
  },
  iconSuccess: {
    color: 'green',
  },
  divMain: {
    display: 'block !important',
    marginTop: 10,
  },
  divIconFieldButon: {
    display: 'flex',
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
    <div className={classes.divMain} datacy={`selectField-${name}`}>
      <Typography>{label}</Typography>
      <div className={classes.divIconFieldButon}>
        <Field
          as="select"
          name={name}
          className={`${
            (practitionerId && practitionerId === value) ||
            (name !== 'practitionerId' && value)
              ? classes.selectSuccess
              : classes.selectError
          } ${classes.select}`}
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
                    from: new Date(data.startDate),
                    to: new Date(data.endDate),
                  })}`}
            </option>
          ))}
        </Field>
        {name === 'practitionerId' && (
          <CheckIcon
            className={`${
              practitionerId && practitionerId === value
                ? classes.iconSuccess
                : classes.iconWarning
            } ${classes.icon}`}
          />
        )}
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
    </div>
  );
};

export default withStyles(styles, { name: 'SelectField' })(memo(SelectField));
