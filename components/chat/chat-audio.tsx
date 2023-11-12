import qs from "query-string";
import axios from "axios";
import { useState, useRef } from 'react';

import { Mic, MicOff, Trash2, Upload } from 'lucide-react';
import { useUploadThing } from '@/lib/uploadthing';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface ChatAudioProps {
  apiUrl: string;
  query: Record<string, any>;
}

export const ChatAudio = ({
  apiUrl,
  query
}: ChatAudioProps) => {

  const [recording, setRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string>('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const { startUpload } = useUploadThing("messageFile", {
    onClientUploadComplete: () => {
      setUploading(false);
    },
    onUploadError: () => {
      alert("error occurred while uploading");
    },
    onUploadBegin: () => {
      setUploading(true);
      setAudioURL("");
    }
  });

  const startRecording = (): void => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream: MediaStream) => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.start();

        const audioChunks: BlobPart[] = [];
        mediaRecorder.current.addEventListener('dataavailable', (event: BlobEvent) => {
          audioChunks.push(event.data);
        });

        setRecording(true);

        mediaRecorder.current.addEventListener('stop', () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });

          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioURL(audioUrl);

          const newAudioFile = new File([audioBlob], 'recordedAudio.mp3', { type: 'audio/mpeg' });
          setAudioFile(newAudioFile);
        });
      });
  };

  const stopRecording = (): void => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  const deleteRecording = () => {
    setAudioURL("");
  }

  const uploadRecording = async () => {
    if (audioFile) {
      const res = await startUpload([audioFile]);

      try {
        const url = qs.stringifyUrl({
          url: apiUrl || "",
          query,
        });

        await axios.post(url, {
          fileUrl: res?.[0].url,
          content: res?.[0].url,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div>
      <div className='absolute right-16'>
        {uploading &&
          <div className='mt-1 flex space-x-1 items-center'>
            <Upload
              className="h-3 animate-ping"
              color="#9a79c3"
            />
          </div>
        }
        {audioURL &&
          <div className='flex items-center space-x-1'>
            <audio src={audioURL} controls className='h-6' />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className='h-4 hover:bg-transparent m-1 p-1'
                    onClick={uploadRecording}
                  >
                    <Upload
                      className='h-4'
                      color="#9a79c3"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className='h-4 hover:bg-transparent m-1 p-1'
                    onClick={deleteRecording}
                  >
                    <Trash2
                      className='h-4'
                      color="#db3366"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        }
      </div>

      <button onClick={startRecording} className={recording ? 'hidden' : 'absolute right-8'}>
        <Mic color="#c7bdbd" />
      </button>

      <button onClick={stopRecording} className={!recording ? 'hidden' : 'animate-pulse absolute right-8'}>
        <MicOff color="#db3366" />
      </button>
    </div >
  );
};
