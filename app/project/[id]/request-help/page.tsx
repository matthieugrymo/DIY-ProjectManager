"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, MapPin, Star, Phone, Mail, Calendar, CheckCircle } from "lucide-react"
import Link from "next/link"

interface Contractor {
  id: string
  name: string
  specialty: string
  rating: number
  reviews: number
  location: string
  phone: string
  email: string
  hourlyRate: string
  availability: string
  image: string
  verified: boolean
  description: string
}

const mockContractors: Contractor[] = [
  {
    id: "1",
    name: "Mike's Tile & Flooring",
    specialty: "Tile Installation",
    rating: 4.8,
    reviews: 127,
    location: "2.3 miles away",
    phone: "(555) 123-4567",
    email: "mike@tilesolutions.com",
    hourlyRate: "$45-65/hr",
    availability: "Available this week",
    image: "/construction-site-overview.png",
    verified: true,
    description: "Specializing in kitchen and bathroom tile work with 15+ years experience",
  },
  {
    id: "2",
    name: "Pro Kitchen Renovations",
    specialty: "Kitchen Remodeling",
    rating: 4.9,
    reviews: 89,
    location: "1.8 miles away",
    phone: "(555) 987-6543",
    email: "info@prokitchen.com",
    hourlyRate: "$55-75/hr",
    availability: "Available next week",
    image: "/kitchen-contractor.jpg",
    verified: true,
    description: "Full-service kitchen renovations including backsplash installation",
  },
  {
    id: "3",
    name: "Handyman Heroes",
    specialty: "General Contracting",
    rating: 4.6,
    reviews: 203,
    location: "3.1 miles away",
    phone: "(555) 456-7890",
    email: "help@handymanheroes.com",
    hourlyRate: "$35-50/hr",
    availability: "Available today",
    image: "/handyman-fixing-sink.png",
    verified: false,
    description: "Reliable handyman services for all your home improvement needs",
  },
]

export default function RequestHelpPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedContractor, setSelectedContractor] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [urgentHelp, setUrgentHelp] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmitRequest = async () => {
    if (!selectedContractor) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Redirect back to project after 3 seconds
    setTimeout(() => {
      router.push(`/project/${params.id}`)
    }, 3000)
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Sent Successfully!</h1>
            <p className="text-gray-600">
              Your help request has been sent to the contractor. They will contact you within 24 hours.
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="text-sm text-emerald-800">
              <strong>Next steps:</strong> The contractor will review your project details and reach out to schedule a
              consultation.
            </p>
          </div>
          <Button onClick={() => router.push(`/project/${params.id}`)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Project
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href={`/project/${params.id}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Project
          </Button>
        </Link>
      </div>

      {/* Page Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Request Professional Help</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connect with verified contractors in your area who specialize in your project type. Get expert help to
          complete your DIY project safely and efficiently.
        </p>
      </div>

      {/* Contractors List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Available Contractors</h2>

        {mockContractors.map((contractor) => (
          <Card
            key={contractor.id}
            className={`cursor-pointer transition-all ${
              selectedContractor === contractor.id ? "ring-2 ring-emerald-500 bg-emerald-50" : "hover:shadow-md"
            }`}
            onClick={() => setSelectedContractor(contractor.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={contractor.image || "/placeholder.svg"}
                  alt={contractor.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{contractor.name}</h3>
                        {contractor.verified && (
                          <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-emerald-600 font-medium">{contractor.specialty}</p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{contractor.rating}</span>
                        <span className="text-gray-500 text-sm">({contractor.reviews})</span>
                      </div>
                      <p className="text-sm text-gray-600">{contractor.hourlyRate}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm">{contractor.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {contractor.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {contractor.availability}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Phone className="h-4 w-4" />
                      {contractor.phone}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Mail className="h-4 w-4" />
                      {contractor.email}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Request Form */}
      {selectedContractor && (
        <Card>
          <CardHeader>
            <CardTitle>Send Request</CardTitle>
            <CardDescription>Provide details about your project and when you need help</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Project Details & Message</label>
              <Textarea
                placeholder="Describe what help you need with your kitchen backsplash project..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="urgent" checked={urgentHelp} onCheckedChange={setUrgentHelp} />
              <label htmlFor="urgent" className="text-sm text-gray-700">
                This is urgent - I need help within 24 hours
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• The contractor will receive your project details</li>
                <li>• They'll contact you within 24 hours to discuss</li>
                <li>• You can schedule a consultation or get a quote</li>
                <li>• No commitment required until you agree to hire</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSubmitRequest} disabled={!message.trim() || isSubmitting} className="flex-1">
                {isSubmitting ? "Sending Request..." : "Send Request"}
              </Button>
              <Button variant="outline" onClick={() => setSelectedContractor(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
