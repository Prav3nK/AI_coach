'use client'

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, StopCircle } from 'lucide-react';

interface InterviewSessionProps {
  interviewId: string;
  initialQuestion: string | { question: string; reference_answer: string };
  totalQuestions: number;
  onInterviewComplete: () => void;
}

export default function InterviewSession({
  interviewId,
  initialQuestion,
  totalQuestions,
  onInterviewComplete,
}: InterviewSessionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscriptTemp = '';

        for (const result of Array.from(event.results)) {
          if (result.isFinal) {
            finalTranscript += result[0].transcript + ' ';
          } else {
            interimTranscriptTemp += result[0].transcript;
          }
        }

        if (finalTranscript) {
          setAnswer((prevAnswer) => prevAnswer + finalTranscript.trim());
        }

        setInterimTranscript(interimTranscriptTemp);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      recognitionRef.current.onend = () => {
        setInterimTranscript('');
      };
    } else {
      alert('Speech recognition not supported in your browser.');
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setInterimTranscript('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('interview_id', interviewId);
      formData.append('question_id', typeof currentQuestion === 'object' ? currentQuestion.question : currentQuestion);
      formData.append('answer_text', answer);

      if (audioBlob) {
        const arrayBuffer = await audioBlob.arrayBuffer();
        formData.append('audio_file', new Blob([arrayBuffer], { type: 'audio/wav' }), 'recording.wav');
      }

      const response = await fetch(`http://localhost:8000/submit_answer/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const data = await response.json();

      if (data.next_question === "Interview completed" || currentQuestionNumber >= totalQuestions) {
        onInterviewComplete();
      } else {
        setCurrentQuestion(data.next_question);
        setCurrentQuestionNumber((prev) => prev + 1);
      }

      setAnswer('');
      setAudioBlob(null);
      setInterimTranscript('');
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">AI Soft Skills Coach</h1>
        <p className="text-gray-600">Improve your interview skills with AI-powered feedback</p>
      </div>

      {currentQuestion === "Interview completed" || currentQuestionNumber > totalQuestions ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Interview Completed!</h2>
          <p>Thank you for completing the interview.</p>
          <Button onClick={onInterviewComplete}>View Summary</Button>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold">Question {currentQuestionNumber} of {totalQuestions}:</h2>
          <p>{typeof currentQuestion === 'object' ? currentQuestion.question : currentQuestion}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={`${answer}${interimTranscript ? ' ' + interimTranscript : ''}`}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[100px]"
            />
            {/* Simple disclaimer message */}
            <p className="text-sm text-yellow-800 bg-yellow-100 p-3 rounded-md">
              If you want to pause, stop recording first, then press start again to continue.
            </p>
            <div className="flex justify-between">
              <Button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={isRecording ? 'bg-red-500 hover:bg-red-600' : ''}
              >
                {isRecording ? <StopCircle className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
              </Button>
            </div>
          </form>
          {audioBlob && <p className="text-green-500">Audio recorded successfully!</p>}
        </>
      )}
    </div>
  );
}