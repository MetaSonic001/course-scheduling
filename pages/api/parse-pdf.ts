import { NextApiRequest, NextApiResponse } from 'next'
import { PDFExtract } from 'pdf.js-extract'
import { allocateRooms } from '../../utils/roomAllocation'

const pdfExtract = new PDFExtract()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { pdfBuffer } = req.body
      
      const data = await pdfExtract.extractBuffer(Buffer.from(pdfBuffer))
      
      // Process the extracted data and create a schedule
      const { schedule, courses } = processExtractedData(data)
      
      // Mock rooms data (replace with actual data from your system)
      const rooms = [
        { number: '101', capacity: 30 },
        { number: '102', capacity: 50 },
        { number: '103', capacity: 100 },
        { number: '104', capacity: 200 },
      ]

      // Allocate rooms
      const roomAllocation = allocateRooms(courses, rooms)

      // Add room allocation to the schedule
      const finalSchedule = schedule.map(item => ({
        ...item,
        room: roomAllocation.get(item.course) || 'Not allocated'
      }))

      res.status(200).json({ schedule: finalSchedule })
    } catch (error) {
      res.status(500).json({ error: 'Error processing PDF' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

function processExtractedData(data: any) {
  // This is a simplified implementation. You'll need to adjust this based on your PDF structure.
  const schedule = []
  const courses = []

  data.pages.forEach((page: any) => {
    page.content.forEach((item: any) => {
      if (item.str.match(/^[A-Z]{2}\d{3}/)) { // Assume course codes are like CS101
        const course = {
          name: item.str,
          expectedEnrollment: Math.floor(Math.random() * 100) + 20 // Mock data
        }
        courses.push(course)
        schedule.push({
          course: item.str,
          day: 'Monday', // You'll need to extract this from the PDF
          time: '9:00 AM', // You'll need to extract this from the PDF
        })
      }
    })
  })

  return { schedule, courses }
}