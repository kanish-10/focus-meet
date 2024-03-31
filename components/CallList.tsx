// @ts-nocheck

'use client'

import React, { useEffect, useState } from 'react'
import { useGetCalls } from '@/hooks/use-get-calls'
import { useRouter } from 'next/navigation'
import { CallRecording } from '@stream-io/video-client'
import MeetingCard from '@/components/cards/MeetingCard'
import { Call } from '@stream-io/video-react-sdk'
import Loader from '@/components/Loader'
import { toast } from '@/components/ui/use-toast'

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls()
  const router = useRouter()
  const [recordings, setRecordings] = useState<CallRecording>([])

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings.map((call) => call.queryRecordings())
        )

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings)

        setRecordings(recordings)
      } catch (e) {
        toast({ title: 'Try again later' })
      }
    }
    if (type === 'recordings') fetchRecordings()
  }, [type, callRecordings])

  const getCalls = () => {
    switch (type) {
      case 'upcoming':
        return upcomingCalls
      case 'ended':
        return endedCalls
      case 'recordings':
        return recordings
      default:
        return []
    }
  }

  const getNoCallsMessage = () => {
    switch (type) {
      case 'upcoming':
        return 'No Upcoming Calls'
      case 'ended':
        return 'No Previous Calls'
      case 'recordings':
        return 'No Recorded Calls'
      default:
        return ''
    }
  }

  const calls = getCalls()
  const noCallsMessage = getNoCallsMessage()

  if (isLoading) return <Loader />

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0
        ? (
            calls.map((call) => (
          <MeetingCard
            key={(call as Call).id}
            date={
              call.state?.startsAt?.toLocaleString() ||
              call.start_time?.toLocaleString()
            }
            handleClick={
              type === 'recordings'
                ? () => router.push(`${call.url}`)
                : () => router.push(`/meeting/${call.id}`)
            }
            icon={
              type === 'ended'
                ? '/icons/previous.svg'
                : type === 'upcoming'
                  ? '/icons/upcoming.svg'
                  : '/icons/recordings.svg'
            }
            link={
              type === 'recordings'
                ? call.url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call.id}`
            }
            title={
              (call as Call).state?.custom?.description ||
              (call as CallRecording).filename?.substring(0, 20) ||
              'No Description'
            }
            isPreviousMeeting={type === 'ended'}
            buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
            buttonText={type === 'recordings' ? 'Play' : 'Start'}
          />
            ))
          )
        : (
        <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
          )}
    </div>
  )
}

export default CallList
