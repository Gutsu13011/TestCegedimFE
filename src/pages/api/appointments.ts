import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      const appointments = await prisma.appointment.findMany();
      res.status(200).json(appointments);
      break;
    case 'POST':
      const { patientId, practitionerId, startDate, endDate } = JSON.parse(
        req.body,
      );
      const appointment = await prisma.appointment.create({
        data: {
          patientId: parseInt(patientId),
          practitionerId: parseInt(practitionerId),
          startDate: startDate,
          endDate: endDate,
        },
      });
      res.status(200).json(appointment);
      break;
    case 'DELETE':
      const id = JSON.parse(req.body);
      const appointmentToDelete = await prisma.appointment.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.status(200).json(appointmentToDelete);
      break;
    case 'UPDATE':
      const appointmentToUpdate = await prisma.appointment.update({
        where: {
          id: parseInt(id),
        },
        data: {
          patientId: parseInt(patientId),
          practitionerId: parseInt(practitionerId),
          startDate: startDate,
          endDate: endDate,
        },
      });
      res.status(200).json(appointmentToUpdate);
      break;
  }
};
