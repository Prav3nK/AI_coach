'use client'

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface InterviewSummary {
  user_profile: {
    name: string;
    experience_level: string;
    domain: string;
  };
  responses: Array<{
    question: string;
    answer: string;
    audio_transcription?: string;
    feedback: {
      clarity_score: number;
      relevance_score: number;
      confidence_score: number;
      improvement_tips: string[];
    };
  }>;
}

interface InterviewSummaryProps {
  interviewId: string;
  onStartNew: () => void;
}

// Custom colors for the pie charts
const COLORS = {
  clarity: '#0088FE', // Blue for clarity
  relevance: '#00C49F', // Green for relevance
  confidence: '#FFBB28', // Orange for confidence
  remaining: '#F0F0F0', // Greyish-white for the remaining area
};

export default function InterviewSummary({ interviewId, onStartNew }: InterviewSummaryProps) {
  const [summary, setSummary] = useState<InterviewSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`http://localhost:8000/interview_summary/${interviewId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch summary');
        }
        const data = await response.json();
        setSummary(data);
      } catch (error) {
        console.error('Error fetching summary:', error);
        alert('Failed to load interview summary. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [interviewId]);

  if (isLoading) {
    return <div>Loading summary...</div>;
  }

  if (!summary) {
    return <div>Failed to load summary. Please try again.</div>;
  }

  const feedbackData = summary.responses.map((response, index) => {
    return {
      question: `Question ${index + 1}`,
      clarity: response.feedback.clarity_score,
      relevance: response.feedback.relevance_score,
      confidence: response.feedback.confidence_score,
    };
  });

  // Calculate average scores for clarity, relevance, and confidence
  const clarityScore = feedbackData.reduce((acc, curr) => acc + curr.clarity, 0) / feedbackData.length;
  const relevanceScore = feedbackData.reduce((acc, curr) => acc + curr.relevance, 0) / feedbackData.length;
  const confidenceScore = feedbackData.reduce((acc, curr) => acc + curr.confidence, 0) / feedbackData.length;

  // Prepare data for the pie charts
  const clarityData = [
    { name: 'Clarity', value: clarityScore },
    { name: 'Remaining', value: 100 - clarityScore }, // Remaining area
  ];
  const relevanceData = [
    { name: 'Relevance', value: relevanceScore },
    { name: 'Remaining', value: 100 - relevanceScore }, // Remaining area
  ];
  const confidenceData = [
    { name: 'Confidence', value: confidenceScore },
    { name: 'Remaining', value: 100 - confidenceScore }, // Remaining area
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        <p>Name: {summary.user_profile.name}</p>
        <p>Experience Level: {summary.user_profile.experience_level}</p>
        <p>Domain: {summary.user_profile.domain}</p>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Feedback Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Clarity Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Clarity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={clarityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60} // Hollow center for donut effect
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => name === 'Clarity' ? `${value.toFixed(1)}%` : ''} // Show percentage label only for Clarity
                  >
                    {clarityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.name === 'Clarity' ? COLORS.clarity : COLORS.remaining}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Relevance Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Relevance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={relevanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60} // Hollow center for donut effect
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => name === 'Relevance' ? `${value.toFixed(1)}%` : ''} // Show percentage label only for Relevance
                  >
                    {relevanceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.name === 'Relevance' ? COLORS.relevance : COLORS.remaining}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Confidence Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={confidenceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60} // Hollow center for donut effect
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => name === 'Confidence' ? `${value.toFixed(1)}%` : ''} // Show percentage label only for Confidence
                  >
                    {confidenceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.name === 'Confidence' ? COLORS.confidence : COLORS.remaining}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Improvement Tips</h2>
        {summary.responses.map((response, index) => (
          <Card key={index} className="mb-4">
            <CardHeader>
              <CardTitle>Question {index + 1}: {response.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="font-bold">Improvement Tips:</h4>
              <ul className="list-disc pl-5">
                {response.feedback.improvement_tips.map((tip, tipIndex) => (
                  <li key={tipIndex}>{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button onClick={onStartNew}>Start New Interview</Button>
      </div>
    </div>
  );
}