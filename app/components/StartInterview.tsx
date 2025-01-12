'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StartInterviewProps {
  onInterviewStart: (interviewId: string, firstQuestion: string, totalQuestions: number) => void;
}

export default function StartInterview({ onInterviewStart }: StartInterviewProps) {
  const [name, setName] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/start_interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, experience_level: experienceLevel, domain }),
      });
      if (!response.ok) {
        throw new Error('Failed to start interview');
      }
      const data = await response.json();
      onInterviewStart(data.interview_id, data.question, data.total_questions);
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="experience">Experience Level</Label>
        <Select
          value={experienceLevel}
          onValueChange={setExperienceLevel}
          required
        >
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
        <Select
          value={domain}
          onValueChange={setDomain}
          required
        >
          <SelectTrigger id="domain">
            <SelectValue placeholder="Select domain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="software_engineering">Software Engineering</SelectItem>
            <SelectItem value="data_science">Data Science</SelectItem>
            <SelectItem value="product_management">Product Management</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Starting Interview...' : 'Start Interview'}
      </Button>
    </form>
  );
}