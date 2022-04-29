import {
  Practitioner,
  Patient,
  Availability,
  Appointment,
} from '@prisma/client';
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import config from 'config';
import { parseIds } from 'store/utils';

const SERVER_API_ENDPOINT = config.get('SERVER_API_ENDPOING', '/api');

export const getPractitioners = createAsyncThunk(
  'getPractitioners',
  async () => {
    const response = await fetch(`${SERVER_API_ENDPOINT}/practitioners`);
    const parsedResponse = await response.json();
    return parseIds(parsedResponse) as Practitioner[];
  },
);

export const getPatients = createAsyncThunk('getPatients', async () => {
  const response = await fetch(`${SERVER_API_ENDPOINT}/patients`);
  const parsedResponse = await response.json();
  return parseIds(parsedResponse) as Patient[];
});

export const getAvailabilities = createAsyncThunk(
  'getAvailabilities',
  async (practionnerId: string) => {
    const response = await fetch(
      `${SERVER_API_ENDPOINT}/availabilities?practitionerId=${practionnerId}`,
    );
    const parsedResponse = await response.json();
    return parseIds(parsedResponse) as Availability[];
  },
);

export const getAppointments = createAsyncThunk('getAppointments', async () => {
  const response = await fetch(`${SERVER_API_ENDPOINT}/appointments`);
  const parsedResponse = await response.json();
  return parseIds(parsedResponse) as Appointment[];
});

export const createAppointment = createAsyncThunk(
  'createAppointment',
  async (payload: any) => {
    const { practitionerId, patientId, startDate, endDate } = payload;
    const params = {
      method: 'POST',
      body: { practitionerId, patientId, startDate, endDate },
    };
    params.body = JSON.stringify(params.body);
    const response = await fetch(`${SERVER_API_ENDPOINT}/appointments`, params);
    await response.json();
  },
);

export const deleteAppointment = createAsyncThunk(
  'deleteAppointment',
  async (appointmentId: string) => {
    const params = {
      method: 'DELETE',
      body: appointmentId,
    };
    params.body = JSON.stringify(params.body);
    const response = await fetch(`${SERVER_API_ENDPOINT}/appointments`, params);
    await response.json();
  },
);

export const updateAppointment = createAsyncThunk(
  'updateAppointment',
  async (payload: any) => {
    const { practitionerId, patientId, startDate, endDate, id } = payload;
    const params = {
      method: 'UPDATE',
      body: {
        practitionerId,
        patientId,
        startDate,
        endDate,
        id,
      },
    };
    params.body = JSON.stringify(params.body);
    const response = await fetch(`${SERVER_API_ENDPOINT}/appointments`, params);
    await response.json();
  },
);

const practitionersAdapter = createEntityAdapter<Practitioner>({
  sortComparer: (a, b) => a.id - b.id,
});
const patientsAdapter = createEntityAdapter<Patient>({
  sortComparer: (a, b) => a.id - b.id,
});
const availabilitiesAdapter = createEntityAdapter<Availability>({
  sortComparer: (a, b) =>
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
});
const appointmentsAdapter = createEntityAdapter<Appointment>({
  sortComparer: (a, b) => a.id - b.id,
});

export const practitionersSelectors = practitionersAdapter.getSelectors();
export const patientsSelectors = patientsAdapter.getSelectors();
export const availabilitiesSelectors = availabilitiesAdapter.getSelectors();
export const appointmentsSelectors = appointmentsAdapter.getSelectors();
export const updateFormSelector = (state) => state.appointmentForm.updateForm;

const appointmentFormSlice = createSlice({
  name: 'appointmentForm',
  initialState: {
    practitioners: practitionersAdapter.getInitialState({
      loading: false,
      error: null,
    }),
    patients: patientsAdapter.getInitialState({
      loading: false,
      error: null,
    }),
    availabilities: availabilitiesAdapter.getInitialState({
      loading: false,
      error: null,
    }),
    appointments: appointmentsAdapter.getInitialState({
      loading: false,
      error: null,
    }),
    updateForm: {
      practitionerId: null,
      patientId: null,
      appointmentId: null,
    },
  },
  reducers: {
    onSubmitAppointmentFormAction: {
      reducer(
        state,
        action: {
          payload: {
            practitionerId: string;
            patientId: string;
            appointmentId: string;
          };
        },
      ) {
        state.updateForm = {
          practitionerId: action.payload.practitionerId,
          patientId: action.payload.patientId,
          appointmentId: action.payload.appointmentId,
        };
      },
      prepare(payload: {
        practitionerId: string;
        patientId: string;
        appointmentId: string;
      }) {
        return { payload };
      },
    },
    onResetFormAction: {
      reducer(state) {
        state.updateForm = {
          practitionerId: null,
          patientId: null,
          appointmentId: state.updateForm.appointmentId,
        };
      },
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPractitioners.pending, (state) => {
      state.practitioners.loading = true;
    });
    builder.addCase(getPatients.pending, (state) => {
      state.patients.loading = true;
    });
    builder.addCase(getAvailabilities.pending, (state) => {
      state.availabilities.loading = true;
    });
    builder.addCase(getAppointments.pending, (state) => {
      state.appointments.loading = true;
    });
    builder.addCase(getPractitioners.fulfilled, (state, action) => {
      practitionersAdapter.setAll(state.practitioners, action.payload);
      state.practitioners.error = null;
      state.practitioners.loading = false;
    });
    builder.addCase(getPatients.fulfilled, (state, action) => {
      patientsAdapter.setAll(state.patients, action.payload);
      state.patients.error = null;
      state.patients.loading = false;
    });
    builder.addCase(getAvailabilities.fulfilled, (state, action) => {
      availabilitiesAdapter.setAll(state.availabilities, action.payload);
      state.availabilities.error = null;
      state.availabilities.loading = false;
    });
    builder.addCase(getAppointments.fulfilled, (state, action) => {
      appointmentsAdapter.setAll(state.appointments, action.payload);
      state.appointments.error = null;
      state.appointments.loading = false;
    });
    builder.addCase(getPractitioners.rejected, (state, action) => {
      state.practitioners.error = action.error;
      state.practitioners.loading = false;
    });
    builder.addCase(getPatients.rejected, (state, action) => {
      state.patients.error = action.error;
      state.patients.loading = false;
    });
    builder.addCase(getAvailabilities.rejected, (state, action) => {
      state.availabilities.error = action.error;
      state.availabilities.loading = false;
    });
    builder.addCase(getAppointments.rejected, (state, action) => {
      state.appointments.error = action.error;
      state.appointments.loading = false;
    });
  },
});

export const {
  onSubmitAppointmentFormAction,
  onResetFormAction,
} = appointmentFormSlice.actions;
export default appointmentFormSlice;
