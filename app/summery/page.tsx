'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface InterviewSummary {
  user_profile: {
    name: string
    experience_level: string
    domain: string
  }
  responses: Array<{
    question: string
    answer: string
    feedback: {
      clarity_score: number
      relevance_score: number
      confidence_score: number
      improvement_tips: string[]
    }
  }>
}

export default function SummaryPage() {
  const [summary, setSummary] = useState<InterviewSummary | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:8000/interview_summary')
        if (!response.ok) {
          throw new Error('Failed to fetch summary')
        }
        const data = await response.json()
        setSummary(data)
      } catch (error) {
        console.error('Error fetching summary:', error)
        alert('Failed to load interview summary. Please try again.')
      }
    }

    fetchSummary()
  }, [])

  if (!summary) {
    return <div>Loading summary...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Interview Summary</CardTitle>
          <CardDescription>Review your performance and feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">User Profile</h2>
          <p>Name: {summary.user_profile.name}</p>
          <p>Experience Level: {summary.user_profile.experience_level}</p>
          <p>Domain: {summary.user_profile.domain}</p>

          <h2 className="text-xl font-bold mt-6 mb-4">Interview Responses</h2>
          {summary.responses.map((response, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <h3 className="font-bold">Question {index + 1}: {response.question}</h3>
              <p className="mt-2"><strong>Your Answer:</strong> {response.answer}</p>
              <div className="mt-4">
                <h4 className="font-bold">Feedback:</h4>
                <p>Clarity: {response.feedback.clarity_score.toFixed(2)}</p>
                <p>Relevance: {response.feedback.relevance_score.toFixed(2)}</p>
                <p>Confidence: {response.feedback.confidence_score.toFixed(2)}</p>
                <h5 className="font-bold mt-2">Improvement Tips:</h5>
                <ul className="list-disc pl-5">
                  {response.feedback.improvement_tips.map((tip, tipIndex) => (
                    <li key={tipIndex}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="mt-6 text-center">
        <Button onClick={() => router.push('/')}>Start New Interview</Button>
      </div>
    </div>
  )
}

