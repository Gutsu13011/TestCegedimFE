import {
  Card,
  CardContent,
  CardHeader,
  List,
  Typography,
} from '@material-ui/core';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { formatDateRange } from 'utils/date';

const AppointmentList = ({
  appointments,
  getPractitionerName,
  getPatientName,
}) => {
  console.log('appointments', appointments);
  return (
    <List className="timeSlots">
      {appointments.map((item) => (
        <Card key={item.id} className="timeSlot__item btn">
          <CardHeader
            avatar={<CalendarTodayIcon />}
            title={
              <Typography>
                {formatDateRange({
                  from: new Date(item.startDate),
                  to: new Date(item.endDate),
                })}
              </Typography>
            }
          />
          <CardContent>
            <Typography>{`Practitioner Name: ${getPractitionerName(
              item.practitionerId,
            )}`}</Typography>
            <Typography>{`Patient Name: ${getPatientName(
              item.patientId,
            )}`}</Typography>
          </CardContent>
        </Card>
      ))}
    </List>
  );
};

export default AppointmentList;
