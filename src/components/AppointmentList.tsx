import { memo } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  List,
  Typography,
  Button,
} from '@material-ui/core';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { formatDateRange } from 'utils/date';
import DialogDelete from 'components/DialogDelete';

const getAppointmentListDatacy = (id: string) => `appointment-${id}`;

const AppointmentList = ({
  appointments,
  getPractitionerName,
  getPatientName,
  isAppointmentsLoading,
  deleteAppointment,
  onSubmitAppointmentForm,
  setIsUpload,
}) => {
  const onClickUpload = (patientId, practitionerId, appointmentId) => {
    onSubmitAppointmentForm({
      patientId,
      practitionerId,
      appointmentId,
    });
    setIsUpload(true);
  };

  return (
    <List className="appointments" datacy="appointment-list">
      {!isAppointmentsLoading && appointments?.length > 0 ? (
        appointments?.map((item) => (
          <Card
            key={item.id}
            className="appointment__item btn"
            datacy={getAppointmentListDatacy(item.id)}
          >
            <CardHeader
              avatar={<CalendarTodayIcon />}
              title={
                <Typography
                  datacy={`${getAppointmentListDatacy(item.id)}-range`}
                >
                  {formatDateRange({
                    from: new Date(item.startDate),
                    to: new Date(item.endDate),
                  })}
                </Typography>
              }
            />
            <CardContent>
              <Typography>{`Practitioner Name: ${getPractitionerName(
                item?.practitionerId,
              )}`}</Typography>
              <Typography>{`Patient Name: ${getPatientName(
                item?.patientId,
              )}`}</Typography>
            </CardContent>
            <CardActions>
              <DialogDelete
                patientName={getPatientName(item?.patientId)}
                appointmentId={item?.id}
                deleteAppointment={deleteAppointment}
              />
              <Button
                color="primary"
                onClick={() =>
                  onClickUpload(item?.patientId, item?.practitionerId, item?.id)
                }
              >
                Update
              </Button>
            </CardActions>
          </Card>
        ))
      ) : (
        <div>There is no appointment here</div>
      )}
    </List>
  );
};

export default memo(AppointmentList);
