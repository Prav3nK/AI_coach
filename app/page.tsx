'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import InterviewSession from './components/InterviewSession'
import InterviewSummary from './components/InterviewSummary'

export default function Home() {
  const [name, setName] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [domain, setDomain] = useState('')
  const [interviewId, setInterviewId] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null)
  const [totalQuestions, setTotalQuestions] = useState<number>(0)
  const [showSummary, setShowSummary] = useState(false)

  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/start_interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, experience_level: experienceLevel, domain }),
      })
      if (!response.ok) {
        throw new Error('Failed to start interview')
      }
      const data = await response.json()
      setInterviewId(data.interview_id)
      setCurrentQuestion(data.question)
      setTotalQuestions(data.total_questions)
      setShowSummary(false)
    } catch (error) {
      console.error('Error starting interview:', error)
      alert('Failed to start interview. Please try again.')
    }
  }

  const handleInterviewComplete = () => {
    setShowSummary(true)
  }

  const handleStartNew = () => {
    setInterviewId(null)
    setCurrentQuestion(null)
    setTotalQuestions(0)
    setShowSummary(false)
    setName('')
    setExperienceLevel('')
    setDomain('')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>AI Soft Skills Coach</CardTitle>
          <CardDescription>Improve your interview skills with AI-powered feedback</CardDescription>
        </CardHeader>
        <CardContent>
          {!interviewId ? (
            <form onSubmit={handleStartInterview} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="experience">Experience Level</Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel} required>
                  <SelectTrigger id="experience">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="domain">Domain</Label>
                <Select value={domain} onValueChange={setDomain} required>
                  <SelectTrigger id="domain">
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="software_engineering">Software Engineering</SelectItem>
                    <SelectItem value="data_science">Data Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Start Interview</Button>
            </form>
          ) : showSummary ? (
            <InterviewSummary 
              interviewId={interviewId} 
              onStartNew={handleStartNew}
            />
          ) : (
            <InterviewSession 
              interviewId={interviewId} 
              initialQuestion={currentQuestion!} 
              totalQuestions={totalQuestions}
              onInterviewComplete={handleInterviewComplete}
            />
          )}
        </CardContent>
      </Card>
    </main>
  )
}
