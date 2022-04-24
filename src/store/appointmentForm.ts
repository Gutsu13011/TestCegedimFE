import { Practitioner, Patient, Availability } from '@prisma/client';
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

export const practitionersSelectors = practitionersAdapter.getSelectors();
export const patientsSelector = patientsAdapter.getSelectors();
export const availabilitiesSelector = availabilitiesAdapter.getSelectors();

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
    resultForm: {
      practitionerId: null,
      patientId: null,
      availabilitiesId: null,
    },
  },
  reducers: {
    onSubmitAppointmentFormAction: {
      reducer: (state, { payload }) => ({
        ...state,
        resultForm: {
          practitionerId: payload.practitionerId,
          patientId: payload.patientId,
          availabilitiesId: payload.availabilitiesId,
        },
      }),
      prepare: (payload) => {
        return { payload };
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
    builder.addCase(getPractitioners.rejected, (state, action) => {
      state.practitioners.error = action.error;
      state.practitioners.loading = false;
    });
    builder.addCase(getPatients.rejected, (state, action) => {
      state.patients.error = action.error;
      state.patients.loading = false;
    });
    builder.addCase(getAvailabilities.rejected, (state, action) => {
      state.patients.error = action.error;
      state.patients.loading = false;
    });
  },
});

export const { onSubmitAppointmentFormAction } = appointmentFormSlice.actions;
export default appointmentFormSlice;
