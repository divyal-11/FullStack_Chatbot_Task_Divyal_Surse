import { PrismaClient, Status, UserType } from "@prisma/client";


const prisma = new PrismaClient();

const sampleEnquiries = [
  {
    name: "Aarav Sharma",
    email: "aarav.sharma@gmail.com",
    phone: "+91 98765 43210",
    userType: UserType.STUDENT,
    interest: "DGCA Certified Drone Pilot Training",
    message: "Hi, I am interested in enrolling in the upcoming DGCA commercial drone pilot training batch. Could you share the schedule and fee structure?",
    status: Status.NEW,
  },
  {
    name: "Priya Patel",
    email: "priya.patel@agrotech-solutions.com",
    phone: "+91 91234 56789",
    userType: UserType.CUSTOMER,
    interest: "Precision Agriculture Drone Surveying",
    message: "We need multispectral aerial drone mapping for a 500-acre agricultural project in Gujarat. Please arrange a consultation call with your surveying team.",
    status: Status.CONTACTED,
  },
  {
    name: "Vikram Malhotra",
    email: "vikram.m@skyline-infra.in",
    phone: "+91 99887 76655",
    userType: UserType.CUSTOMER,
    interest: "Industrial Thermal Inspection",
    message: "Requesting a quote for thermal and structural drone inspection of a 220kV transmission line and substation assets.",
    status: Status.IN_PROGRESS,
  },
  {
    name: "Ananya Deshmukh",
    email: "ananya.deshmukh@vit.edu",
    phone: "+91 98450 12345",
    userType: UserType.STUDENT,
    interest: "Drone Mapping & GIS Photogrammetry Course",
    message: "Final year civil engineering student looking for practical photogrammetry & LiDAR training. Do you offer student group discounts?",
    status: Status.NEW,
  },
  {
    name: "Rohan Kapoor",
    email: "rohan.films@studio-cinematics.com",
    phone: "+91 97112 34567",
    userType: UserType.CUSTOMER,
    interest: "Aerial Cinematography & Video Production",
    message: "Looking for FPV and heavy-lifter cinema drone operators for a 4-day commercial shoot in Rajasthan next month.",
    status: Status.CLOSED,
  },
  {
    name: "Neha Sundaram",
    email: "neha.sundaram@gmail.com",
    phone: "+91 94440 98765",
    userType: UserType.STUDENT,
    interest: "Drone Hardware Assembly & Maintenance Bootcamp",
    message: "I want to register for the weekend hardware engineering workshop. Is prior electronics background required?",
    status: Status.CONTACTED,
  },
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@mining-corp.in",
    phone: "+91 93123 45678",
    userType: UserType.CUSTOMER,
    interest: "Volumetric Stockpile Calculation & Topographic Survey",
    message: "We require periodic volumetric stockpile surveys for open-pit mining operations. Looking for a long-term service contract.",
    status: Status.IN_PROGRESS,
  },
  {
    name: "Sameer Joshi",
    email: "sameer.joshi@urban-planners.org",
    phone: "+91 98200 11223",
    userType: UserType.OTHER,
    interest: "Institutional Partnership & R&D",
    message: "Interested in establishing a joint Drone Center of Excellence for smart city spatial mapping and research.",
    status: Status.NEW,
  },
];

async function main() {
  console.log("🌱 Seeding database with realistic DroneTV enquiries...");

  await prisma.enquiry.deleteMany({});

  for (const item of sampleEnquiries) {
    const created = await prisma.enquiry.create({ data: item });
    console.log(`  ✓ Created [${created.userType}] enquiry from ${created.name} (${created.status})`);
  }

  console.log(`\n✅ Database successfully seeded with ${sampleEnquiries.length} enquiries!`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
