import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { 
  Github, 
  Linkedin, 
  Users,
  Rocket,
  Layout,
  Server,
  Database,
  Wrench,
  Code,
  MonitorSmartphone,
  Cpu,
  Terminal
} from "lucide-react"

export default function AboutPage() {
  const team = [
    {
      name: "IMAD EL KHELYFY",
      role: "Data Scientist & AI Student",
      image: "/team/imad.jpg",
      github: "https://github.com/IMADELKHELYFY",
      linkedin: "https://www.linkedin.com/in/imad-el-khelyfy-4514ba312/",
      bgColor: "bg-blue-500/80"
    },
    {
      name: "HAMZA EL JMILI",
      role: "Data Scientist & AI Student",
      image: "/team/hamza.jpg",
      github: "https://github.com/hamza-github",
      linkedin: "https://linkedin.com/in/hamza-linkedin",
      bgColor: "bg-green-500/80"
    },
    {
      name: "ANAS OUCHTOUBANE",
      role: "Data Scientist & AI Student",
      image: "/team/anas.jpg",
      github: "https://github.com/anas-github",
      linkedin: "https://linkedin.com/in/anas-linkedin",
      bgColor: "bg-red-500/80"
    }
  ]

  const technologies = [
    { 
      name: "Frontend", 
      items: ["Next.js 14", "TypeScript", "Tailwind CSS", "Recharts", "Shadcn UI"] 
    },
    { 
      name: "Backend", 
      items: ["Python", "FastAPI", "Machine Learning Models", "Scikit-learn"] 
    },
    { 
      name: "Database", 
      items: ["PostgreSQL", "Prisma", "SQLAlchemy"] 
    },
    { 
      name: "Tools", 
      items: ["Git", "VS Code", "Docker", "Jupyter Notebooks"] 
    }
  ]

  return (
    <div className="bg-[#0A0F1E] min-h-screen text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header with gradient */}
        <div className="text-center mb-16 bg-gradient-to-r from-blue-600/20 via-blue-400/20 to-blue-600/20 rounded-2xl p-8">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white">
            About GuardianFlow
          </h1>
          <p className="text-lg text-blue-200">
            Advanced Financial Transaction Monitoring System
          </p>
        </div>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-white flex items-center">
            <span className="bg-blue-500/20 rounded-lg p-2 mr-2">
              <Users className="w-6 h-6 text-blue-400" />
            </span>
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card 
                key={index} 
                className="border-none overflow-hidden bg-gradient-to-b from-[#1E293B] to-[#0F172A] hover:from-blue-900/50 hover:to-[#1E293B] transition-all duration-300"
              >
                <CardContent className="p-0">
                  <div className="w-full aspect-square relative">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-center"
                      priority
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6 text-center bg-[#0F172A]">
                    <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                    <p className="text-blue-200 mb-4 text-lg">{member.role}</p>
                    
                    <div className="flex justify-center space-x-4">
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/10 p-2 rounded-full hover:bg-blue-500/20 transition-colors"
                      >
                        <Github className="w-5 h-5 text-blue-100" />
                      </a>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/10 p-2 rounded-full hover:bg-blue-500/20 transition-colors"
                      >
                        <Linkedin className="w-5 h-5 text-blue-100" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Project Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-white flex items-center">
            <span className="bg-blue-500/20 rounded-lg p-2 mr-2">
              <Rocket className="w-6 h-6 text-blue-400" />
            </span>
            Project Overview
          </h2>
          <Card className="border-none bg-gradient-to-br from-[#1E293B] to-[#0F172A]">
            <CardContent className="p-8">
              <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                GuardianFlow is an advanced financial transaction monitoring system designed to detect
                and prevent money laundering activities. Our team developed this system as part of our
                final year project, combining machine learning algorithms with real-time data analysis
                to identify suspicious patterns and transactions. The system provides comprehensive
                visualization tools and detailed analytics to help financial institutions maintain
                security and compliance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-blue-900/20 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <MonitorSmartphone className="w-5 h-5 text-blue-400 mr-2" />
                    <h3 className="text-xl font-bold text-blue-300">Frontend</h3>
                  </div>
                  <ul className="space-y-3">
                    {technologies[0].items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-blue-100 flex items-center">
                        <Code className="w-4 h-4 text-blue-400 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-900/20 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <Server className="w-5 h-5 text-blue-400 mr-2" />
                    <h3 className="text-xl font-bold text-blue-300">Backend</h3>
                  </div>
                  <ul className="space-y-3">
                    {technologies[1].items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-blue-100 flex items-center">
                        <Cpu className="w-4 h-4 text-blue-400 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-900/20 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <Database className="w-5 h-5 text-blue-400 mr-2" />
                    <h3 className="text-xl font-bold text-blue-300">Database</h3>
                  </div>
                  <ul className="space-y-3">
                    {technologies[2].items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-blue-100 flex items-center">
                        <Code className="w-4 h-4 text-blue-400 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-900/20 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <Wrench className="w-5 h-5 text-blue-400 mr-2" />
                    <h3 className="text-xl font-bold text-blue-300">Tools</h3>
                  </div>
                  <ul className="space-y-3">
                    {technologies[3].items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-blue-100 flex items-center">
                        <Terminal className="w-4 h-4 text-blue-400 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Back Button */}
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/25"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
} 