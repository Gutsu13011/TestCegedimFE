import AppointmentForm from 'components/AppointmentForm';
import AppointmentList from 'components/AppointmentList';
import Section from 'components/Section';
import AllTasks from 'components/AllTasks';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPatients,
  getPractitioners,
  getAvailabilities,
  practitionersSelectors,
  patientsSelector,
  availabilitiesSelector,
} from 'store/appointmentForm';

const AppointmentsPage = () => {
  const dispatch = useDispatch();
  const practitioners = useSelector((state) =>
    practitionersSelectors.selectAll(state.appointmentForm.practitioners),
  );
  const patients = useSelector((state) =>
    patientsSelector.selectAll(state.appointmentForm.patients),
  );
  const availabilities = useSelector((state) =>
    availabilitiesSelector.selectAll(state.appointmentForm.availabilities),
  );
  const [practictionerId, setPractitionerId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [availabilitiesId, setAvailabilitiesId] = useState('');

  const setIds = (name, value) => {
    switch (name) {
      case 'practitionerId':
        setPractitionerId(value);
        break;
      case 'patientId':
        setPatientId(value);
        break;
      case 'availabilitiesId':
        setAvailabilitiesId(value);
        break;
      default:
        console.log('DEFAULT CASE', value);
    }
  };

  useEffect(() => {
    dispatch(getPractitioners());
    dispatch(getPatients());

    if (practictionerId) {
      dispatch(getAvailabilities(practictionerId));
    }
  }, [practictionerId]);

  return (
    <div className="appointment page">
      <h1>Appointments</h1>
      <Section
        name="instructions"
        title="Instructions"
        className="instructions"
      >
        <p>
          To book an appointment, we have to set the following required
          informations: the practitioner, the patient and date.
        </p>
        <p>
          The backend implementation is already done, you have all necessary
          routes to work and implement requested features.
        </p>
        <p>
          In first you have to create the appointment form. You are free to use
          the validation form that you want like Formik or React-hook-form.
        </p>
        <p>
          In the second time, you will show the list of all created appointments
          on the right side
        </p>
        <p>
          We don't have mock ups, you have to design your own solution and
          propose a simple workflow for users. It also should be responsive.
        </p>
        <p>
          We expect you to implement two bonus features: you can choose among
          the suggested features in the bonus section or choose to implement one
          of your choice.
        </p>
      </Section>
      <AllTasks className="goals" />
      <div className="structurePage">
        <Section
          name="appointment-form"
          title="Appointment Form"
          className="appointment__form"
        >
          <AppointmentForm
            practitioners={practitioners}
            patients={patients}
            availabilities={availabilities}
            setIds={setIds}
            practictionerId={practictionerId}
          />
        </Section>
        <Section
          name="appointment-list"
          title="Appointment List"
          className="appointment__list"
        >
          <AppointmentList />
        </Section>
      </div>
    </div>
  );
};

AppointmentsPage.pageTitle = 'Appointments';
AppointmentsPage.pageSubtitle = "Let's get to work 👩‍💻";

export default AppointmentsPage;
