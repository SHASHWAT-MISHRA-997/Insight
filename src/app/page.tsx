
'use client';

import {useState} from 'react';
import {summarizePaper} from '@/ai/flows/summarize-paper';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {toast} from "@/hooks/use-toast"
import {useToast} from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {Info} from 'lucide-react';

export default function Home() {
  const [paperText, setPaperText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const result = await summarizePaper({paperText});
      setSummary(result.summary);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
      console.error('Error summarizing paper:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPaperText(text);
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
      console.error('Failed to read clipboard contents: ', error);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
       toast({
        variant: "destructive",
        title: "Error",
        description: 'No file selected',
      })
      return;
    }

    try {
      const text = await file.text();
      setPaperText(text);
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
      console.error('Failed to read file: ', error);
    }
  };
  const {toast} = useToast()

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-10 bg-light-gray">
      <h1 className="text-4xl font-bold text-deep-blue mb-4">Insightful Scholar</h1>
      <p className="text-md text-deep-blue mb-8">Summarize long academic papers into key insights.</p>

      <div className="w-full max-w-3xl flex flex-col gap-4">
        <Card className="bg-light-gray shadow-md">
          <CardHeader>
            <CardTitle className="text-deep-blue text-lg">Document Input</CardTitle>
            <CardDescription className="text-gray-600">Upload a PDF or paste the text of an academic paper.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Tip!</AlertTitle>
                <AlertDescription>
                  You can upload a file, paste from clipboard or type directly into the editor below
                </AlertDescription>
              </Alert>
            <div className="flex items-center space-x-2">
              <label
                htmlFor="upload"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 hover-lightning"
              >
                Upload PDF/TXT
                <Input type="file" id="upload" className="hidden" accept=".pdf,.txt" onChange={handleFileChange} />
              </label>
              <Button variant="outline" size="sm" onClick={handlePaste} className="hover-lightning">Paste from Clipboard</Button>
            </div>
            <Textarea
              placeholder="Paste or type your paper text here..."
              className="bg-white text-deep-blue"
              value={paperText}
              onChange={(e) => setPaperText(e.target.value)}
            />
          </CardContent>
        </Card>

        <Button
          className="bg-teal text-white hover:bg-teal-600 hover-lightning"
          onClick={handleSummarize}
          disabled={loading}
        >
          {loading ? 'Summarizing...' : 'Generate Summary'}
        </Button>

        {summary && (
          <Card className="bg-light-gray shadow-md">
            <CardHeader>
              <CardTitle className="text-deep-blue text-lg">Summary</CardTitle>
              <CardDescription className="text-gray-600">Key insights from the paper.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-deep-blue">{summary}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
