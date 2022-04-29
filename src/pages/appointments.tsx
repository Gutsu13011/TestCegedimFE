import AppointmentForm from 'components/AppointmentForm';
import AppointmentList from 'components/AppointmentList';
import Section from 'components/Section';
import AllTasks from 'components/AllTasks';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPatients,
  getPractitioners,
  getAvailabilities,
  practitionersSelectors,
  patientsSelectors,
  availabilitiesSelectors,
  onSubmitAppointmentFormAction,
  appointmentsSelectors,
  getAppointments,
  createAppointment as createAppointmentAction,
  deleteAppointment as deleteAppointmentAction,
  updateAppointment as updateAppointmentAction,
  updateFormSelector,
  onResetFormAction,
} from 'store/appointmentForm';

const AppointmentsPage = () => {
  const dispatch = useDispatch();
  const onSubmitAppointmentForm = (payload) =>
    dispatch(onSubmitAppointmentFormAction(payload));
  const onResetForm = () => dispatch(onResetFormAction());
  const practitioners = useSelector((state) =>
    practitionersSelectors.selectAll(state.appointmentForm.practitioners),
  );
  const isPractitionersLoading = useSelector(
    (state) => state.appointmentForm.practitioners.loading,
  );
  const patients = useSelector((state) =>
    patientsSelectors.selectAll(state.appointmentForm.patients),
  );
  const isPatientsLoading = useSelector(
    (state) => state.appointmentForm.patients.loading,
  );
  const availabilities = useSelector((state) =>
    availabilitiesSelectors.selectAll(state.appointmentForm.availabilities),
  );
  const isAvailabilitiesLoading = useSelector(
    (state) => state.appointmentForm.availabilities.loading,
  );
  const appointments = useSelector((state) =>
    appointmentsSelectors.selectAll(state.appointmentForm.appointments),
  );
  const isAppointmentsLoading = useSelector(
    (state) => state.appointmentForm.appointments.loading,
  );
  const updateForm = useSelector((state) => updateFormSelector(state));
  const [practictionerId, setPractitionerId] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const getPractitionerName = useCallback(
    (practictionerId: string) => {
      const practitioner = practitioners?.find(
        (practitioner) => practictionerId === practitioner.id,
      );

      return `${practitioner?.firstName} ${practitioner?.lastName}` || ' - ';
    },
    [practitioners],
  );
  const getPatientName = useCallback(
    (patientId: string) => {
      const patient = patients?.find((patient) => patientId === patient.id);

      return `${patient?.firstName} ${patient?.lastName}` || ' - ';
    },
    [patients],
  );
  const createAppointment = (payload: any) => {
    dispatch(createAppointmentAction(payload));
  };
  const deleteAppointment = (id: string) => {
    dispatch(deleteAppointmentAction(id));
    setIsSubmit(true);
  };
  const updateAppointment = (payload: any) => {
    dispatch(updateAppointmentAction(payload));
  };

  useEffect(() => {
    dispatch(getPractitioners());
    dispatch(getPatients());
    dispatch(getAppointments());
  }, []);

  useEffect(() => {
    if (practictionerId) {
      dispatch(getAvailabilities(practictionerId));
    }
  }, [practictionerId]);

  useEffect(() => {
    if (isSubmit) {
      dispatch(getAppointments());
      setIsSubmit(false);
    }
  }, [isSubmit]);

  useEffect(() => {
    if (isUpload && !updateForm.appointmentId) {
      // dispatch(getAppointments());
      setIsUpload(false);
    }
  }, [isUpload, updateForm.appointmentId]);

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
            setPractitionerId={setPractitionerId}
            practitionerId={practictionerId}
            createAppointment={createAppointment}
            setIsSubmit={setIsSubmit}
            isPractitionersLoading={isPractitionersLoading}
            isPatientsLoading={isPatientsLoading}
            isAvailabilitiesLoading={isAvailabilitiesLoading}
            updateForm={updateForm}
            onResetForm={onResetForm}
            isUpload={isUpload}
            updateAppointment={updateAppointment}
            onSubmitAppointmentForm={onSubmitAppointmentForm}
          />
        </Section>
        <Section
          name="appointment-list"
          title="Appointment List"
          className="appointment__list"
        >
          <AppointmentList
            appointments={appointments}
            getPractitionerName={getPractitionerName}
            getPatientName={getPatientName}
            isAppointmentsLoading={isAppointmentsLoading}
            deleteAppointment={deleteAppointment}
            onSubmitAppointmentForm={onSubmitAppointmentForm}
            setIsUpload={setIsUpload}
          />
        </Section>
      </div>
    </div>
  );
};

AppointmentsPage.pageTitle = 'Appointments';
AppointmentsPage.pageSubtitle = "Let's get to work 👩‍💻";

export default AppointmentsPage;
